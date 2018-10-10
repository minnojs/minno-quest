import _ from 'lodash';
import template from './chooseTemplate.jst';
export default activateChoose;

activateChoose.$inject = ['done', '$element', 'task', '$rootScope','$scope', '$compile', 'piConsole'];
function activateChoose(done, $element, task, $rootScope, $scope, $compile, piConsole){
    var global = $rootScope.global;
    var $el;

    if (!('propertyName' in task)) piConsole({
        type:'warn',
        message: '"properyName" was not set in the choose task',
        context: task
    });

    if (('propertyName' in task) && !_.isUndefined(global[task.propertyName])) piConsole({
        type:'warn',
        message: 'A value was already saved to "global.' + task.propertyName + '". Please make sure that this is intentional.',
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

    return function destroyChoose(){
        $scope.$destroy();
        $el.remove();
    };

    function choose(value){ _.set(global, task.propertyName, value); }
}
