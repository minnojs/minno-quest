/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define(function(){

	questController.$inject = ['$scope'];
	function questController($scope){
		this.scope = $scope;
		this.value = function(){
			return {
				response: $scope.response,
				name: $scope.data.name
			};
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