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

		beforeEach(module('questDirectives', function($sceProvider){
			$sceProvider.enabled(false);
		}));
		beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
			$sniffer = _$sniffer_;
			$browser = _$browser_;
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');
			scope.current = {questions:{}};
			scope = scope.$new();
		}));

		it('should render stem', function(){
			compile('<span quest-wrapper quest-data="data"></span>',{stem:'Hello'});
			expect(elm.find('label').text()).toBe('Hello');
		});

		it('should render help', function(){
			compile('<span quest-wrapper quest-data="data"></span>',{help:true, helpText:'Hello'});
			expect(elm.find('p.help-block').text()).toBe('Hello');
			compile('<span quest-wrapper quest-data="data"></span>',{help:false, helpText:'Hello'});
			expect(elm.find('p.help-block').length).toBe(0);
		});

		it('should transclude',function(){
			compile('<span quest-wrapper quest-data="data"><b>Bold</b></span>',{});
			expect(elm.find('b').length);
		});
	});
});