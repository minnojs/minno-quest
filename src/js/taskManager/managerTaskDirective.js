define(function(require){

	function directive(){
		return {
			priority: 1000,
			template: '<div pi-manager="script"></div>',
			compile: function(){
				return {
					// this need to be pre so that the wrapping directive gets rendered before the template
					pre: function($scope, $element, $attr){

						var source = $attr.piManagerTask;
						var taskSource = $scope.$eval(source);
						var task  = taskSource ? taskSource : {scriptUrl:source};

						$scope.script = {
							sequence: [task]
						};
					}
				};
			}
		};
	}

	return directive;
});