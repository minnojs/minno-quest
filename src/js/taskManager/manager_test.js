define(['./managerModule'], function(){
	xdescribe('manager', function(){

		beforeEach(module('taskManager'));

		describe(': directive', function(){

			var q, element, $compile, $rootScope, getScriptSpy, $window;

			function compile(){
				element = $compile('<div pi-task="my/url.js", pi-global="globalObj"></div>')($rootScope);
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
				$window = $injector.get('$window');
				$rootScope = $injector.get('$rootScope').$new();
				compile();
			}));


			// This is temporary!! should be replaced as soon as the task manager is actually up...
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

			it('should create a global object and set it to the scope', inject(function($rootScope){
				expect($rootScope.global).toEqual(jasmine.any(Object));
			}));

			it('should extend the global object with "pi-global"', inject(function($rootScope){
				$window.globalObj = {extendGlobal:true};
				compile();
				expect($rootScope.global.extendGlobal).toBeTruthy();
			}));

		});
	});
});