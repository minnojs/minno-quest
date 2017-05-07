/*
 * @name: messageDone Directive
 */
define(function () {

    directive.$inject = [];
    function directive(){
        return {
            link: function($scope, $element){
                $element.on('click', function(){
                    $scope.done();
                });
            }
        };
    }

    return directive;
});