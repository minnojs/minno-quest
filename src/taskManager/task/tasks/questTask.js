export default activateQuest;

activateQuest.$inject = ['done', '$element', '$scope', '$compile', 'script','task'];
function activateQuest(done, $canvas, $scope, $compile, script, task){
    var $el;

    // update script name
    task.name && (script.name = task.name);

    $scope.script = script;

    $canvas.append('<div pi-quest></div>');
    $el = $canvas.contents();
    $compile($el)($scope);

    // clean up piQuest
    $el.controller('piQuest').task.promise['finally'](done);

    return function questDestroy(){
        $el.scope().$destroy();
        $el.remove();
    };
}


