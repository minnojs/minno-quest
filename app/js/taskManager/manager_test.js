define(['require','./manager-module'], function(require){
	describe('manager', function(){

		beforeEach(module('taskManager'));

		describe(': directive', function(){

			var q, element, $compile, $rootScope, getScriptSpy;

			function compile(){
				element = $compile('<div pi-task="my/url.js"></div>')($rootScope);
			}

			beforeEach(module(function($provide){
				getScriptSpy = jasmine.createSpy('getScript');
				$provide.service('managerGetScript', function($q){
					return getScriptSpy.andCallFake(function(){
						q = $q.defer();
						return q.promise;
					});
				});
			}));

			beforeEach(inject(function($injector){
				$compile = $injector.get('$compile');
				$rootScope = $injector.get('$rootScope').$new();
				compile();
			}));

			it('should create a quest element', function(){
				q.resolve({});
				$rootScope.$apply();
				expect(element.find('[pi-quest]').length).toBe(1);
			});

			it('should have the script set in the scope', function(){
				q.resolve(123);
				$rootScope.$apply();
				expect(element.scope().script).toBe(123);
			});

			it('should create the directive only after the script is loaded', function(){
				expect(element.find('[pi-quest]').length).toBe(0);
				expect(element.scope().script).not.toBeDefined();
				q.resolve(123);
				$rootScope.$apply();
				expect(element.find('[pi-quest]').length).toBe(1);
				expect(element.scope().script).toBe(123);
			});

			it('should get its url from the attribute', function(){
				expect(getScriptSpy).toHaveBeenCalledWith('my/url.js');
			});
		});

		describe('getScript', function(){
			var base_url = require.toUrl('.');
			var q;

			beforeEach(inject(function(managerGetScript){
				q = managerGetScript(base_url + '/test/script1.js');
			}));

			it('should return a $q', function(){
				expect(q.then).toBeDefined();
				expect(q['catch']).toBeDefined();
				expect(q['finally']).toBeDefined();
			});


			// couldn't manage to test this...
			//it('should resolve when a file was found');
			//it('should reject when a file was not found');
			//it('should return the file contents that we requested', function(){	});

			it('should support base_url', function(){
				// not just yet it isn't needed...
			});
		});
	});
});