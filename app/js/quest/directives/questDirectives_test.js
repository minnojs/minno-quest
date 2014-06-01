define(['./questDirectivesModule'], function(){

	describe('questController', function(){
		var scope, controller;

		beforeEach(module('questDirectives'));
		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			controller = $controller('questController',{
				$scope: scope
			});
		}));

		it('should expose a value function as well as the scope', function(){
			expect(controller.value).toBeDefined();
			expect(controller.scope).toBe(scope);
		});
	});

});