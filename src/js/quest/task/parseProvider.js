define(function(){
	parseProvider.$inject = ['mixer'];
	function parseProvider(mixer){
		function parse(script, db, sequence){
			db.createColl('pages');
			db.createColl('questions');

			db.add('pages', script.pages || []);
			db.add('questions', script.questions || []);

			if (!script.sequence) {
				throw new Error('No sequence found');
			}

			sequence.add(script.sequence);
		}

		return parse;
	}

	return parseProvider;
});