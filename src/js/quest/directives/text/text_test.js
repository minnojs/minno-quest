define(['underscore','../questDirectivesModule'], function(_){

    _.forEach(['input','textarea'], function(testType){
        var testName = testType == 'input' ? 'questText' : 'questTextarea';
        var directiveName = testType == 'input' ? 'quest-text' : 'quest-textarea';

        describe(testName,function(){
            var formElm, inputElm, scope, $compile, $sniffer, $browser, changeInputValueTo, addSpy = jasmine.createSpy('addQuest');
            var jqLite = angular.element, log;

            var compile = function compileInput(data){
                formElm = jqLite('<div id="input" ' + directiveName +' quest-data="data" ng-model="current.logObj"></div>');

                data.name = 'test';
                scope.data = data;
                $compile(formElm)(scope);
                scope.$digest();
                inputElm = formElm.find('input,textarea');
                log = scope.current.logObj;
            };

            function submitAttempt(){
                scope.$parent.submitAttempt = true;
                scope.$digest();
            }


            beforeEach(module('questDirectives', function($compileProvider, $sceProvider){
                $sceProvider.enabled(false);
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
                    inputElm.trigger('keydown');
                    inputElm.trigger('keyup');
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

            it('should show stem inline if inline=true', function(){
                compile({stem:'Hello', inline:true});
                var label = formElm.children('label');
                expect(label).not.toBeHidden();
                expect(label.text()).toBe('Hello');

                compile({stem:'Hello'});
                label = formElm.children('label');
                expect(label).toBeHidden();
            });

            it('should support dflt',function(){
                compile({dflt:'default value'});
                expect(inputElm.val()).toBe('default value');
                expect(log.response).toBe('default value');
            });

            it('should support dflt even if the default value is 0',function(){
                compile({name:2,dflt:0});
                expect(inputElm.val()).toBe('0');
            });

            it('should support width', function(){
                compile({name:2,width:100});
                expect(inputElm.css('width')).toBe('100px');
            });

            describe('maxlengthLimit', function(){
                it('should limit input length', function(){
                    compile({name:2,maxlengthLimit:true, maxlength:4});
                    changeInputValueTo('aaaaa');
                    expect(inputElm.val()).toBe('aaaa');
                });

                it('should not show a warning message', function(){
                    compile({name:2,maxlengthLimit:true, maxlength:4});
                    changeInputValueTo('aaaaa');
                    expect(formElm).toBeValid();
                });
            });

            describe(': required validation', function(){
                var errorElm;
                beforeEach(function(){
                    compile({required:true, errorMsg:{required: 'required msg'}});
                    errorElm = formElm.find('[pi-quest-validation="form.$error.required"]');
                });

                it('should be valid at the begining', function(){
					// expect(formElm).toBeValid(); // this isn't true because of the way angular works. The input truly isn't valid...
                    expect(errorElm).not.toBeShown();
                });

                it('should invalidate after "submitAttempt"', function(){
                    expect(formElm).toBeInvalid();
                    expect(errorElm).not.toBeShown();

                    submitAttempt();
                    expect(errorElm).toBeShown();
                });

                it('should be valid if there is any input', function(){
                    submitAttempt();
                    changeInputValueTo('hello');
                    expect(formElm).toBeValid();
                    expect(errorElm).toBeHidden();
                });
            });

            it('should support maxlength',function(){
                compile({maxlength:5, errorMsg:{maxlength: 'maxlength msg'}});
                var errorElm = formElm.find('[pi-quest-validation="form.$error.maxlength"]');
                expect(errorElm.text()).toBe('maxlength msg');

                expect(errorElm).toBeHidden();

                changeInputValueTo('aaa');
                expect(formElm).toBeValid();
                expect(errorElm).toBeHidden();

                changeInputValueTo('aaaaaaa');
                expect(formElm).toBeInvalid();
                expect(errorElm).toBeHidden();

                submitAttempt();
                expect(errorElm).not.toBeHidden();
            });

			// @DEPRECATED
            it('should support minlength',function(){
                compile({minlength:5, errorMsg:{minlength: 'minlength msg'}});
                var errorElm = formElm.find('[pi-quest-validation="form.$error.minlength"]');
                expect(errorElm.text()).toBe('minlength msg');

                changeInputValueTo('aaa');
                expect(formElm).toBeInvalid();
                expect(errorElm).toBeHidden();
                submitAttempt();
                expect(errorElm).not.toBeHidden();

                changeInputValueTo('aaaaaaa');
                expect(formElm).toBeValid();
                expect(errorElm).toBeHidden();
            });

            it('should support minLength',function(){
                compile({minlength:5, errorMsg:{minLength: 'minLength msg'}});
                var errorElm = formElm.find('[pi-quest-validation="form.$error.minlength"]');
                expect(errorElm.text()).toBe('minLength msg');

                changeInputValueTo('aaa');
                expect(formElm).toBeInvalid();
                expect(errorElm).toBeHidden();
                submitAttempt();
                expect(errorElm).not.toBeHidden();

                changeInputValueTo('aaaaaaa');
                expect(formElm).toBeValid();
                expect(errorElm).toBeHidden();
            });

			// @TODO: make sure incorrect responses register as invalid by angular
            it('should support correct validation',function(){
                compile({correct:true, correctValue: 123, errorMsg:{correct: 'correct msg'}});
                var errorElm = formElm.find('[pi-quest-validation="model.$error.correct"]');
                expect(errorElm.text()).toBe('correct msg');

                expect(errorElm).toBeHidden();
				// expect(formElm).toBeInvalid();

                changeInputValueTo('aaa');
                expect(errorElm).toBeHidden();
                submitAttempt();
                expect(errorElm).not.toBeHidden();


                changeInputValueTo('123');
				// expect(formElm).toBeValid();
                expect(errorElm).toBeHidden();
            });

            it('should support pattern regex',function(){
                compile({pattern:/^\d\d\d-\d\d-\d\d\d\d$/, errorMsg:{pattern: 'pattern msg'}});
                var errorElm = formElm.find('[pi-quest-validation="form.$error.pattern"]');
                expect(errorElm.text()).toBe('pattern msg');

                changeInputValueTo('x000-00-0000x');
                expect(formElm).toBeInvalid();
                expect(errorElm).toBeHidden();
                submitAttempt();
                expect(errorElm).not.toBeHidden();

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

            it('should support pattern string',function(){
                compile({pattern:'^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$', errorMsg:{pattern: 'pattern msg'}});
                var errorElm = formElm.find('[pi-quest-validation="form.$error.pattern"]');
                expect(errorElm.text()).toBe('pattern msg');

                changeInputValueTo('x000-00-0000x');
                expect(formElm).toBeInvalid();
                expect(errorElm).toBeHidden();
                submitAttempt();
                expect(errorElm).not.toBeHidden();

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
                submitSpy = jasmine.createSpy('quest:submit:now');
                scope.$on('quest:submit:now', submitSpy);
                inputElm.trigger(e);
                expect(submitSpy).not.toHaveBeenCalled();

                compile({autoSubmit:true});
                submitSpy = jasmine.createSpy('quest:submit:now');
                scope.$on('quest:submit:now', submitSpy);
                inputElm.trigger(e);
                expect(submitSpy).toHaveBeenCalled();
            });
        });
    });

    describe('toRegexFilter', function(){
        var toRegex;

        beforeEach(module('questDirectives'));

        beforeEach(inject(function(toRegexFilter){
            toRegex = toRegexFilter;
        }));

        it('should be good for undefined values', function(){
            var re = toRegex();
            expect(_.isRegExp(re)).toBeTruthy();
            expect(re.toString()).toBe('/(?:)/');
        });

        it('should parse a string correctly', function(){
            var re = toRegex('a|b');

            expect(_.isRegExp(re)).toBeTruthy();
            expect(re.toString()).toBe('/a|b/');
        });

        it('should parse a regex correctly', function(){
            var re = toRegex(/a|b/);

            expect(_.isRegExp(re)).toBeTruthy();
            expect(re.toString()).toBe('/a|b/');
        });

        it('should throw for non regex values', function(){
            expect(function(){
                toRegex({});
            }).toThrow();
        });
    });

    describe('dfltUnitsFilter', function(){
        var dfltUnits;

        beforeEach(module('questDirectives'));

        beforeEach(inject(function(dfltUnitsFilter){
            dfltUnits = dfltUnitsFilter;
        }));

        it('should return an empty string for empty values', function(){
            expect(dfltUnits()).toBe('');
            expect(dfltUnits(0)).toBe('0px');
            expect(dfltUnits('0')).toBe('0px');
        });

        it('should append px by default', function(){
            expect(dfltUnits(1)).toBe('1px');
        });

        it('should append "unit" if it is defined', function(){
            expect(dfltUnits(1,'unit')).toBe('1unit');
        });

        it('should always treat units as string', function(){
            expect(dfltUnits(1,2)).toBe('12');
        });

        it('should not append to not numeric stings', function(){
            expect(dfltUnits('1px','unit')).toBe('1px');
        });
    });

});