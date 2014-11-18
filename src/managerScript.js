define(['managerAPI'], function(Manager){

	var API = new Manager();

	API.addSettings('onEnd', function(){console.log('onEnd');});
	API.addSettings('onPreTask', function(currentTask, $http){
		var data = {taskName: currentTask.name, taskNumber: currentTask.$meta.number};
		return $http.post('task/advance/url', data);
	});

	API.addSequence([
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

	return API.script;
});