define(['../questDirectivesModule', 'utils/database/randomize/randomizeModuleMock'], function(){

    describe('select', function(){
        var mixerSpy = jasmine.createSpy('mixer').andCallFake(function(a){return a;});
        beforeEach(module('questDirectives', 'randomizeMock', function($sceProvider){
            $sceProvider.enabled(false);
        }));

        describe('Mixer', function(){
            var mixer;
            beforeEach(module(function($provide){
                $provide.value('mixerRecursive', mixerSpy);
            }));
            beforeEach(inject(function(questSelectMixer){
                mixer = questSelectMixer;
                mixerSpy.reset();
            }));

            it('should mix the answers', inject(function(mixerRecursive){
                var answers = [1,2,3,4];
                mixer(answers, {});
                expect(mixerRecursive).toHaveBeenCalledWith(answers);
            }));

            it('should inject default values (default)', function(){
                var result = mixer([1, {text:123}, {value:'custom'}], {});
                expect(result[0].value).toBe(1);
                expect(result[1].value).toBe(123);
                expect(result[2].value).toBe('custom');
            });

            it('should inject default values (numericValues)', function(){
                var result = mixer([0, {text:123}, {value:'custom'}], {numericValues:true});
                expect(result[0].value).toBe(1);
                expect(result[1].value).toBe(2);
                expect(result[2].value).toBe('custom');
            });

            it('should support randomize', function(){
                var result = mixer([1,2,3], {randomize:true});
                expect(result[0].text).toBe(3);
                expect(result[1].text).toBe(2);
                expect(result[2].text).toBe(1);
            });

            it('should support reverse', function(){
                var result = mixer([1,2,3], {reverse:true});
                expect(result[0].text).toBe(3);
                expect(result[1].text).toBe(2);
                expect(result[2].text).toBe(1);
            });

            it('should log the question order', function(){
                var result = mixer([1,2,3], {randomize:true});
                expect(result[0].order).toBe(0);
                expect(result[1].order).toBe(1);
                expect(result[2].order).toBe(2);
            });
        }); // end mixer

        describe('dropdown', function(){
            var log, select, element, scope, jqLite = angular.element, $compile, $timeout;

            function compileInput(data){
                element = jqLite('<div quest-dropdown quest-data="data" ng-model="data.model">');
                scope.data = data;
                $compile(element)(scope);

                scope = element.isolateScope(); // get the isolated scope
                scope.$digest();
                log = element.data('$questDropdownController').log;

                select = element.children().first();
            }

            function submitAttempt(){
                scope.$parent.$parent.submitAttempt = true; // submit
                scope.$digest();
            }

            function choose(val){
                select.val(val);
                select.trigger('change');
                $timeout(function(){});// just so we can call flush without problems (if there are no defered tasks it throws an error.)
                $timeout.flush();
            }

            beforeEach(module(function($provide){
                $provide.value('mixerRecursive', mixerSpy);
            }));

            beforeEach(inject(function($rootScope, _$compile_, _$timeout_){
                scope = $rootScope.$new();
                $compile = _$compile_;
                $timeout = _$timeout_;
            }));

            it('should bind to a model', function(){
                compileInput({
                    answers: [1,2,'a']
                });
                expect(log.response).not.toBeTruthy();

                choose(2);
                expect(log.response).toBe('a');
            });

            it('should mix the answers', function(){
                compileInput({answers: [1,2,3]});
                expect(scope.quest.answers).toBeDefined();
            });

            it('should print the correct number of answers', function(){
                compileInput({answers: [1,2,3]});
                expect(select.children().length).toBe(4);
            });

            it('should support grouping', function(){
                compileInput({answers: [
					{value:1, group:'a'},
					{value:2, group:'a'},
					{value:3, group:'b'},
					{value:4, group:'b'},
					{value:5, group:'b'}
                ]});

                expect(select.children().length).toBe(2+1); // the number of groups + dflt
                expect(select.children().children().length).toBe(5); // the number of answers
            });

            it('should support dflt',function(){
                compileInput({
                    dflt:'default value',
                    answers: [1,2,{value:'default value'}]
                });
                expect(log.response).toBe('default value');
            });

            it('should support autoSubmit', function(){
                var submitSpy;

                compileInput({answers: [1,2,3]});
                submitSpy = jasmine.createSpy('quest:submit:now');
                scope.$on('quest:submit:now', submitSpy);
                choose(1);
                expect(submitSpy).not.toHaveBeenCalled();

                compileInput({answers: [1,2,3], autoSubmit: true});
                submitSpy = jasmine.createSpy('quest:submit:now');
                scope.$on('quest:submit:now', submitSpy);
                choose(1);
                expect(submitSpy).toHaveBeenCalled();
            });

            it('should log before autoSubmit', function () {
                var submitSpy;
                compileInput({answers: [1,2,3], autoSubmit: true});
                submitSpy = jasmine.createSpy('quest:submit:now').andCallFake(function(){
                    expect(log.response).toBe(2);
                });
                scope.$on('quest:submit:now', submitSpy);
                choose(1);
                expect(submitSpy).toHaveBeenCalled();
            });

            it('should support "correct" validation',function(){
                compileInput({answers: [1,2,3], correct:true, correctValue: 1, errorMsg:{correct: 'correct msg'}});
                var errorElm = element.find('[pi-quest-validation="model.$error.correct"]');
                expect(errorElm.text()).toBe('correct msg');

                expect(errorElm).toBeHidden();
                submitAttempt();
                expect(errorElm).not.toBeHidden();

                choose(0);
                expect(element).toBeValid();
                expect(errorElm).toBeHidden();

                choose(2);
                expect(element).toBeInvalid();
            });

            it('should support "required" validation',function(){
                compileInput({answers: [1,2,3], required:true, errorMsg:{required: 'required msg'}});
                var errorElm = element.find('[pi-quest-validation="form.$error.required"]');
                expect(errorElm.text()).toBe('required msg');

                expect(element).toBeInvalid();
                expect(errorElm).toBeHidden();

                submitAttempt();
                expect(errorElm).not.toBeHidden();

                choose(0);
                expect(element).toBeValid();
            });

        });

        describe('SelectOne',function(){
            var element, formElm, scope, $compile, choose, jqLite = angular.element, log;

            var compileInput = function compileInput(data){
                element = jqLite('<div quest-select-one quest-data="data" ng-model="data.model">');
                scope.data = data;
                $compile(element)(scope);

                scope = element.isolateScope(); // get the isolated scope
                scope.$digest();
                log = element.data('$questSelectOneController').log;

                formElm = element.children().first().children().first();
            };

            function submitAttempt(){
                scope.$parent.$parent.submitAttempt = true; // submit
                scope.$digest();
            }


            beforeEach(module('ui.bootstrap.buttons',function($compileProvider, $provide){
                $provide.value('mixerRecursive', mixerSpy);
            }));

            beforeEach(inject(function($injector) {
                $compile = $injector.get('$compile');
                scope = $injector.get('$rootScope').$new();

                choose = function(at){
                    return formElm.children().eq(at).trigger('click');
                };
            }));

            it('should bind to a model', function(){
                compileInput({
                    answers: [1,2]
                });
                expect(log.response).not.toBeTruthy();

                choose(1);
                expect(log.response).toBe(2);
            });

            it('should mix the answers', function(){
                compileInput({answers: [1,2,3]});
                expect(scope.quest.answers).toBeDefined();
            });

            it('should print the correct number of answers', function(){
                compileInput({answers: [1,2,3]});
                expect(formElm.children().length).toBe(3);
            });

            it('should support dflt',function(){
                compileInput({
                    dflt:'default value',
                    answers: [1,2,{value:'default value'}]
                });
                expect(scope.response).toBe('default value');
                expect(log.response).toBe('default value');
                expect(formElm.find('.active').length).toBe(1);
                expect(formElm.children().eq(2)).toHaveClass('active');
            });

            describe(': style', function(){
                it('should support the list version by default', function(){
                    compileInput({answers: [1,2,3]});
                    expect(formElm).toHaveClass('list-group');
                    expect(formElm.children().eq(2)).toHaveClass('list-group-item');
                });

                it('should support the multiButton version', function(){
                    compileInput({answers: [1,2,3], style:'multiButtons'});

                    var copmutedLineHeight = parseInt(formElm.css('fontSize'),10) * 2.8;
                    expect(['2.8', copmutedLineHeight + 'px']).toContain(formElm.css('lineHeight'));
                    expect(formElm).toHaveClass('btn-toolbar');
                    expect(formElm.children().eq(2)).toHaveClass('btn');
                });

                it('should support the horizontal version', function(){
                    compileInput({answers: [1,2,3], style:'horizontal'});
                    expect(formElm).toHaveClass('btn-group');
                    expect(formElm.children().eq(2)).toHaveClass('btn');
                });

                it('should support the horizontal version (legacy)', function(){
                    compileInput({answers: [1,2,3], buttons:true});
                    expect(formElm).toHaveClass('btn-group');
                    expect(formElm.children().eq(2)).toHaveClass('btn');
                });

                it('should set minWidth', function(){
                    compileInput({answers: [1,2,3], minWidth:'10px'});
                    expect(formElm.children().eq(2).css('minWidth')).toBe('10px');
                });
            });

            it('should support autoSubmit', function(){
                var submitSpy;

                compileInput({answers: [1,2,3]});
                submitSpy = jasmine.createSpy('quest:submit:now');
                scope.$on('quest:submit:now', submitSpy);
                choose(1);
                choose(1);
                expect(submitSpy).not.toHaveBeenCalled();

                compileInput({answers: [1,2,3], autoSubmit: true});
                submitSpy = jasmine.createSpy('quest:submit:now');
                scope.$on('quest:submit:now', submitSpy);
                choose(1);
                expect(submitSpy).not.toHaveBeenCalled();
                choose(1);
                expect(submitSpy).toHaveBeenCalled();
            });

            it('should support "correct" validation',function(){
                compileInput({answers: [1,2,3], correct:true, correctValue: 1, errorMsg:{correct: 'correct msg'}});
                var errorElm = element.find('[pi-quest-validation="model.$error.correct"]');
                expect(errorElm.text()).toBe('correct msg');

                expect(errorElm).toBeHidden();

                choose(0);
                expect(element).toBeValid();
                expect(errorElm).toBeHidden();

                choose(2);
                expect(element).toBeInvalid();
            });

            it('should support "required" validation',function(){
                compileInput({answers: [1,2,3], required:true, errorMsg:{required: 'required msg'}});
                var errorElm = element.find('[pi-quest-validation="model.$error.required"]');
                expect(errorElm.text()).toBe('required msg');

                expect(element).toBeInvalid();
                expect(errorElm).toBeHidden();

                submitAttempt();
                expect(errorElm).not.toBeHidden();

                choose(0);
                expect(element).toBeValid();
                expect(errorElm).toBeHidden();
            });
        });


        describe('SelectMulti',function(){
            var element, formElm, scope, $compile, choose, jqLite = angular.element, log;

            var compileInput = function compileInput(data){
                element = jqLite('<div piq-page-inject quest-select-multi quest-data="data" ng-model="data.model">');
                scope.data = data;
                $compile(element)(scope);
                scope = element.isolateScope(); // get the isolated scope
                scope.$digest();
                log = element.controller('questSelectMulti').log;
                formElm = element.children().first();
            };

            function submitAttempt(){
                scope.$parent.$parent.submitAttempt = true; // submit
                scope.$digest();
            }

            beforeEach(module('ui.bootstrap.buttons',function($compileProvider, $provide){
                $provide.value('mixerRecursive', mixerSpy);
            }));

            beforeEach(inject(function($injector) {
                $compile = $injector.get('$compile');
                scope = $injector.get('$rootScope').$new();

                choose = function(at){
                    return formElm.children().eq(at).trigger('click');
                };
            }));

            it('should bind to a model', function(){
                compileInput({
                    answers: [0,1,2,3,4]
                });
                expect(log.response).toEqual([]);

                choose(1);
                expect(log.response).toEqual([1]);
                choose(3);
                expect(log.response).toEqual([1,3]);
                choose(1);
                expect(log.response).toEqual([3]);
                choose(3);
                expect(log.response).toEqual([]);
            });

            it('should support multiple answers', function(){
                compileInput({
                    answers: [1,2,3,4,5]
                });
                expect(log.response.length).toBe(0);
                choose(1);
                choose(2);
                expect(log.response.length).toBe(2);
            });

            it('should mix the answers', function(){
                compileInput({answers: [1,2,3]});
                expect(scope.quest.answers).toBeDefined();
            });

            it('should display the correct number of answers', function(){
                compileInput({answers: [1,2,3]});
                expect(formElm.children().length).toBe(3);
            });

            describe(': style', function(){
                it('should support the list version by default', function(){
                    compileInput({answers: [1,2,3]});
                    expect(formElm).toHaveClass('list-group');
                    expect(formElm.children().eq(2)).toHaveClass('list-group-item');
                });

                it('should support the multiButton version', function(){
                    compileInput({answers: [1,2,3], style:'multiButtons'});

                    var copmutedLineHeight = parseInt(formElm.css('fontSize'),10) * 2.8;
                    expect(['2.8', copmutedLineHeight + 'px']).toContain(formElm.css('lineHeight'));
                    expect(formElm).toHaveClass('btn-toolbar');
                    expect(formElm.children().eq(2)).toHaveClass('btn');
                });

                it('should support the horizontal version', function(){
                    compileInput({answers: [1,2,3], style:'horizontal'});
                    expect(formElm).toHaveClass('btn-group');
                    expect(formElm.children().eq(2)).toHaveClass('btn');
                });

                it('should support the horizontal version (legacy)', function(){
                    compileInput({answers: [1,2,3], buttons:true});
                    expect(formElm).toHaveClass('btn-group');
                    expect(formElm.children().eq(2)).toHaveClass('btn');
                });

                it('should set minWidth', function(){
                    compileInput({answers: [1,2,3], minWidth:'10px'});
                    expect(formElm.children().eq(2).css('minWidth')).toBe('10px');
                });
            });

            it('should support "correct" validation',function(){
                compileInput({answers: [1,2,3], correct:true, correctValue: [1,2], errorMsg:{correct: 'correct msg'}});
                var errorElm = element.find('[pi-quest-validation="model.$error.correct"]');
                expect(errorElm.text()).toBe('correct msg');

                expect(errorElm).toBeHidden();

                choose(0);
                expect(element).toBeInvalid();
                expect(errorElm).toBeHidden();

                submitAttempt();
                expect(errorElm).not.toBeHidden();

                choose(1);
                expect(element).toBeValid();
                expect(errorElm).toBeHidden();

                choose(2);
                expect(element).toBeInvalid();
            });

            it('should support "required" validation',function(){
                compileInput({answers: [1,2,3], required:true, errorMsg:{required: 'required msg'}});
                var errorElm = element.find('[pi-quest-validation="model.$error.required"]');
                expect(errorElm.text()).toBe('required msg');

                expect(element).toBeInvalid();
                expect(errorElm).toBeHidden();

                submitAttempt();
                expect(errorElm).not.toBeHidden();

                choose(0);
                expect(element).toBeValid();
                expect(errorElm).toBeHidden();
            });


            it('should support dflt',function(){
                compileInput({
                    dflt:[1,2],
                    answers: [0,1,2,3]
                });

                expect(log.response).toEqual([1,2]);
                expect(formElm.find('.active').length).toBe(2);
                expect(formElm.children().eq(1)).toHaveClass('active');
                expect(formElm.children().eq(2)).toHaveClass('active');
            });
        });

    });
});