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
			require: ['^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var page = ctrls[0];
				var ctrl = scope.ctrl;
				var dflt = scope.data.dflt;

				// push controller into page cue
				page && page.addQuest(ctrl);

				// render quest
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// set the default value
				if (_.isUndefined(dflt)){
					scope.response = [];
				} else {
					_.each(scope.quest.answers, function(answer){
						if (answer.dflt || _.indexOf(dflt, answer.value) != -1){
							answer.chosen = true;
						}
					});
				}

				ctrl.log.responseObj = scope.responseObj;

				// update controller with the response
				scope.$watch('quest.answers',function(newValue, oldValue, scope){
					if (newValue){
						scope.response = _(newValue)
							.filter(function(answer){return answer.chosen;})
							.pluck('value')
							.value();
					}
				},true);
			}
		};
	}

	return directive;
});