define(['../questDirectivesModule'], function(){

	describe('questWrapper',function(){

		var elm, scope, $compile, $document, $sniffer, $browser;
		var jqLite = angular.element;

		var compile = function compileInput(html, data){
			elm = jqLite(html);
			scope.data = data;
			$compile(elm)(scope);
			scope.$digest();
		};

		beforeEach(module('questDirectives'));
		beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
			$sniffer = _$sniffer_;
			$browser = _$browser_;
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');
			scope.current = {questions:{}};
			scope = scope.$new();
		}));

		it('should bind to a model', function(){
			compile('<span quest-wrapper quest-data="data"></span>',{stem:'Hello'});
			expect(elm.find('label').text()).toBe('Hello');
		});

		it('should transclude',function(){
			compile('<span quest-wrapper quest-data="data"><b>Bold</b></span>',{});
			expect(elm.find('b').length);
		});
	});
});