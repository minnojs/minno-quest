/*
 * The directive for creating selectMulti inputs.
 */
define(function (require) {
	var _ = require('underscore');

	// This is the only way to get a non js file relatively
	var template = require('text!./selectMulti.html');

	directive.$inject = ['questSelectMixer'];
	function directive(mixer){
		return {
			replace: true,
			template:template,
			require: ['^?piqPage', 'ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ctrl = scope.ctrl;
				var ngModel = ctrls[1];

				ctrl.registerModel(ngModel, {
					dflt: []
				});

				ngModel.$isEmpty = function(){
					return _.isEmpty(ngModel.$viewValue);
				};

				// render questions
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// mark the chosen questions
				_.each(scope.quest.answers, function(answer){
					// mark it chosen if
					if (~_.indexOf(scope.response, answer.value)){
						answer.chosen = true;
					}
				});

				// update controller with the response
				scope.$watch('quest.answers',function(newValue, oldValue){
					if (newValue === oldValue){
						return;
					}

					// get chosen answers
					scope.response = _(newValue)
						.filter(function(answer){return answer.chosen;})
						.pluck('value')
						.value();
				},true); // deep watch
			}
		};
	}

	return directive;
});