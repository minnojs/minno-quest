/*
 * @name: piMessage Directive
 */
define(function () {

	directive.$inject = ['$compile', '$rootScope'];
	function directive($compile, $rootScope){
		return {
			link: function($scope, $element) {
				var script = $scope.script;
				var newScope = $scope.newScope = $scope.$new();

				$scope.global = $rootScope.global;
				$scope.current = $rootScope.current;
				$scope.done = done;

				$element.html(script.$template);
				$compile($element.contents())(newScope);

				function done(){
					newScope.$destroy();
					$element.empty();
					$scope.$emit('message:done');
				}
			}
		};
	}

	return directive;
});