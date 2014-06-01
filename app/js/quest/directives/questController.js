/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define(function(){

	questController.$inject = ['$scope'];
	function questController($scope){
		this.scope = $scope;
		this.value = function(){
			return $scope.response;
		};
	}

	return questController;
});