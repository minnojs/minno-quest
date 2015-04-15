/*
 * The directive for creating text inputs.
 */
define(function (require) {
	// This is the only way to get a non js file relatively
	var template = require('text!./text.html');
	var angular = require('angular');

	function textDirective(){
		return {
			replace: true,
			template:template,
			require: ['form', 'ngModel', 'questText'],
			controller: 'questController',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls[0];
				var ngModel = ctrls[1];
				var ctrl = ctrls[2];
				var data = scope.data;

				scope.form = form;
				scope.maxlengthLimit = maxlengthLimit;

				ctrl.registerModel(ngModel, {
					dflt: ""
				});

				data.autoSubmit && element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function(){
							scope.$emit('quest:submit:now');
						});
						event.preventDefault();
					}
				});

				// limit the length of the input string
				// essentially a formatter for the input ngModel
				function maxlengthLimit($event){
					var $input = angular.element($event.target);
					var response = $input.val();
					var limit = data.maxlength || response.length; // in case maxlength isn't defined...
					// update the scope
					scope.response = response.slice(0,limit);
				}
			}
		};
	}

	return textDirective;
});