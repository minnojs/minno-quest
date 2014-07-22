define(['../questDirectivesModule'], function(){

	describe('questText',function(){
		var formElm, inputElm, scope, $compile, $sniffer, $browser, changeInputValueTo, addSpy = jasmine.createSpy('addQuest');
		var jqLite = angular.element, log;

		var compile = function compileInput(data){
			formElm = jqLite('<input quest-text quest-data="data" ng-model="current.logObj" />');

			scope.data = data;
			$compile(formElm)(scope);
			scope.$digest();
			inputElm = formElm.find('input');
			log = formElm.data('$questTextController').log;
		};

		beforeEach(module('questDirectives', function($compileProvider){
			//this is a hack to get the piq-page controller registered by the directive
			$compileProvider.directive('piqPageInject', function(){
				return {
					priority: -100,
					link: function(scope,element){
						element.data('$piqPageController', {
							addQuest : addSpy
						});
					}
				};
			});
		}));

		beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
			$sniffer = _$sniffer_;
			$browser = _$browser_;
			$compile = $injector.get('$compile');
			scope = $injector.get('$rootScope');
			scope.current = {};
			scope = scope.$new();

			changeInputValueTo = function(value) {
				inputElm.val(value);
				inputElm.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
			};
		}));

		it('should bind to a model', function(){
			compile({});
			expect(log.response).toBe('');

			changeInputValueTo('hello');
			expect(log.response).toBe('hello');

			changeInputValueTo('band');
			expect(log.response).toBe('band');
		});

		it('should support dflt',function(){
			compile({dflt:"default value"});
			expect(inputElm.val()).toBe('default value');
			expect(log.response).toBe('default value');
			// even if the default value is 0
			compile({dflt:0});
			expect(inputElm.val()).toBe('0');
		});


		it('should support required',function(){
			compile({required:true, errorMsg:{required: 'required msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.required"]');
			expect(errorElm.text()).toBe('required msg');

			expect(formElm).toBeInvalid();
			expect(errorElm).toBeShown();


			changeInputValueTo('hello');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('');
			expect(formElm).toBeInvalid();
		});

		it('should support maxlength',function(){
			compile({maxlength:5, errorMsg:{maxlength: 'maxlength msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.maxlength"]');
			expect(errorElm.text()).toBe('maxlength msg');

			changeInputValueTo('aaa');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('aaaaaaa');
			expect(formElm).toBeInvalid();
		});

		it('should support minlength',function(){
			compile({minlength:5, errorMsg:{minlength: 'minlength msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.minlength"]');
			expect(errorElm.text()).toBe('minlength msg');

			changeInputValueTo('aaaaaaa');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('aaa');
			expect(formElm).toBeInvalid();
		});

		it('should support correct validation',function(){
			compile({correct:true, correctValue: 123, errorMsg:{correct: 'correct msg'}});
			var errorElm = formElm.find('[ng-show="model.$error.correct"]');
			expect(errorElm.text()).toBe('correct msg');

			changeInputValueTo('123');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('aaa');
			expect(formElm).toBeInvalid();
		});

		it('should support pattern',function(){
			compile({pattern:"/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/", errorMsg:{pattern: 'pattern msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.pattern"]');
			expect(errorElm.text()).toBe('pattern msg');

			changeInputValueTo('x000-00-0000x');
			expect(formElm).toBeInvalid();

			changeInputValueTo('000-00-0000');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('000-00-0000x');
			expect(formElm).toBeInvalid();

			changeInputValueTo('123-45-6789');
			expect(formElm).toBeValid();

			changeInputValueTo('x');
			expect(formElm).toBeInvalid();
		});

		it('should support autoSubmit', function(){
			var e = jqLite.Event('keypress', { keyCode: 13, which: 13 });
			var submitSpy;

			compile({});
			submitSpy = jasmine.createSpy('quest:submit');
			scope.$on('quest:submit', submitSpy);
			inputElm.trigger(e);
			expect(submitSpy).not.toHaveBeenCalled();

			compile({autoSubmit:true});
			submitSpy = jasmine.createSpy('quest:submit');
			scope.$on('quest:submit', submitSpy);
			inputElm.trigger(e);
			expect(submitSpy).toHaveBeenCalled();
		});
	});
});