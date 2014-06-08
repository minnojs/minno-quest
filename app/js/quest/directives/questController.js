/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define(function(){

	questController.$inject = ['$scope', 'timerStopper'];
	function questController($scope, Stopper){
		var self = this;

		this.scope = $scope;
		this.stopper = new Stopper();

		this.log = {
			name: $scope.data.name
		};

		// update data object with the response
		$scope.$watch('response',function(newValue, oldValue /*, scope*/){
			var log = self.log;
			var latency = self.stopper.now();

			if (newValue === oldValue){
				return true;
			}

			log.response = newValue;
			log.latency = latency;

			// if this is the first change
			if (!log.pristineLatency){
				log.pristineLatency = latency;
			}
		});



		this.value = function(){
			return self.log;
		};

		this.valid = function(){
			if ($scope.form){
				return !$scope.form.$invalid;
			}
			return true;
		};
	}

	return questController;
});