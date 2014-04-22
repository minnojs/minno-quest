/*
 * The directive for displaying a whole page of questions
 */
define(function (require) {
	var template = require('text!./piQuest.html');

	directive.$inject = ['$sequence','currentTask'];
	function directive($sequence, currentTask){
		return {
			replace: true,
			transclude: 'element', // replace element instead of replacing contents
			template:template,
			priority: 5, // Allows the wrapper to use the same scope as the questions
			link: function(scope){
				scope.$sequence = $sequence;
				scope.page = currentTask;
			}
		};
	}

	return directive;
});