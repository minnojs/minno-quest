import _ from 'lodash';
import template from './yesNoTemplate.jst';
export default activateYesNo;

activateYesNo.$inject = ['done', '$element', 'task', '$rootScope','$scope', '$compile', 'piConsole'];
function activateYesNo(done, $element, task, $rootScope, $scope, $compile, piConsole){
    var global = $rootScope.global;
    var $el;

    if (!('path' in task)) piConsole({
        type:'warn',
        message: '"path" was not set in the yesNo task',
        context: task
    });

    if (('path' in task) && !_.isUndefined(global[task.path])) piConsole({
        type:'warn',
        message: 'A value was already saved to "global.' + task.path + '". Please make sure that this is intentional.',
        context: task
    });

    _.defaults($scope, task, {
        heading: null,
        text: 'Please choose one of the following',
        noText: 'No',
        yesText:'Yes'
    });

    $scope.choose = _.flow(choose, done);

    $element.append(template);
    $el = $element.contents();
    $compile($el)($scope);

    return function destroyYesNo(){
        $scope.$destroy();
        $el.remove();
    };

    function choose(value){ _.set(global, task.path, value); }
}
