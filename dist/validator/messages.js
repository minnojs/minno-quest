/* jshint esnext:true */
define(function(){
	return {
		warn: function(message, test){
			return {level:'warn', message: message, test:test};
		},
		error: function(message, test){
			return {level:'error', message: message, test:test};
		},
		row: function(element, testArr){

			var messages = testArr
				.reduce((previous, current)=>previous.concat(current), []) // concatAll
				.filter(msg => msg) // clean empty
				.filter(msg => typeof msg.test == 'function' ? msg.test(element) : !!msg.test); // run test...

			return !messages.length ? null : {
				element: element,
				messages: messages
			};
		}
	};
});