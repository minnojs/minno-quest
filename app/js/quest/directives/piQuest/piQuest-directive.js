/*
 * The directive for displaying a whole page of questions
 */
define(function (require) {
	var template = require('text!./piQuest.html');


	directive.$inject = ['$rootScope','Task'];
	function directive($rootScope, Task){
		return {
			replace: true,
			template:template,
			require: 'form',
			link: function(scope, element, attr, ctrls) {
				var task = scope.task = new Task($rootScope.script);
				var form = scope.form = ctrls;



				scope.page = task.proceed();

				scope.next = function(){
					if (form.$valid){
						scope.page = task.proceed();
					}
				};
			}
		};
	}

	return directive;
});