define(function(){
	parseProvider.$inject = ['mixer'];
	function parseProvider(mixer){
		function parse(script, db, sequence){
			db.create('pages');
			db.create('questions');

			db.add('pages', script.pages);
			db.add('questions', script.questions);

			sequence.add(mixer(script.sequence));
		}

		return parse;
	}

	return parseProvider;
});