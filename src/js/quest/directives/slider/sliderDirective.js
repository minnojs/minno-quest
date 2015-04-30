define(function(require){

	var _ = require('underscore');
	_;


	sliderDirective.$inject = [];
	function sliderDirective(){
		return {
			replace: true,
			template: require('text!./slider.html'),
			require: ['ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ngModel = ctrls[0];
				var ctrl = scope.ctrl;

				ctrl.registerModel(ngModel, {
					dflt: 0
				});
			}

		};
	}

	return sliderDirective;
});