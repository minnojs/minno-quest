define(['angular','./messageModule'], function(angular){
	describe('piMessage', function(){
		var jqLite = angular.element;

		beforeEach(module('pi.message'));

		describe('piMessage directive', function(){
			var $scope, $element, $compile;

			function compile(){
				var html = '<div pi-message></div>';
				$element = jqLite(html);
				$compile($element)($scope);
			}

			beforeEach(inject(function($injector){
				$scope = $injector.get('$rootScope').$new();
				$compile = $injector.get('$compile');
				$scope.script = {$template:''};
			}));

			it('should compile script.$template', function(){
				$scope.spy = jasmine.createSpy('onCompile');
				$scope.script.$template = '<div ng-init="spy()"></div>';
				compile();
				expect($scope.spy).toHaveBeenCalled();
			});

			it('should destroy everything when $scope.done', function(){
				var spy = jasmine.createSpy('$destroy');
				compile();
				$scope.newScope.$on('$destroy', spy);
				$scope.done();
				expect(spy).toHaveBeenCalled();
				expect(jqLite.trim($element.html())).not.toBeTruthy();
			});

			describe('piMessageDone directive', function(){
				it('should call $scope.done on click', function(){
					$scope.script.$template = '<div pi-message-done></div>';
					compile();
					spyOn($scope,'done');
					$element.find('[pi-message-done]').trigger('click');
					expect($scope.done).toHaveBeenCalled();
				});
			});
		});


	});
});