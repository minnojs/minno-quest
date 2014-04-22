/*
* deep inspiration from route provider
*/
define(function(require){
	//var angular = require('angular');
	require;


	var stateProvider = function stateProvider(){
		var sequence = {};
		sequence;

		this.$get = function($rootScope){
			$rootScope;
		};
		this.$get.$inject = ['$rootScope'];
	};
	stateProvider.$inject = [];

	return stateProvider;

});