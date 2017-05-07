define(['./modalModule'],function(){

    describe('modal', function(){
        var modal, $rootElement, $rootScope;

        beforeEach(module('pi.modal'));
        beforeEach(inject(function($injector){
            modal = $injector.get('piModal');
            $rootElement = $injector.get('$rootElement');
            $rootScope = $injector.get('$rootScope');
        }));

        it('should append a modal element to $rootElement', function(){
            modal.open({});
            expect($rootElement.find('.modal').length).toBe(1);
        });

        it('should append a backdrop to $rootElement', function(){
            modal.open({});
            expect($rootElement.find('.modal-backdrop').length).toBe(1);
            modal.close();
            expect($rootElement.find('.modal-backdrop').length).toBe(0);
        });

        it('should add .modal-open to $rootElement', function(){
            modal.open({});
            expect($rootElement).toHaveClass('modal-open');
            modal.close();
            expect($rootElement).not.toHaveClass('modal-open');
        });

        it('should apply and template the header', function(){
            modal.open({header:'<%= test %> 123', context: {test: 345}});
            $rootScope.$digest();
            expect($rootElement.find('.modal-title').length).toBe(1);
            expect($rootElement.find('.modal-title').text()).toBe('345 123');
        });

        it('should apply and template the body', function(){
            modal.open({body:'<%= test %> 123', context: {test: 345}});
            $rootScope.$digest();
            expect($rootElement.find('.modal-body').text()).toBe('345 123');
        });

        it('should apply and template the button', function(){
            modal.open({button:'<%= test %> 123', context: {test: 345}});
            $rootScope.$digest();
            expect($rootElement.find('.modal-footer button').text()).toBe('345 123');
        });

        it('should remove element when close is called', function(){
            modal.open({});
            var scope = $rootElement.find('.modal').children().scope();
            scope.close();
            expect($rootElement.find('.modal').length).toBe(0);
        });

        it('should resolve promise when close is called', function(){
            var promise = modal.open({});
            var spy = jasmine.createSpy('closed');
            var scope = $rootElement.find('.modal').children().scope();

            promise.then(spy);

            $rootScope.$digest();
            expect(spy).not.toHaveBeenCalled();

            scope.close();
            $rootScope.$digest();
            expect(spy).toHaveBeenCalled();
        });
    });

});