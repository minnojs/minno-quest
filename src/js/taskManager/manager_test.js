define(['./managerModule'], function(){
	describe('manager', function(){

		beforeEach(module('taskManager'));

		describe('managerProvider', function(){
			var manager, $scope, loadedQ;

			beforeEach(module(function($provide){
				$provide.service('taskLoad', function($q){
					loadedQ = $q.defer();
					return function(){
						return loadedQ.promise;
					};
				});

				$provide.value('managerSequence', function managerSequence(){
					// jshint newcap:false
					if (!(this instanceof managerSequence)){return new managerSequence();}
					this.next = jasmine.createSpy('next');
					this.prev = jasmine.createSpy('prev');
				});
			}));

			beforeEach(inject(function($rootScope, managerProvider){
				$scope = $rootScope.$new();
				manager = managerProvider($scope, {});
			}));

			describe(': constructor', function(){
				it('should return an object (no need for new)', function(){
					expect(manager).toEqual(jasmine.any(Object));
				});

				it('should create a sequence', inject(function(managerSequence){
					expect(manager.sequence).toEqual(jasmine.any(managerSequence));
				}));

				it('should call next on manager:next', function(){
					spyOn(manager, 'next');
					$scope.$emit('manager:next');
					$scope.$digest();
					expect(manager.next).toHaveBeenCalled();
				});

				it('should call prev on manager:prev', function(){
					spyOn(manager, 'prev');
					$scope.$emit('manager:prev');
					$scope.$digest();
					expect(manager.prev).toHaveBeenCalled();
				});
			});

			describe(': prototype', function(){
				it('should proceed and load for next', function(){
					spyOn(manager,'load');
					manager.next();
					expect(manager.sequence.next).toHaveBeenCalled();
					expect(manager.load).toHaveBeenCalled();
				});

				it('should proceed and load for prev', function(){
					spyOn(manager,'load');
					manager.prev();
					expect(manager.sequence.prev).toHaveBeenCalled();
					expect(manager.load).toHaveBeenCalled();
				});

				it('should emit manager:loaded only after loading is done', function(){
					var spy = jasmine.createSpy('loaded');
					$scope.$on('manager:loaded', spy);
					manager.load();

					$scope.$digest();
					expect(spy).not.toHaveBeenCalled();

					loadedQ.resolve();
					$scope.$digest();
					expect(spy).toHaveBeenCalled();
				});
			});
		}); // end managerProvider

	}); // end manager
});