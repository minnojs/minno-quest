define(function(){

	function parseProvider(){
		function parse(script, db, sequence){
			db.createColl('pages');
			db.createColl('questions');

			db.add('pages', script.pages || []);
			db.add('questions', script.questions || []);
		}

		return parse;
	}

	return parseProvider;
});