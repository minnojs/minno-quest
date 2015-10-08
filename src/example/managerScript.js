define(['managerAPI'], function(Manager){

	var API = new Manager();
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
		// {
		// 	type: 'pip',
		// 	name: 'biat',
		// 	scriptUrl: '/test/distance.js'
		// },

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