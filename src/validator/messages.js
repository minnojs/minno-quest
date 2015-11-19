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
				.reduce((previous, current)=>previous.concat(current), [])
				.filter(msg => msg)
				.filter(msg => typeof msg == 'function' ? msg.test(element) : !!msg.test);

			return !messages.length ? null : {
				element: element,
				messages: messages
			};
		}
	};
});