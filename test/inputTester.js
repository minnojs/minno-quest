// stolen from
// https://github.com/angular/angular.js/blob/master/test/ng/directive/inputSpec.js

define(['angular'],function(angular){
	'use strict';

	var formElm, inputElm, scope, $compile, $sniffer, $browser;
	var jqLite = angular.$;

	var tester =  {
		compileQuest: function compileQuest(inputHtml) {
			inputElm = jqLite(inputHtml);
			formElm = jqLite('<form name="form"></form>');
			formElm.append(inputElm);
			$compile(formElm)(scope);
		},

		beforeEach: function(beforeEach, browserTrigger){
			beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
				$sniffer = _$sniffer_;
				$browser = _$browser_;
				$compile = $injector.get('$compile');
				scope = $injector.get('$rootScope');

				tester.changeInputValueTo = function(value) {
					inputElm.val(value);
					browserTrigger(inputElm, $sniffer.hasEvent('input') ? 'input' : 'change');
				};
			}));
		},

		changeInputValueTo: function(){}

	};

	return tester;
});