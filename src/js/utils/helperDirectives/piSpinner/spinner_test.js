define(['angular','./piSpinnerDirective'], function(angular, directive){

    angular.module('piSpinner',[]).directive('piSpinner', directive);

    describe('piSpinner',function(){
        var $el, scope, $compile, jqLite = angular.element;

        beforeEach(module('piSpinner'));

        var compile = function compileInput(value, html){
            $el = jqLite('<div pi-spinner="value">'+html+'</div>');
            scope.value = value;
            $compile($el)(scope);
            scope.$digest();
        };

        beforeEach(inject(function($injector) {
            $compile = $injector.get('$compile');
            scope = $injector.get('$rootScope').$new();
        }));

        it('should display a spinner if value is true', function(){
            var content = 1234;
            compile(true, content);
            expect($el.children().length).toBe(1);
            expect($el.find('img').length).toBe(1);
        });

        it('should display content if value is false', function(){
            var content = '<span>1234</span>';
            compile(false, content);
            expect($el.find('span').html()).toBe('1234');
        });

    });
});