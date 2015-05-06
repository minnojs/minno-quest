define(function(require){

	var _ = require('underscore');
	_;


	sliderDirective.$inject = [];
	function sliderDirective(){
		return {
			replace: true,
			template: require('text!./slider.html'),
			require: ['form', 'ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls[0];
				var ngModel = ctrls[1];
				var ctrl = scope.ctrl;
				var data = scope.data;

				scope.form = form;

				ctrl.registerModel(ngModel, {
					dflt: undefined
				});

				data.autoSubmit && scope.$on('slider:change', function(){
					scope.$emit('quest:submit:now');
				});
			}

		};
	}

	return sliderDirective;
});