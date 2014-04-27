/*
 * The directive for displaying a whole page of questions
 */
define(function (require) {
	var template = require('text!./piQuest.html');


	directive.$inject = ['$sequence','currentTask'];
	function directive($sequence, currentTask){
		return {
			replace: true,
			//transclude: 'element', // replace element instead of replacing contents
			template:template,
			require: 'form',
			link: function(scope, element, attr, ctrls) {
				var form = ctrls;

				scope.form = form;
				scope.$sequence = $sequence;

				scope.submit = function(){
					if (form.$valid){
						$sequence.next();
					}
				};



				scope.page = currentTask;
			}
		};
	}

	return directive;
});