define(function(require){

    require('./canvasModule');
    var canvasConstructor = require('./canvasConstructor');
    var jqLite = require('angular').element;
    var _ = require('underscore');

    var redArr = ['rgb(255, 0, 0)', 'rgb(255,0,0)', '#ff0000','red']; // different browsers set colors differently, so when testing we need to compare to any of these.

    describe('canvas', function(){

        describe('constructor', function(){

            it('should throw if not given a map', function(){
                expect(function(){
                    canvasConstructor(null, {});
                }).toThrow();
            });

            it('should return noop if settings is undefined', function(){
                expect(canvasConstructor({}, undefined)).toBe(_.noop);
            });

            it('should throw if settings is not a plain object', function(){
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
                expect(redArr).toContain($el.css('color'));
            });

            it('should remove the rule when the cb is called', function(){
                var $el = jqLite('<div>').css('color','red');
                var rule = {element:$el, property:'color'};
                var off = canvasConstructor({test:rule}, {test:'green'});
                off.apply();
                expect(redArr).toContain($el.css('color'));
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

            it('should apply background', function(){
                canvas({background:'red'});
                expect(redArr).toContain($body.css('backgroundColor'));
            });

            it('should apply canvasBackground', function(){
                canvas({canvasBackground:'red'});
                expect(redArr).toContain($root.css('backgroundColor'));
            });

            it('should apply fontSize', function(){
                canvas({fontSize:'48px'});
                expect($root.css('fontSize')).toBe('48px');
            });

            it('should apply fontColor', function(){
                canvas({fontColor:'red'});
                expect(redArr).toContain($root.css('color'));
            });
        });

    });

});