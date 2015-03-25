define(function(require){
	var api = require('APIs/APIConstructor');

	return api({
		type: 'manager',
		sets: ['tasks']
	});
});