define(['./wrapper-module'],function(){

	describe('quest.wrapper',function(){

		var elm, scope, $compile, $document, $sniffer, $browser;
		var jqLite = angular.element;

		var compile = function compileInput(html, data){
			elm = jqLite(html);
			scope.data = data;
			$compile(elm)(scope);
			scope.$digest();
		};

		beforeEach(module('quest.wrapper'));
		beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
			$sniffer = _$sniffer_;
			$browser = _$browser_;
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');
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