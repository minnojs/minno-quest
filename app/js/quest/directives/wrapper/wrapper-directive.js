/*
 * The directive for creating the generic question layout (stub, surrounding etc.).
 */
define(function (require) {
	var template = require('text!./wrapper.html');

	var directive = function(){
		return {
			replace: true,
			transclude: 'element', // replace element instead of replacing contents
			template:template,
			priority: 5, // Allows the wrapper to use the same scope as the questions
			scope:{
				data: '=questData'
			}
		};
	};

	return directive;
});