define(['./questDirectivesModule'], function(){

	describe('questController', function(){
		var scope, controller, timerStack = [0,0,0,0,0];

		beforeEach(module('questDirectives', function($provide){
			$provide.value('timerNow', function(){
				return timerStack.shift();
			});
		}));
		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			scope.data = {name: 123};
			controller = $controller('questController',{
				$scope: scope
			});
		}));

		it('should expose a value function as well as the scope', function(){
			expect(controller.value).toBeDefined();
			expect(controller.valid).toBeDefined();
			expect(controller.scope).toBe(scope);
			expect(controller.log).toEqual({name:123});
		});

		it('should update log latency each time there is a change in scope.response', function(){
			timerStack = ['lost on first digest', 10, 20];

			scope.$digest();
			scope.response = Math.random();
			scope.$digest();

			expect(controller.log.latency).toBe(10);
			expect(controller.log.pristineLatency).toBe(10);

			scope.response = Math.random();
			scope.$digest();

			expect(controller.log.latency).toBe(20);
			expect(controller.log.pristineLatency).toBe(10);
		});
	});

});