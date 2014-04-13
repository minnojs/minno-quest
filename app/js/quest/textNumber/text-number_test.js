define(['./text-number-module'],function(){

	describe('quest.textNumber',function(){

		var formElm, inputElm, scope, $compile, $document, $sniffer, $browser, changeInputValueTo;
		var jqLite = angular.element;

		var compileInput = function compileInput(html, data){
			formElm = jqLite(html);
			scope.data = data;
			$compile(formElm)(scope);
			scope.$digest();
			inputElm = formElm.find('input');
		};

		beforeEach(module('quest.textNumber'));
		beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
			$sniffer = _$sniffer_;
			$browser = _$browser_;
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');

			changeInputValueTo = function(value) {
				inputElm.val(value);
				inputElm.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
			};
		}));

		it('should bind to a model', function(){
			compileInput('<input quest-text-number quest-data="data" />',{});

			expect(scope.data.response).toBe('');

			changeInputValueTo(234234);
			expect(scope.data.response).toBe(234234);
		});

		it('should be a number', function(){
			compileInput('<input quest-text-number quest-data="data" />',{});

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
			compileInput('<input quest-text-number quest-data="data" />',{dflt:123123});
			expect(inputElm.val()).toBe('123123');
			// even if the default value is 0
			compileInput('<input quest-text-number quest-data="data" />',{dflt:0});
			expect(inputElm.val()).toBe('0');
		});


		it('should support required',function(){
			compileInput('<input quest-text-number quest-data="data" />',{required:true, errorMsg:{required: 'required msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.required"]');
			expect(errorElm.text()).toBe('required msg');

			expect(formElm).toBeInvalid();
			expect(errorElm).toBeShown();

			changeInputValueTo(1234);
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('');
			expect(formElm).toBeInvalid();
		});

		it('should support max',function(){
			compileInput('<input quest-text-number quest-data="data" />',{max:5, errorMsg:{max: 'max msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.max"]');
			expect(errorElm.text()).toBe('max msg');

			changeInputValueTo(3);
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo(7);
			expect(formElm).toBeInvalid();
		});

		it('should support min',function(){
			compileInput('<input quest-text-number quest-data="data" />',{min:5, errorMsg:{min: 'min msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.min"]');
			expect(errorElm.text()).toBe('min msg');

			changeInputValueTo(7);
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo(3);
			expect(formElm).toBeInvalid();
		});
	});
});