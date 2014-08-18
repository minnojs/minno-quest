/*
 * The directive for creating selectOne inputs.
 *
 * scope.response is the value of the chosen response
 * scope.responseObj is the full answer object or undefined
 */
define(function (require) {

	// This is the only way to get a non js file relatively
	var template = require('text!./selectOne.html');
	var angular = require('angular');

	directive.$inject = ['questSelectMixer', 'buttonConfig'];
	function directive(mixer, buttonConfig){
		return {
			replace: true,
			template:template,
			require: ['ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ngModel = ctrls[0];
				var ctrl = scope.ctrl;

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
			}
		};
	}

	return directive;
});