define(function(require){

	var messages = require('./messages');
	var questParser = require('./parser').questElements;

	function questValidator(script){
		var errors = [];

		errors.push({type:'Settings', errors:[]});
		errors.push({type:'Pages', errors:[]});
		errors.push({type:'Questions', errors:[]});

		return errors;
	}

	return questValidator;

});