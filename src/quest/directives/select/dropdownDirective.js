/*
 * The directive for creating dropdown inputs.
 * scope.response is the value of the chosen response
 */

import template from './dropdown.html';

directive.$inject = ['questSelectMixer','$timeout'];
function directive(mixer,$timeout){
    return {
        replace: true,
        template:template,
        require: ['ngModel','form'],
        controller: 'questController',
        controllerAs: 'ctrl',
        scope:{
            data: '=questData'
        },
        link: function(scope, element, attr, ctrls) {
            var ngModel = ctrls[0];
            var ctrl = scope.ctrl;

            scope.form = ctrls[1];

            ctrl.registerModel(ngModel, {
                dflt: NaN
            });

            // render quest if needed
            scope.quest = {
                answers: mixer(scope.data.answers || [], scope.data)
            };

            // createChooseText
            scope.chooseText = 'chooseText' in scope.data && scope.data.chooseText;

            /**
             * Manage auto submit
             */
            scope.autoSubmit = function(){
                $timeout(function(){
                    scope.$emit('quest:submit:now');
                });
            };
        }
    };
}

export default directive;
