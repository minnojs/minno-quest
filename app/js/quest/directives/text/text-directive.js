/*
 * The directive for creating textNumber inputs.
 */
define(function (require) {
	// This is the only way to get a non js file relatively
	var template = require('text!./text.html');

	var directive = function(){
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

				// set the default value
				scope.response = typeof scope.data.dflt == 'undefined' ? '' : scope.data.dflt;

				// update data object with the response
				scope.$watch('response',function(newValue, oldValue, scope){
					scope.data.response = newValue;
				});
			}
		};
	};

	return directive;
});