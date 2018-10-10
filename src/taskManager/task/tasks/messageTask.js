export default activateMessage;

activateMessage.$inject = ['done', '$element', 'task', '$scope','$compile'];
function activateMessage(done, $element, task, $scope, $compile){
    var $el;

    $scope.script = task;

    $element.append('<div pi-message></div>');
    $el = $element.contents();
    $compile($el)($scope);

    // clean up
    $scope.$on('message:done', function(){
        done();
    });

    return function destroyMessage(){
        $scope.$destroy();
        $el.remove();
    };
}
