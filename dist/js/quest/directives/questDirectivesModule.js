define(["require","angular","underscore","utils/timer/timer-module","utils/utils/utilsModule","./buttons/buttons","utils/database/template/templateModule","utils/console/consoleModule","utils/modal/modalModule","./questController","./piQuest/piQuest-directive","./piQuest/piqPage-directive","./wrapper/wrapper-directive","./text/textDirective","./text/textDirective","./text/text-number-directive","./select/selectMixerProvider","./select/dropdownDirective","./select/selectOneDirective","./select/selectMultiDirective","./grid/gridDirective","./grid/gridRowDirective","./slider/sliderDirective","./slider/slider","./toRegexFilter","./dfltUnitsFilter"],function(e){var t=e("angular"),n=e("underscore"),r=t.module("questDirectives",[e("utils/timer/timer-module").name,e("utils/utils/utilsModule").name,e("./buttons/buttons").name,e("utils/database/template/templateModule").name,e("utils/console/consoleModule").name,e("utils/modal/modalModule").name]);return r.controller("questController",e("./questController")),r.directive("piQuest",e("./piQuest/piQuest-directive")),r.directive("piqPage",e("./piQuest/piqPage-directive")),r.directive("questWrapper",e("./wrapper/wrapper-directive")),r.directive("questText",e("./text/textDirective")),r.directive("questTextarea",e("./text/textDirective")),r.directive("questTextNumber",e("./text/text-number-directive")),r.service("questSelectMixer",e("./select/selectMixerProvider")),r.directive("questDropdown",e("./select/dropdownDirective")),r.directive("questSelectOne",e("./select/selectOneDirective")),r.directive("questSelectMulti",e("./select/selectMultiDirective")),r.value("questShuffle",n.shuffle),r.directive("questGrid",e("./grid/gridDirective")),r.directive("questGridRow",e("./grid/gridRowDirective")),r.directive("questSlider",e("./slider/sliderDirective")),r.directive("piSlider",e("./slider/slider")),r.directive("piQuestValidation",function(){return{replace:!0,transclude:!0,scope:{unvalid:"=piQuestValidation"},template:['<div class="alert alert-danger" role="alert" ng-show="unvalid">','<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>',"<span ng-transclude></span>","</div>"].join("")}}),r.filter("toRegex",e("./toRegexFilter")),r.filter("dfltUnits",e("./dfltUnitsFilter")),r});