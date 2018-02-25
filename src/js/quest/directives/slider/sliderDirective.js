define(function(require){

	var _ = require('underscore');

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

				ctrl.registerModel(ngModel, { dflt: undefined });

                // setup model => view
                scope.sliderResponse = scope.response;

                // setup view => model
				var deRegister = scope.$on('slider:change', function(e, newValue){
                    scope.$apply(function(){
                        scope.response = newValue;
                        data.autoSubmit && scope.$emit('quest:submit:now');
                    });
				});
                scope.$on('quest:timeout', deRegister);
			}
		};
	}

	return sliderDirective;
});
