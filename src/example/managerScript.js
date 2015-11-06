define(['managerAPI'], function(Manager){

	var API = new Manager();

	API.addSettings('injectStyle', [
		'[pi-quest] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
		'[piq-page] > ol {margin: 15px;}',
		'[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
		'[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
		'[pi-quest]::after {clear: both;}',
		'[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 0; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
		'[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}'
	].join(''));

	API.addGlobal({$mTurk:{assignmentId:0,hitId:0,workerId:0}});

	API.addTasksSet('instructions', {type:'message', keys:' '});

	API.addTasksSet('quests', [
		{
			type:'quest',
			name: 'first',
			scriptUrl: 'questScript1.js'
		},
		{
			type:'quest',
			name:'second',
			scriptUrl: 'questScript2.js'
		}
	]);

	API.addSettings('onEnd', function(){console.log('onEnd');});
	API.addSettings('skip', true);

	API.addSequence([
		{
			type:'quest',
			name: 'first',
			scriptUrl: 'questScript1.js'
		},
		{script:function(done){done();}},
		// {
		// 	type: 'pip',
		// 	name: 'iat',
		// 	version: '123',
		// 	scriptUrl: '/test/example.js'
		// },

		{
			type:'quest',
			name: 'first',
			scriptUrl: 'questScript1.js'
		},
		{type:'post', data:{1:2}, url:'my/post/url'},
		{
			script: {
				// custom script content
				content: 'Hi there, I\'m your custom message',

				// the activator function uses three dependencie
		 		play: function activator(done, script, $element){
					var timeoutId = setTimeout(done, 5000);
					$element.html(script.content);

					// will be called at the end of the task to clean things up
					// (whether the end is forced or triggered by 'done')
					return function clear(){
						clearTimeout(timeoutId);
						$element.empty();
					};
				}
			}
		},
		{
			mixer:'branch',
			conditions: [{compare:'global.cond', to: 'myConds'}],
			data: [
				{inherit:'instructions', template: 'iat.html <%= global.cond %>'}
			]
		},

		{inherit:'instructions', templateUrl: 'iat.html'},

		{inherit:{type:'exRandom', set:'quests'}},
		//{inherit:'instructions', templateUrl: '../example/biat.html'},
		{
			type: 'pip',
			name: 'biat',
			version: '1',
			scriptUrl: 'biat.js'
		},

		{inherit:'instructions', templateUrl: '../example/iat.html'},

		{
			type: 'pip',
			name: 'iat',
			version: "0.0.12",
			scriptUrl: 'iat.js'
		},
		{inherit:'instructions', template: 'Please answer the following questionnaire:'},
		{inherit:{type:'exRandom', set:'quests'}},
		{inherit:'instructions', template: 'Please answer the following questionnaire:'},
		{inherit:{type:'exRandom', set:'quests'}}
	]);

	return API.script;
});