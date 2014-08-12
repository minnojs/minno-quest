define(['../questDirectivesModule'],function(){

	describe('questTextNumber',function(){

		var formElm, inputElm, scope, $compile, $document, $sniffer, changeInputValueTo;
		var jqLite = angular.element, log;

		var compile = function compileInput(data, logObj){
			formElm = jqLite('<input quest-text-number quest-data="data" ng-model="current.logObj"/>');
			logObj && (scope.current.logObj = logObj);
			scope.data = data;
			$compile(formElm)(scope);
			scope.$digest();
			inputElm = formElm.find('input');
			log = formElm.data('$questTextNumberController').log;
		};

		beforeEach(module('questDirectives'));
		beforeEach(inject(function($injector, _$sniffer_) {
			$sniffer = _$sniffer_;
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');
			scope.current = [];
			scope = scope.$new();

			changeInputValueTo = function(value) {
				inputElm.val(value);
				inputElm.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
			};
		}));



		it('should bind to a model', function(){
			compile({});
			expect(log.response).toBe('');

			changeInputValueTo(234234);
			expect(log.response).toBe(234234);
		});

		it('should be a number', function(){
			compile({});

			try {
				// to allow non-number values, we have to change type so that
				// the browser which have number validation will not interfere with
				// this test. IE8 won't allow it hence the catch.
				inputElm[0].setAttribute('type', 'text');
			} catch (e) {}

			changeInputValueTo('words');
			expect(formElm).toBeInvalid();
			expect(scope.response).toBeUndefined();

			changeInputValueTo(234234);
			expect(formElm).toBeValid();
		});

		it('should support dflt',function(){
			compile({name:1, dflt:123123});
			expect(inputElm.val()).toBe('123123');
		});

		it('should support dflt even if the default value is 0',function(){
			compile({name:2,dflt:0});
			expect(inputElm.val()).toBe('0');
		});


		it('should support required',function(){
			compile({required:true, errorMsg:{required: 'required msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.required"]');
			expect(errorElm.text()).toBe('required msg');

			expect(formElm).toBeInvalid();
			expect(errorElm).toBeShown();

			changeInputValueTo(1234);
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('a');
			expect(formElm).toBeInvalid();
		});

		it('should support max',function(){
			compile({max:5, errorMsg:{max: 'max msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.max"]');
			expect(errorElm.text()).toBe('max msg');

			changeInputValueTo(3);
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo(7);
			expect(formElm).toBeInvalid();
		});

		it('should support min',function(){
			compile({min:5, errorMsg:{min: 'min msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.min"]');
			expect(errorElm.text()).toBe('min msg');

			changeInputValueTo(7);
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo(3);
			expect(formElm).toBeInvalid();
		});

		it('should support correct validation',function(){
			compile({correct:true, correctValue: 123, errorMsg:{correct: 'correct msg'}});
			var errorElm = formElm.find('[ng-show="model.$error.correct"]');
			expect(errorElm.text()).toBe('correct msg');

			changeInputValueTo('123');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo(12);
			expect(formElm).toBeInvalid();
		});

		it('should support autoSubmit', function(){
			var e = jqLite.Event('keypress', { which: 13 });
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