/*
 * The directive for creating selectOne inputs.
 *
 * scope.response is the value of the chosen response
 * scope.responseObj is the full answer object or undefined
 */
define(function (require) {

	var angular = require('angular');
	var template = require('text!./selectOne.html');

	directive.$inject = ['questSelectMixer', 'buttonConfig', '$compile'];
	function directive(mixer, buttonConfig, $compile){
		return {
			replace: true,
			require: ['ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ngModel = ctrls[0];
				var ctrl = scope.ctrl;
				var data = scope.data;

				// compile the template (this is currently the only way to use a scope dependent template)
				element.html(template);
				$compile(element.contents())(scope);

				ctrl.registerModel(ngModel, {
					dflt: NaN
				});

				// render quest if needed
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// update controller with the response
				scope.$watch('responseObj',function(newValue, oldValue){
					if (newValue === oldValue){
						return;
					}

					scope.response = newValue && newValue.value;
				});

				/**
				 * Required
				 * Since we don't control the ngModel element any more we need to manually create a required validation
				 * we don't implement $observe since in our case required is static
				 */

				if (scope.data.required){
					ngModel.$formatters.push(requiredValidator);
					ngModel.$parsers.unshift(requiredValidator);
				}

				/**
				 * Compute list styles
				 */

				// back support for "buttons"
				// @DEPRICATED
				if (scope.data.buttons){
					scope.data.style = 'horizontal';
				} else {
					scope.data.style == 'horizontal' && (scope.data.buttons = true);
				}

				scope.listClass = {
					'btn-group btn-group-justified btn-group-lg' : data.style == 'horizontal',
					'btn-toolbar' : data.style == 'multiButtons',
					'list-group' : !data.style || data.style == 'list'
				};

				// the active class is set by interpolation in class instead of ngClass
				scope.listItemClass = {
					'btn btn-success' : data.style == 'horizontal',
					'btn  btn-success' : data.style == 'multiButtons',
					'list-group-item' : !data.style || data.style == 'list'
				};

				// multiButtons needs some specific css added to the list
				scope.listCss = {};
				scope.listItemCss = {};
				data.style == 'multiButtons' && (scope.listCss.lineHeight = 2.8);
				data.hasOwnProperty('minWidth') && (scope.listItemCss.minWidth = data.minWidth);

				/**
				 * Manage auto submit
				 * @param  {event} e [description]
				 */
				scope.autoSubmit = function(e){
					if (!scope.data.autoSubmit){
						return;
					}

					var isActive = angular.element(e.target).hasClass(buttonConfig.activeClass);

					if (isActive){
						// this whole function happens within a digest cycle, so we don't need to $apply
						scope.$emit('quest:submit:now');
					}
				};

				function requiredValidator(value){
					var ctrl = ngModel;
					if (ctrl.$isEmpty(value)) {
						ctrl.$setValidity('required', false);
						return;
					} else {
						ctrl.$setValidity('required', true);
						return value;
					}
				}
			}
		};
	}

	return directive;
});