/**
 * Should manage various tasks.
 * For now it should simply load and activate a questionnaire.
 * Eventually it should be able to take a sequence of tasks and run them.
 * @name  managerDirctive
 * @return {directive}
 */
define(function(){

	directive.$inject = ['$compile','$rootScope','managerGetScript'];
	function directive($compile,$rootScope,getScript){
		return {
			link:  function(scope, $element, attr){
				var q = getScript(attr.piTask);

				// create the global object
				$rootScope.global = {};

				q.then(function(script){
					scope.script = script;
					$element.html('<div pi-quest></div>');
					$compile($element.contents())(scope);
				});
			}
		};
	}

	return directive;
});