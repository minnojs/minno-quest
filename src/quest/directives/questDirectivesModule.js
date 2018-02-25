import angular from 'angular';
import _ from 'lodash';
import timerModule from 'utils/timer/timer-module';
import utilsModule from 'utils/utils/utilsModule';
import buttons from './buttons/buttons';
import templateModule from 'minno-sequencer/src/template/templateModule';
import consoleModule from 'utils/console/consoleModule';
import modalModule from 'utils/modal/modalModule';
import questController from './questController';
import guid from './guid';
import piQuestDirective from './piQuest/piQuest-directive';
import piqPageDirective from './piQuest/piqPage-directive';
import wrapperDirective from './wrapper/wrapper-directive';
import textDirective from './text/textDirective';
import textNumberDirective from './text/text-number-directive';
import selectMixerProvider from './select/selectMixerProvider';
import dropdownDirective from './select/dropdownDirective';
import selectOneDirective from './select/selectOneDirective';
import selectMultiDirective from './select/selectMultiDirective';
import rankDirective from './rank/rankDirective';
import gridDirective from './grid/gridDirective';
import gridRowDirective from './grid/gridRowDirective';
import multiGridDirective from './multiGrid/multiGridDirective';
import multiGridRowDirective from './multiGrid/multiGridRowDirective';

import sliderDirective from './slider/sliderDirective';
import slider from './slider/slider';
import piPointerdown from './slider/piPointerdown';
import toRegexFilter from './toRegexFilter';
import dfltUnitsFilter from './dfltUnitsFilter';

export default module;

// set modules that are requirements for the quest module
var module = angular.module('questDirectives',[
    timerModule.name,
    utilsModule.name,
    buttons.name,
    templateModule.name,
    consoleModule.name,
    modalModule.name
]);

module.controller('questController', questController);
module.factory('questGuid', guid);
module.directive('piQuest', piQuestDirective);
module.directive('piqPage', piqPageDirective);
module.directive('questWrapper', wrapperDirective);
module.directive('questInfo', function(){return {};});

module.directive('questText', textDirective);
module.directive('questTextarea', textDirective); // uses the same directive as questText
module.directive('questTextNumber', textNumberDirective);

module.service('questSelectMixer', selectMixerProvider);
module.directive('questDropdown',dropdownDirective);
module.directive('questSelectOne',selectOneDirective);
module.directive('questSelectMulti',selectMultiDirective);

module.directive('questRank',rankDirective);

module.value('questShuffle', _.shuffle); // we already have this in database but I don't want the directives to be too interdependant
module.directive('questGrid', gridDirective);
module.directive('questGridRow', gridRowDirective);
module.directive('questMultiGrid', multiGridDirective);
module.directive('questMultiGridRow', multiGridRowDirective);
module.directive('questSlider',sliderDirective);
module.directive('piSlider',slider);
module.directive('piPointerdown',piPointerdown);

// @TODO: move to utils or something
module.config(['$sceProvider', function($sceProvider){
    $sceProvider.enabled(false);
}]);

module.directive('piQuestValidation', function(){
    return {
        replace:true,
        transclude: true,
        scope: {unvalid:'=piQuestValidation',postSubmit:'=piPostSubmit'},
        template: [
            '<div class="alert alert-danger" role="alert" ng-show="unvalid && ($parent.$parent.$parent.submitAttempt || postSubmit)">',
            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>',
            '<span ng-transclude></span>',
            '</div>'
        ].join('')
    };
});

// filters
module.filter('toRegex', toRegexFilter);
module.filter('dfltUnits', dfltUnitsFilter);

// auto focus on first input element
module.directive('piqPage', function(){
    return {
        link: function(scope, element){
            var page = scope.page;
            // let page render before focusing
            page.autoFocus && setTimeout(function(){
                var wrapper = element[0].querySelector('[quest-wrapper]');
                var el = wrapper && wrapper.querySelector('input, textArea, select, button');
                if (el) el.focus();
            });
        }
    };
});
