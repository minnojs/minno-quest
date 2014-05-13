define(['./text-module'],function(){

	describe('questText',function(){

		var formElm, inputElm, scope, $compile, $document, $sniffer, $browser, changeInputValueTo;
		var jqLite = angular.element;

		var compileInput = function compileInput(html, data){
			formElm = jqLite(html);
			scope.data = data;
			$compile(formElm)(scope);
			scope.$digest();
			inputElm = formElm.find('input');
		};

		beforeEach(module('questText'));
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
			compileInput('<input quest-text quest-data="data" />',{});

			expect(scope.data.response).toBe('');

			changeInputValueTo('hello');
			expect(scope.data.response).toBe('hello');
		});

		it('should support dflt',function(){
			compileInput('<input quest-text quest-data="data" />',{dflt:"default value"});
			expect(inputElm.val()).toBe('default value');
			// even if the default value is 0
			compileInput('<input quest-text quest-data="data" />',{dflt:0});
			expect(inputElm.val()).toBe('0');
		});


		it('should support required',function(){
			compileInput('<input quest-text quest-data="data" />',{required:true, errorMsg:{required: 'required msg'}});
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
			compileInput('<input quest-text quest-data="data" />',{maxlength:5, errorMsg:{maxlength: 'maxlength msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.maxlength"]');
			expect(errorElm.text()).toBe('maxlength msg');

			changeInputValueTo('aaa');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('aaaaaaa');
			expect(formElm).toBeInvalid();
		});

		it('should support minlength',function(){
			compileInput('<input quest-text quest-data="data" />',{minlength:5, errorMsg:{minlength: 'minlength msg'}});
			var errorElm = formElm.find('[ng-show="form.$error.minlength"]');
			expect(errorElm.text()).toBe('minlength msg');

			changeInputValueTo('aaaaaaa');
			expect(formElm).toBeValid();
			expect(errorElm).toBeHidden();

			changeInputValueTo('aaa');
			expect(formElm).toBeInvalid();
		});

		it('should support pattern',function(){
			compileInput('<input quest-text quest-data="data" />',{pattern:"/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/", errorMsg:{pattern: 'pattern msg'}});
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

	});
});