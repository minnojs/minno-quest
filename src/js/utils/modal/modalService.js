define(function(require){

    var _ = require('underscore');
    var template = require('text!./modal.html');

    var angular = require('angular');

    modalConstructor.$inject = ['$rootScope', '$rootElement', '$compile', '$q', '$document'];
    function modalConstructor($rootScope, $rootElement, $compile, $q, $document){
        var $element, $scope, deferred;
        var $backDrop = angular.element('<div class="modal-backdrop in"/>');

        this.open = modalOpener;
        this.close = modalCleanup;

        function modalCleanup(){
            if ($element){
                $element.remove();
            }

            if ($scope){
                $scope.$destroy();
            }

            if (deferred){
                deferred.resolve();
            }

            $backDrop.remove();
            $document.off('keydown', modalCleanup);
            $rootElement.removeClass('modal-open');
        }

        function modalOpener(options){
            var context = options.context || {};

			// close any existing modals
            modalCleanup();

			// create deferred
            deferred = $q.defer();

			// create new scope
            $scope = (options.$scope || $rootScope).$new();

			// set up scope methods
            $scope.close = modalCleanup;
            $document.on('keydown', modalCleanup);


			// set scope texts + template
            $scope.header = _.template(options.header)(context);
            $scope.body = _.template(options.body)(context);
            $scope.button = _.template(options.button)(context);

			// create new element
            $element = angular.element(template);
            $rootElement.addClass('modal-open');

			// compile and activate
            $rootElement.prepend($backDrop);
            $rootElement.prepend($element);
            $compile($element.contents())($scope);
            $scope.$digest();

            return deferred.promise;
        }
    }

    return modalConstructor;

});