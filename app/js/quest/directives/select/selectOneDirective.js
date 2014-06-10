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
			require: ['form', '^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls[0];
				var page = ctrls[1];
				var ctrl = scope.ctrl;

				page && page.addQuest(ctrl);

				scope.form = form;

				// render quest
				scope.quest = {
					answers: mixer(scope.data.answers || [])
				};

				// set the default value
				scope.response = typeof _.isUndefined(scope.data.dflt) ? '' : scope.data.dflt;

				// update data object with the response
				scope.$watch('response',function(newValue, oldValue, scope){
					scope.response = newValue.value;
					ctrl.log.response = newValue;
				});
			}
		};
	}

	return directive;
});