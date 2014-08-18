define(function(require){
	var _ = require('underscore');


	harvestProvider.$inject = ['$rootScope'];
	function harvestProvider($rootScope){

		/**
		 * Gathers the questions needed to emit and emits them
		 * @param  {$scope} $scope [The scope to emit the log pub]
		 * @param  {*}             [any parameters to be published]
		 */
		function harvest($scope){
			var questions = $rootScope.current.questions;

			var logs = _($scope.page.questions)
				// get current question logs
				.map(function(page){return questions[page.name];})
				// filter all logged questions
				.filter(function(quest){return !quest.$logged;})
				.value();

			// log everything
			var args = _.rest(arguments);
			args.unshift('quest:log',logs);
			$scope.$emit.apply($scope, args);

			// mark stuff as logged
			_.each(logs, function(quest){
				quest.$logged = true;
			});
		}

		return harvest;
	}

	return harvestProvider;

});