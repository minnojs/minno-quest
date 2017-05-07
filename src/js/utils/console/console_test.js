define(['underscore', './consoleModule'],function(_){

    describe('piConsole', function(){
        beforeEach(module('piConsole'));

        describe(': prototype', function(){
            var $log, $rootScope, $console, logFunctions = ['log', 'debug', 'info', 'warn', 'error'];

            beforeEach(inject(function($injector){
                $log = $injector.get('$log');
                $rootScope = $injector.get('$rootScope');
                $console = $injector.get('piConsolePrototype');
            }));

            it('should have all five levels of loggers', function(){
                _.each(logFunctions, function(logType){
                    expect($console[logType]).toEqual(jasmine.any(Function));
                });
            });

            describe(': shouldLog', function(){
                it('should not log by default', function(){
                    expect($console.shouldLog('none')).not.toBeTruthy();
                });

                it('should always log if !!force', function(){
                    $console.force = true;
                    expect($console.shouldLog('none')).toBeTruthy();
                });

                it('should respect level', function(){
                    $console.settings.tags = 'all';

                    $console.settings.level = 'info';
                    expect($console.shouldLog('error')).toBeTruthy();
                    expect($console.shouldLog('warn')).toBeTruthy();
                    expect($console.shouldLog('info')).toBeTruthy();
                    expect($console.shouldLog('log')).not.toBeTruthy();
                    expect($console.shouldLog('debug')).not.toBeTruthy();
                });

                it('should respect settings.tags (String)', function(){
                    $console.settings.tags = 'question';

                    $console.tags = ['not question'];
                    expect($console.shouldLog('error')).not.toBeTruthy();

                    $console.tags = ['question'];
                    expect($console.shouldLog('error')).toBeTruthy();
                });

                it('should respect settings.tags (Array)', function(){
                    $console.settings.tags = ['question','manager'];

                    $console.tags = ['not question'];
                    expect($console.shouldLog('error')).not.toBeTruthy();

                    $console.tags = ['question'];
                    expect($console.shouldLog('error')).toBeTruthy();
                });


                it('should respect tags', function(){
                    $console.settings.tags = ['bling','rocket'];

                    $console.tags = ['bling'];
                    expect($console.shouldLog('error')).toBeTruthy();

                    $console.tags = ['chiwawa'];
                    expect($console.shouldLog('error')).not.toBeTruthy();
                });


                it('should respect tags == "all"', function(){
                    $console.settings.tags = 'all';
                    expect($console.shouldLog('error')).toBeTruthy();
                });

                it('should treat tags as "all" by default', function(){
                    expect($console.shouldLog('error')).toBeTruthy();
                });

            });

			// we assume all loggers are the same so we test only plain log (can always test them all with a loop...)
            describe(': loggers', function(){

                beforeEach(function(){
                    $console.shouldLog = jasmine.createSpy('log').andReturn(true); // just automatically log everything...
                });

                it('should $log all arguments', function(){
                    var args = [1,2,3,4,5,6,7];
                    $console.log.apply($console,args);
                    expect($log.log.logs[0]).toEqual(args);
                });

                it('should not log if !shouldLog', function(){
                    $console.shouldLog.andReturn(false); // deactivate shouldlog
                    $console.log('test');
                    $log.assertEmpty();
                });

                it('should broadcast log information', function(){
                    $console.tags = ['tag1', 'tag2'];
                    var spy = jasmine.createSpy('log');

                    $rootScope.$on('console:log', spy);
                    $console.log('args1','args2');

                    $rootScope.$digest();

                    expect(spy.mostRecentCall.args[1]).toEqual(jasmine.any(Object));
                    expect(spy.mostRecentCall.args[1].type).toEqual('log');
                    expect(spy.mostRecentCall.args[1].tags).toEqual(['tag1','tag2']);
                    expect(spy.mostRecentCall.args[1].args).toEqual(['args1','args2']);

                });

                it('should not broadcast if !!hideConsole', function(){
                    $console.settings.hideConsole = true;
                    var spy = jasmine.createSpy('log');

                    $rootScope.$on('console:log', spy);
                    $console.log(true);
                    $rootScope.$digest();

                    expect(spy).not.toHaveBeenCalled();
                });
            });
        });

        describe('constructor', function(){
            var piConsole, prototype;
            beforeEach(module(function($provide){
                $provide.value('piConsolePrototype', prototype = {});
            }));

            beforeEach(inject(function($injector){
                piConsole = $injector.get('piConsole');
            }));

            it('should prototypicaly inherit piConsolePrototype', function(){
                prototype.test = {};
                var obj = piConsole(1,2);
                expect(obj.test).toBe(prototype.test);
                expect(obj.hasOwnProperty('test')).not.toBeTruthy();
            });

            it('should set tags into itself (and make sure it is an array)', function(){
                var obj;

                obj = piConsole(1);
                expect(obj.tags).toEqual([1]);

                obj = piConsole([1,2]);
                expect(obj.tags).toEqual([1,2]);
            });

            it('should set force into itself', function(){
                var obj;

                obj = piConsole(1);
                expect(obj.force).toBe(false);

                obj = piConsole(1,1);
                expect(obj.force).toBe(true);
            });

            it('should set "settings" correctly', function(){
                var settings = {};
                piConsole.setSettings(settings);
                expect(piConsole(1).settings).toBe(settings);
                expect(piConsole(1).hasOwnProperty('settings')).not.toBeTruthy();
            });
        });
    });
});