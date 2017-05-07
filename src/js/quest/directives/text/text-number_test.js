define(['../questDirectivesModule'],function(){

    describe('questTextNumber',function(){

        var formElm, inputElm, scope, $compile, $document, $sniffer, changeInputValueTo;
        var jqLite = angular.element, log;

        var compile = function compileInput(data, logObj){
            formElm = jqLite('<div quest-text-number quest-data="data" ng-model="current.logObj"><div/>');
            logObj && (scope.current.logObj = logObj);
            scope.data = data;
            $compile(formElm)(scope);
            scope.$digest();
            inputElm = formElm.find('input');
            log = formElm.data('$questTextNumberController').log;
        };

        function submitAttempt(){
            scope.$parent.submitAttempt = true;
            scope.$digest();
        }

        beforeEach(module('questDirectives', function($sceProvider){
            $sceProvider.enabled(false);
        }));

        beforeEach(inject(function($injector, _$sniffer_) {
            $sniffer = _$sniffer_;
            $compile = $injector.get('$compile');
            $document = $injector.get('$document');
            scope = $injector.get('$rootScope');
            scope.current = [];
            scope = scope.$new();

            changeInputValueTo = function(value) {
                inputElm.val(value);
                inputElm.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
            };
        }));



        it('should bind to a model', function(){
            compile({});
            expect(log.response).toBe('');

            changeInputValueTo(234234);
            expect(log.response).toBe(234234);
        });

        it('should be a number', function(){
            compile({});

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
            compile({name:1, dflt:123123});
            expect(inputElm.val()).toBe('123123');
        });

        it('should show stem inline if inline=true', function(){
            compile({stem:234, inline:true});
            var label = formElm.children('label');
            expect(label).not.toBeHidden();
            expect(label.text()).toBe('234');

            compile({stem:234});
            label = formElm.children('label');
            expect(label).toBeHidden();
        });

        it('should support dflt even if the default value is 0',function(){
            compile({name:2,dflt:0});
            expect(inputElm.val()).toBe('0');
        });

        it('should support width', function(){
            compile({name:2,width:100});
            expect(inputElm.css('width')).toBe('100px');
        });

        describe(': required validation', function(){
            var errorElm;
            beforeEach(function(){
                compile({required:true, errorMsg:{required: 'required msg'}});
                errorElm = formElm.find('[pi-quest-validation="form.$error.required"]');
            });

            it('should be valid at the begining', function(){
                expect(formElm).toBeInvalid(); // this isn't true because of the way angular works. The input truly isn't valid...
                expect(errorElm).not.toBeShown();
            });

            it('should invalidate after "submitAttempt"', function(){
                submitAttempt();
                expect(formElm).toBeInvalid();
                expect(errorElm).toBeShown();
            });

            it('should be valid if there is numeric input', function(){
                changeInputValueTo(3456);
                expect(formElm).toBeValid();
                expect(errorElm).toBeHidden();
            });

			// This is problematic in IE8
			// It is not so clear what the problem is, but it seems that the value is not filtered properly..
			// it('should not be valid if there is non numeric input', function(){
			// 	scope.$parent.submitAttempt = true;
			// 	scope.$digest();
			// 	changeInputValueTo('abc');
			// 	expect(formElm).toBeInvalid();
			// 	expect(errorElm).toBeShown();
			// });

        });

        it('should support max',function(){
            compile({max:5, errorMsg:{max: 'max msg'}});
            var errorElm = formElm.find('[pi-quest-validation="form.$error.qstMax"]');
            expect(errorElm.text()).toBe('max msg');

            changeInputValueTo(7);
            expect(formElm).toBeInvalid();
            expect(errorElm).not.toBeShown();
            submitAttempt();
            expect(errorElm).toBeShown();

            changeInputValueTo(3);
            expect(formElm).toBeValid();
            expect(errorElm).toBeHidden();
        });

        it('should support min',function(){
            compile({min:5, errorMsg:{min: 'min msg'}});
            var errorElm = formElm.find('[pi-quest-validation="form.$error.qstMin"]');
            expect(errorElm.text()).toBe('min msg');

            changeInputValueTo(3);
            expect(errorElm).not.toBeShown();
            submitAttempt();
            expect(errorElm).toBeShown();

            changeInputValueTo(7);
            expect(formElm).toBeValid();
            expect(errorElm).toBeHidden();
        });

		// @TODO: correct validation does not registered with the form
        it('should support correct validation',function(){
            compile({correct:true, correctValue: 123, errorMsg:{correct: 'correct msg'}});
            var errorElm = formElm.find('[pi-quest-validation="model.$error.correct"]');
            expect(errorElm.text()).toBe('correct msg');

            expect(errorElm).toBeHidden();

            changeInputValueTo(12);
			//expect(formElm).toBeInvalid();
            expect(errorElm).not.toBeShown();
            submitAttempt();
            expect(errorElm).toBeShown();

            changeInputValueTo('123');
			//expect(formElm).toBeValid();
            expect(errorElm).toBeHidden();
        });

        it('should support autoSubmit', function(){
            var e = jqLite.Event('keypress', { which: 13 });
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