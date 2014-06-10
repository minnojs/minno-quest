
/*
 * The directive for creating textNumber inputs.
 */
define(function (require) {
	// This is the only way to get a non js file relatively
	var template = require('text!./text-number.html');

	var directive = function(){
		return {
			replace: true,
			template:template,
			require: ['form', '^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls[0];
				var page = ctrls[1];
				var ctrl = scope.ctrl;

				var input = element.find('input');
				var ngModel = input.eq(0).controller('ngModel');

				page && page.addQuest(ctrl);

				// we have a specific problem with min max that don't take internal
				// http://stackoverflow.com/questions/15656617/validation-not-triggered-when-data-binding-a-number-inputs-min-max-attributes
				var minValidator = function(value) {
					var min = parseFloat(scope.data.min);
					if (!isNaN(min) && value < min) {
						ngModel.$setValidity('qstMin', false);
						return undefined;
					} else {
						ngModel.$setValidity('qstMin', true);
						return value;
					}
				};

				ngModel.$parsers.push(minValidator);
				ngModel.$formatters.push(minValidator);

				var maxValidator = function(value) {
					var max = parseFloat(scope.data.max);
					if (!isNaN(max) && value > max) {
						ngModel.$setValidity('qstMax', false);
						return undefined;
					} else {
						ngModel.$setValidity('qstMax', true);
						return value;
					}
				};

				ngModel.$parsers.push(maxValidator);
				ngModel.$formatters.push(maxValidator);

				scope.form = form;

				// set the default value
				scope.response = typeof scope.data.dflt == 'undefined' ? '' : scope.data.dflt;

				// update data object with the response
				scope.$watch('response',function(newValue, oldValue, scope){
					scope.data.response = newValue;
				});
			}
		};
	};

	return directive;
});