import createLogs from './createLogs';
export default activateQuest;

activateQuest.$inject = ['done', '$element', '$scope', '$compile', 'script','task','logger'];
function activateQuest(done, $canvas, $scope, $compile, script, task, logger){
    var $el;
    var log = createLogs(logger, script, task);

    // update script name
    script.name = task.$name;
    $scope.script = script;

    $canvas.append('<div pi-quest></div>');
    $el = $canvas.contents();
    $compile($el)($scope);

    // clean up piQuest
    $el.controller('piQuest').task.promise['finally'](done);

    var $questLog = $el.controller('piQuest').task.$logs;
    $questLog.map(log);
    $questLog.end.map(log.end);

    return function questDestroy(){
        $el.scope().$destroy();
        $el.remove();
    };
}
