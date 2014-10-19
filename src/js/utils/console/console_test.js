define(['underscore', './consoleModule'],function(_){

	describe('piConsole', function(){
		var $log, piConsole, settings, logFunctions = ['log', 'info', 'warn', 'error', 'debug'];

		beforeEach(module('piConsole'));
		beforeEach(inject(function($injector){
			$log = $injector.get('$log');
			piConsole = $injector.get('piConsole');
			settings = $injector.get('piConsoleSettings');
		}));

		it('should return an inactive logging object by default', function(){
			expect(piConsole().active).not.toBeTruthy();
		});

		it('should return an active logging object for settings.tags===true', function(){
			settings.tags = true;
			expect(piConsole().active).toBeTruthy();
		});

		it('should return an active logging object for settings.tags==="all"', function(){
			settings.tags = "all";
			expect(piConsole().active).toBeTruthy();
		});

		it('should return an active logging object for settings.tags has localTags', function(){
			settings.tags = ["test"];
			expect(piConsole(["test"]).active).toBeTruthy();
			expect(piConsole(["rock"]).active).not.toBeTruthy();
		});

		describe(': logging', function(){
			it('should not log when not active', function(){
				var cons = piConsole();
				_.each(logFunctions, function(logType){
					cons[logType]("test");
				});
				$log.assertEmpty();
			});

			it('should $log all arguments', function(){
				settings.tags = true;
				var args = [1,2,3,4,5,6,7];
				var cons = piConsole();
				_.each(logFunctions, function(logType){
					cons[logType].apply(null, args);
					expect($log[logType].logs[0]).toEqual(args);
				});
			});
		});

		describe(': $emitting', function(){
			it('should no emit when not active', inject(function($rootScope){
				var cons = piConsole();
				var spy = jasmine.createSpy('log');
				$rootScope.$on('console:log', spy);

				_.each(logFunctions, function(logType){
					cons[logType](logType);
					$rootScope.$digest();
				});

				expect(spy).not.toHaveBeenCalled();
			}));

			it('should emit "console:log" with [args] when active', inject(function($rootScope){
				settings.tags = true;
				var cons = piConsole();
				var spy = jasmine.createSpy('log');
				$rootScope.$on('console:log', spy);

				_.each(logFunctions, function(logType){
					cons[logType](logType);
					$rootScope.$digest();
					expect(spy.mostRecentCall.args[1]).toEqual([logType]);
				});
			}));

			it('should emit "console:log" with tags when active', inject(function($rootScope){
				settings.tags = true;
				var cons = piConsole(["test","barn"]);
				var spy = jasmine.createSpy('log');
				$rootScope.$on('console:log', spy);

				_.each(logFunctions, function(logType){
					cons[logType](logType);
					$rootScope.$digest();
					expect(spy.mostRecentCall.args[2]).toEqual(["test","barn"]);
				});
			}));
		});
	});
});