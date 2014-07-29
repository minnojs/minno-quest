/*
 * The directive for creating the generic question layout (stub, surrounding etc.).
 */
define(function (require) {

	var prefix = 'quest';
	var template = require('text!./wrapper.html');

	function capitaliseFirstLetter(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	directive.$inject = ['$compile', '$injector'];
	function directive($compile, $injector){
		return {
			replace: true,
			template:template,
			priority: 5, // Allows the wrapper to use the same scope as the questions
			scope:{
				data: '=questData',
				current: '=questCurrent'
			},
			link: function(scope,element) {
				var type = scope.data.type || 'text';
				var questElement = element.children().eq(1);
				var SNAKE_CASE_REGEXP = /[A-Z]/g;
				var attrName = prefix + capitaliseFirstLetter(type);

				// Make sure that this directive exists
				if (!$injector.has(attrName + 'Directive')){
					throw new Error ('Unknown question type: "' + type + '"');
				}

				// snake case the attr name
				attrName = attrName.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
					return (pos ? '-' : '') + letter.toLowerCase();
				});

				// add the appropriate attribute to the directive and compile it
				questElement.attr(attrName,true);
				$compile(questElement)(scope);
			}

		};
	}

	return directive;
});