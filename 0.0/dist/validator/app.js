/* jshint esnext:true */
/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

	var angular = require('angular');
	var validate = require('validator');

	var app = angular
		.module('piValidator', [])
		.config(['$sceProvider', function($sceProvider){
	   		$sceProvider.enabled(false);
	   	}])
		.run(['$rootScope', function($rootScope){

			function getParameterByName(name) {
				name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(location.search);
				return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
			}

			var url = $rootScope.url = getParameterByName('url');


			require(['text!' + url], function(script){
				$rootScope.$broadcast('script:load', script, url);
			});
		}])
		.controller('syntax', ['$scope', function($scope){
			var jshint = window.JSHINT;
			$scope.loading = true;
			$scope.$on('script:load', function(e, script){
				$scope.loading = false;
				$scope.valid = jshint(script);
				$scope.errors = [];
				$scope.errorCount = 0;
				$scope.warningCount = 0;

				$scope.valid || jshint.data().errors.forEach(function(err){
					var isError = err.code && (err.code[0] === 'E');

					isError ? $scope.errorCount++ : $scope.warningCount++;

					$scope.errors.push({
						isError: isError,
						line: err.line,
						col: err.character,
						reason: err.reason,
						evidence: err.evidence
					});
				});

				$scope.$digest();
			});
		}])
		.controller('validator',['$scope', function($scope){
			var jshint = window.JSHINT;
			$scope.loading = true;
			$scope.$on('script:load', function(e, textScript, url){
				$scope.syntaxError = !jshint(textScript) && jshint.data().errors.some(function(err){return err.code && err.code[0] === 'E';});
				$scope.validations = [];
				if (!$scope.syntaxError){
					try {
						eval(textScript.replace('define(', 'define("myTask",'));
						require(['myTask'], function(script){

							$scope.validations = validate(script, url);
							$scope.loading = false;
							$scope.$digest();
						});
					} catch(e) {
						$scope.loading = false;
						throw e;
					}
				} else {
					$scope.loading = false;
				}
				$scope.$digest();
			});
		}])
		.filter('stringify', () => stringify);


	function stringify(value, pretty) {
		if (value == null) { // null || undefined
			return '<i class="text-muted">undefined</i>';
		}
		if (value === '') {
			return '<i class="text-muted">an empty string</i>';
		}

		switch (typeof value) {
			case 'string':
				break;
			case 'number':
				value = '' + value;
				break;
			case 'object':
				// display the error message not the full thing...
				if (value instanceof Error){
					value = value.message;
					break;
				}
			/* fall through */
			default:
				// @TODO: implement this: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
				value = '<a href="javascript:void(0)">' + angular.toJson(value, !!pretty) + '</a>';
		}

		return value;
	}

	return app;
});