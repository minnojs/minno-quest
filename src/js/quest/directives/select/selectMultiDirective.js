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

				// some specific css added to the list
                scope.listCss = {};
                scope.listItemCss = {};

                switch (data.style){
                    case 'horizontal' :
                        scope.listClass = 'btn-group btn-group-justified btn-group-lg';
                        scope.listItemClass = 'btn btn-select';
                        break;
                    case 'multiButtons':
                        scope.listClass = 'btn-toolbar';
                        scope.listItemClass = 'btn  btn-select';
                        scope.listCss.lineHeight = 2.8;
                        break;
                    case 'list':
						/* fall through */
                    default:
                        scope.listClass = 'list-group';
                        scope.listItemClass = 'list-group-item';
                }

                data.minWidth && (scope.listItemCss.minWidth = data.minWidth);

				// we need to implement this manually as ngRequired returns undefined instead of an array
                if (data.required){
                    ngModel.$parsers.unshift(requiredValidator);
                    requiredValidator(ngModel.$viewValue);
                }


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

                function requiredValidator(value){
                    ngModel.$setValidity('required', !ngModel.$isEmpty(value));
                    return value;
                }
            }
        };
    }

    return directive;
});