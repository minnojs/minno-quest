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
			require: 'form',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls;

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