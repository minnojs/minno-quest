define(['managerAPI'], function(Manager){

	// This code is responsible for styling the miQuest tasks as panels (like piMessage)
	// Don't touch unless you know what you're doing
	var css = '[pi-quest]{background-color: #fff;border: 1px solid transparent;border-radius: 4px;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);margin-bottom: 20px;border-color: #bce8f1;padding:15px;}';
	window.angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";' + css + '</style>');

	var API = new Manager();

	API.addSettings('skip',true);
	
	API.setName('mgr');

	/**********
	***Define all the tasks in advance.
	**********/	
	API.addTasksSet({
		instructions: 
			[{type:'message', buttonText:'Continue'}], 
		
		consent : [{ 
			inherit:'instructions', name:'consent', templateUrl: 'consent.jst', title:'Consent', 
			piTemplate:true, header:'Consent Agreement: Implicit Social Cognition on the Internet'
		}], 
		
		realstart : [{
			inherit:'instructions', name:'realstart', templateUrl: 'intro.jst', title:'Introduction',
			piTemplate:true, header:'Welcome'
		}], 
		
		selectq : [{
			type: 'quest', name: 'selectq', scriptUrl: 'selectq.js'
		}],

		instnfc : [{
			inherit:'instructions', name:'instnfc', templateUrl: 'instnfc.jst', title:'Questionnaire',
			piTemplate:true, header:'Instructions'
		}], 
		nfc : [{
			type: 'quest', name: 'nfc', scriptUrl: 'nfc.js'
		}],


		userprevresp : [{
			type: 'quest', name: 'userprevresp', scriptUrl: 'userprevresp.js'
		}],

		dependency : [{
			type: 'quest', name: 'dependency', scriptUrl: 'dependency.js'
		}],
		
		openended : [{
			type: 'quest', name: 'openended', scriptUrl: 'openended.js'
		}],
		openendedlong : [{
			type: 'quest', name: 'openendedlong', scriptUrl: 'openendedlong.js'
		}],

		instgrid : [{
			inherit:'instructions', name:'instgrid', templateUrl: 'instgrid.jst', title:'Questionnaire',
			piTemplate:true, header:'Instructions'
		}], 
		grid : [{
			type: 'quest', name: 'grid', scriptUrl: 'grid.js'
		}],

		slider : [{
			type: 'quest', name: 'slider', scriptUrl: 'slider.js'
		}],
		buttons : [{
			type: 'quest', name: 'buttons', scriptUrl: 'buttons.js'
		}],
		buttonsadvanced : [{
			type: 'quest', name: 'buttonsadvanced', scriptUrl: 'buttonsadvanced.js'
		}],
		buttonsonepage : [{
			type: 'quest', name: 'buttonsonepage', scriptUrl: 'buttonsonepage.js'
		}],

		instimages : [{
			inherit:'instructions', name:'instimages', templateUrl: 'instimages.jst', title:'Image Rating',
			piTemplate:true, header:'Instructions'
		}], 
		rateimages : [{
			type: 'quest', name: 'rateimages', scriptUrl: 'rateimages.js'
		}],
		rateimagessizes : [{
			type: 'quest', name: 'rateimagessizes', scriptUrl: 'rateimagessizes.js'
		}]
	});

	

	API.addSequence([
		{inherit:'consent'},
		{inherit:'realstart'},
		{inherit:'selectq'},
		
		//Select one questionnaire, based on the user's response in selectq.
		{
			mixer : 'multiBranch',
			branches : 
			[
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'basicScale'}],
					data : [{inherit:'instnfc'}, {inherit:'nfc'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'rateimages'}],
					data : [{inherit:'instimages'}, {inherit:'rateimages'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'rateimagessizes'}],
					data : [{inherit:'instimages'}, {inherit:'rateimagessizes'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'buttons'}],
					data : [{inherit:'instgrid'}, {inherit:'buttons'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'buttonsadvanced'}],
					data : [{inherit:'instgrid'}, {inherit:'buttonsadvanced'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'buttonsonepage'}],
					data : [{inherit:'instgrid'}, {inherit:'buttonsonepage'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'slider'}],
					data : [{inherit:'instgrid'}, {inherit:'slider'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'grid'}],
					data : [{inherit:'instgrid'}, {inherit:'grid'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'userprevresp'}],
					data : [{inherit:'userprevresp'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'dependency'}],
					data : [{inherit:'dependency'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'openended'}],
					data : [{inherit:'openended'}]
				},
				{
					conditions : [{compare:'global.selectq.questions.selectq.response', to:'openendedlong'}],
					data : [{inherit:'openendedlong'}]
				}
			]
		},
		
		{			
			inherit:'instructions', name:'end', title:'THE END', 
			piTemplate:true, header:'THE END',  template: '<div><br/>You chose <%=global.selectq.questions.selectq.response%>, and now we are DONE.</div>'
		}
	]);

	return API.script;
});
