define(function(){

	parseProvider.$inject = ['piConsoleSettings'];
	function parseProvider(consoleSettings){
		function parse(script, db){
			db.createColl('pages');
			db.createColl('questions');

			db.add('pages', script.pages || []);
			db.add('questions', script.questions || []);

			script.settings || (script.settings = {});

			consoleSettings.tags = script.settings.DEBUG;
		}

		return parse;
	}

	return parseProvider;
});