/*
 * The directive for creating text inputs.
 */
define(function (require) {
	// This is the only way to get a non js file relatively
	var template = require('text!./text.html');

	var directive = function(){
		return {
			replace: true,
			template:template,
			require: ['form', 'ngModel', '^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls[0];
				var ngModel = ctrls[1];

				scope.form = form;

				scope.ctrl.registerModel(ngModel, {
					dflt: ""
				});

				scope.data.autoSubmit && element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function(){
							scope.$emit('quest:submit');
						});
						event.preventDefault();
					}
				});

			}
		};
	};

	return directive;
});