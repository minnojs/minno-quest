define(function(require){
	require('./utilsModule');

	describe('preloader', function(){
		var preloader,spy, $q, $rootScope,def;

		beforeEach(module('pi.utils'));

		beforeEach(inject(function($injector){
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');
			preloader = $injector.get('piPreloader');
			def = $q.defer();
			spy = jasmine.createSpy('registered').andReturn(def.promise);
			preloader.register('test', spy);
		}));

		it('should register a loading function', function(){
			var description = {};
			preloader.load('test',description);
			expect(spy).toHaveBeenCalledWith(description);
		});

		describe(': load', function(){
			it('should load each description only once', function(){
				var description = {};
				preloader.load('test',description);
				preloader.load('test',description);
				expect(spy.call.length).toBe(1);
			});

			it('should return the promise', function(){
				preloader.load('test', 123);
				var promise = preloader.load('test', 123); // just to make sure this is returned correctly even for the second time it is called
				expect(promise).toBe(def.promise);
			});

			it('should throw if the loading function doesn\'t return a promiseLike object', function(){
				expect(function(){
					spy.andReturn({});
					preloader.load('test');
				}).toThrow();
			});

			it('should throw if trying to load an unregisterd type', function(){
				expect(function(){
					preloader.load('untest');
				}).toThrow();
			});
		});

		describe('loadArr', function(){
			it('should load all descriptions in array', function(){
				var i = 0;
				var q = [$q.defer(), $q.defer(), $q.defer()];
				var resolvedSpy = jasmine.createSpy('resolved');

				spy.andCallFake(function(){
					return q[i++].promise;
				});

				// setup
				var promise = preloader.loadArr('test', [1,2,3]);
				promise.then(resolvedSpy);

				// make sure partial resolve does not resolve
				q[0].resolve();
				$rootScope.$digest();
				expect(resolvedSpy).not.toHaveBeenCalled();

				q[1].resolve();
				q[2].resolve();
				$rootScope.$digest();
				expect(resolvedSpy).toHaveBeenCalled();
			});
		});

		describe(': get', function(){
			it('should get resolved values', function(){
				var description = {};
				def.resolve(123);
				preloader.load('test', description);
				$rootScope.$digest();
				expect(preloader.get('test', description)).toBe(123);
			});

			it('should throw when getting unresolved values', function(){
				var description = {};
				preloader.load('test', description);
				expect(function(){
					preloader.get('test', description);
				});
			});
		});
	});
});