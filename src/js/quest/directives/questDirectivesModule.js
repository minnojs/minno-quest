define(function(require){
    var angular = require('angular');
    var _ = require('underscore');

    // set modules that are requirements for the quest module
    var module = angular.module('questDirectives',[
        require('utils/timer/timer-module').name,
        require('utils/utils/utilsModule').name,
        require('./buttons/buttons').name,
        require('utils/database/template/templateModule').name,
        require('utils/console/consoleModule').name,
        require('utils/modal/modalModule').name
    ]);

    module.controller('questController', require('./questController'));
    module.factory('questGuid', require('./guid'));
    module.directive('piQuest', require('./piQuest/piQuest-directive'));
    module.directive('piqPage', require('./piQuest/piqPage-directive'));
    module.directive('questWrapper', require('./wrapper/wrapper-directive'));
    module.directive('questInfo', function(){return {};});

    module.directive('questText', require('./text/textDirective'));
    module.directive('questTextarea', require('./text/textDirective')); // uses the same directive as questText
    module.directive('questTextNumber', require('./text/text-number-directive'));

    module.service('questSelectMixer', require('./select/selectMixerProvider'));
    module.directive('questDropdown',require('./select/dropdownDirective'));
    module.directive('questSelectOne',require('./select/selectOneDirective'));
    module.directive('questSelectMulti',require('./select/selectMultiDirective'));

    module.directive('questRank',require('./rank/rankDirective'));

    module.value('questShuffle', _.shuffle); // we already have this in database but I don't want the directives to be too interdependant
    module.directive('questGrid', require('./grid/gridDirective'));
    module.directive('questGridRow', require('./grid/gridRowDirective'));
    module.directive('questMultiGrid', require('./multiGrid/multiGridDirective'));
    module.directive('questMultiGridRow', require('./multiGrid/multiGridRowDirective'));

    module.directive('questSlider',require('./slider/sliderDirective'));
    module.directive('piSlider',require('./slider/slider'));
    module.directive('piPointerdown',require('./slider/piPointerdown'));


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
    module.filter('toRegex', require('./toRegexFilter'));
    module.filter('dfltUnits', require('./dfltUnitsFilter'));

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

    return module;
});
