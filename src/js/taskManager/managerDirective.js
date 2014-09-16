/**
 * Should manage various tasks.
 * For now it should simply load and activate a questionnaire.
 * Eventually it should be able to take a sequence of tasks and run them.
 * @name  managerDirctive
 * @return {directive}
 */
define(function(require){

	var _ = require('underscore');
	directive.$inject = ['$compile','$rootScope','managerGetScript','$parse', '$window'];
	function directive($compile,$rootScope,getScript,$parse, $window){
		return {
			link:  function($scope, $element, attr){
				var piGlobal = $parse(attr.piGlobal)($window);

				// create the global object
				$rootScope.global = {};

				if (piGlobal){
					_.extend($rootScope.global, piGlobal);
				}

				$scope.task = {
					type: 'quest',
					scriptUrl: attr.piManager
				};

				$element.html('<div pi-task="task"></div>');
				$compile($element.contents())($scope);

			}
		};
	}

	return directive;
});