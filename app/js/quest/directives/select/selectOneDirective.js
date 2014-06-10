/*
 * The directive for creating selectOne inputs.
 */
define(function (require) {
	var _ = require('underscore');

	// This is the only way to get a non js file relatively
	var template = require('text!./selectOne.html');

	directive.$inject = ['questSelectMixer'];
	function directive(mixer){
		return {
			replace: true,
			template:template,
			require: ['^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var page = ctrls[0];
				var ctrl = scope.ctrl;

				// push controller into page cue
				page && page.addQuest(ctrl);

				// render quest
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// set the default value
				if (_.isUndefined(scope.data.dflt)){
					scope.response = '';
				} else {
					scope.response = scope.data.dflt;
					scope.responseObj = _.find(scope.quest.answers, function(answer){ return answer.value === scope.data.dflt;});
				}

				// update controller with the response
				scope.$watch('responseObj',function(newValue, oldValue, scope){
					if (newValue){
						scope.response = newValue.value;
						ctrl.log.responseObj = newValue;
					}
				});
			}
		};
	}

	return directive;
});