/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define(function (require) {

	var angular = require('angular');
	var API_REGEX = /define/

	var app = angular
		.module('piValidator', [])
		.run(['$rootScope', function($rootScope){
			require(['text!/test/carlee'], function(script){
				$rootScope.$broadcast('script:load', script);
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
			$scope.$on('script:load', function(e, script){
				$scope.syntaxError = !jshint(script);
				// if ($scope.syntaxError) {return true;}


				window.script = script;
				console.log(getTaskType(script))



			});

			function getTaskType(script){
				var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
				var defineArrRegExp = /[^.]\s*define\s*\(\s*\[.*['"](questAPI|pipAPI|managerAPI)['"].*\]/i;

				var match = script
					.replace(commentRegExp, '') // remove comments so that we can do search directly on code
					.match(defineArrRegExp);

				return match && match[1];

			}

		}]);



	return app;
});