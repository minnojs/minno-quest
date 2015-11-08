define(function(require){
	var api = require('./APIConstructor');

	return api({
		type: 'manager',
		sets: ['tasks']
	});
});