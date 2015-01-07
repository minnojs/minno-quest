define(function(require){

	require('./canvasModule');
	var canvasConstructor = require('./canvasConstructor');
	var jqLite = require('angular').element;

	describe('canvas', function(){

		describe('constructor', function(){

			it('should throw if not given a map', function(){
				expect(function(){
					canvasConstructor(null, {});
				}).toThrow();
			});

			it('should throw if settings is not set', function(){
				expect(function(){
					canvasConstructor({}, null);
				}).toThrow();
			});

			it('should throw if settings has a non existant key', function(){
				expect(function(){
					canvasConstructor({}, {nonExistant:true});
				}).toThrow();
			});

			it('should set the css according to a rule', function(){
				var $el = jqLite('<div>');
				var rule = {element:$el, property:'color'};
				canvasConstructor({test:rule}, {test:'red'});
				expect($el.css('color')).toBe('red');
			});

			it('should remove the rule when the cb is called', function(){
				var $el = jqLite('<div>').css('color','green');
				var rule = {element:$el, property:'color'};
				var off = canvasConstructor({test:rule}, {test:'red'});
				off.apply();
				expect($el.css('color')).toBe('green');
			});

			it('should remove all rules when cb is called', function(){
				var $el = {css:jasmine.createSpy('css')};
				var map = {
					rule1 : {element: $el},
					rule2 : {element: $el}
				};
				var off = canvasConstructor(map, {rule1:'', rule2:''});

				$el.css.reset();
				off.apply();
				expect($el.css.calls.length).toBe(2);
			});

			it('should not throw if no rules are activated', function(){
				var off = canvasConstructor({},{});
				expect(off).not.toThrow();
			});
		});

		describe('service', function(){
			var $root, $body, canvas;

			beforeEach(module('pi.canvas'));

			beforeEach(inject(function($rootElement, $document, managerCanvas){
				$root = $rootElement;
				$body = jqLite($document[0].body);

				canvas = managerCanvas;
			}));

			it('should apply backgroundColor', function(){
				// just for testing purposes we need this to be rgb
				canvas({backgroundColor:'rgb(255, 0, 0)'});
				expect($body.css('backgroundColor')).toBe('rgb(255, 0, 0)');
			});

			it('should apply canvasColor', function(){
				canvas({canvasColor:'red'});
				expect($root.css('background')).toBe('red');
			});

			it('should apply fontSize', function(){
				canvas({fontSize:'3em'});
				expect($root.css('fontSize')).toBe('3em');
			});

			it('should apply fontColor', function(){
				canvas({fontColor:'red'});
				expect($root.css('color')).toBe('red');
			});
		});

	});

});