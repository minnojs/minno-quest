define(['angular','./messageModule'], function(angular){
    describe('piMessage', function(){
        var jqLite = angular.element;

        beforeEach(module('pi.message'));

        describe('piMessage directive', function(){
            var $scope, $element, $compile;

            function compile(){
                var html = '<div pi-message></div>';
                $element = jqLite(html);
                $compile($element)($scope);
            }

            beforeEach(inject(function($injector){
                $scope = $injector.get('$rootScope').$new();
                $compile = $injector.get('$compile');
                $scope.script = {$template:''};
            }));

            it('should _.template script.$template', inject(function($rootScope){
                $rootScope.current = {content: 123};

                $scope.script = {$template:'test<%= current.content%>'};
                compile();
                expect($element.text()).toBe('test123');
            }));

            it('should catch _.template errors', function(){
                $scope.script = {$template:'test<%= current.content%>'};
                expect(compile).not.toThrow();
            });

            it('should compile script.$template', function(){
                $scope.spy = jasmine.createSpy('onCompile');
                $scope.script.$template = '<div ng-init="spy()"></div>';
                compile();
                expect($scope.spy).toHaveBeenCalled();
            });

            it('should destroy everything when $scope.done', function(){
                var spy = jasmine.createSpy('$destroy');
                compile();
                $scope.newScope.$on('$destroy', spy);
                $scope.done();
                expect(spy).toHaveBeenCalled();
                expect(jqLite.trim($element.html())).not.toBeTruthy();
            });

            describe(': keys', function(){
                var $document;

                beforeEach(inject(function(_$document_){
                    $document = _$document_;
                }));

                function activate(keys, which){
                    $scope.script.keys = keys;
                    compile();
                    spyOn($scope, 'done');
                    var e = jqLite.Event('keydown', {which: which});
                    $document.trigger(e);
                }

                it('should not break if keys is not set', function(){
                    expect(function(){
                        activate(null, 13);
                    }).not.toThrow();
                });

                it('should call done when key is pressed', function(){
                    activate(32,32);
                    expect($scope.done).toHaveBeenCalled();
                });

                it('should take a simple string', function(){
                    activate('a',65);
                    expect($scope.done).toHaveBeenCalled();
                });

                it('should take an array of values', function(){
                    activate(['a',32],32);
                    expect($scope.done).toHaveBeenCalled();
                });

                it('should not trigger for a wrong keys', function(){
                    activate(['a',32],72);
                    expect($scope.done).not.toHaveBeenCalled();
                });

                it('should remove listener when directive is destroyed', function(){
                    activate(32,0);
                    var spy = $scope.done;
                    $scope.$destroy();
                    var e = jqLite.Event('keydown', {which: 32});
                    $document.trigger(e);
                    expect(spy).not.toHaveBeenCalled();
                });

            });

            describe('piMessageDone directive', function(){
                it('should call $scope.done on click', function(){
                    $scope.script.$template = '<div pi-message-done></div>';
                    compile();
                    spyOn($scope,'done');
                    $element.find('[pi-message-done]').trigger('click');
                    expect($scope.done).toHaveBeenCalled();
                });
            });
        });


    });
});