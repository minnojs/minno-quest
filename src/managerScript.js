define(['managerAPI'], function(Manager){

	var API = new Manager();

	API.addSettings('onEnd', function(){console.log('onEnd');});

	API.addSequence([
		{
			type:'quest',
			scriptUrl: 'questScript1.js'
		},
		{
			type:'quest',
			scriptUrl: 'questScript2.js'
		}
	]);

	return API.script;
});