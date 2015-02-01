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
				var data = scope.data;

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