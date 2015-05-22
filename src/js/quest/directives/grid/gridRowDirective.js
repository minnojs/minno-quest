define(function (require) {
	function gridRowDirective(){
		return {
			replace: true,
			template: require('text!./gridRow.html'),
			require: ['ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope: {
				row: '=questGridRow',
				data: '=questGridData'
			},
			link: function(scope, element, attr, ctrls) {
				var ngModel = ctrls[0];
				var ctrl = scope.ctrl;

				scope.model = ngModel;

				// keep row updated with response so that we can watch it from the grid directive
				scope.$watch('response', function(newVal){
					scope.row.$response = newVal;
				});

				ctrl.registerModel(ngModel, {
					data: scope.row
				});
			}
		};
	}

	return gridRowDirective;
});