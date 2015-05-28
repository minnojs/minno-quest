define(function(require){
	var api = require('APIs/APIConstructor');

	return api({
		type: 'quest',
		sets: ['pages', 'questions']
	});
});