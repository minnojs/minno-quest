import _ from 'lodash';
import template from './yesNoTemplate.jst';
export default activateIsTouch;

activateIsTouch.$inject = ['done', '$element', 'task', '$rootScope','$scope', '$compile', 'piConsole'];
function activateIsTouch(done, $element, task, $rootScope, $scope, $compile, piConsole){
    var global = $rootScope.global;
    var $el;

    var propertyName = _.isUndefined(task.propertyName) ? '$isTouch' : task.propertyName;


    if (!_.isUndefined(global[propertyName])) piConsole({
        type:'warn',
        message: 'A value was already saved to "global.' + task.propertyName + '". Please make sure that this is intentional.',
        context: task
    });

    if (!is_touch_device()) {
        choose(false);
        return done();
    }

    _.defaults($scope, task, {
        heading: null,
        text: 'We\'ve detected that you are using a device capable of touch interactions. Would you like to use the touch interface?',
        noText: 'Use keyboard',
        yesText:'Use touch'
    });

    $scope.choose = _.flow(choose, done);

    $element.append(template);
    $el = $element.contents();
    $compile($el)($scope);

    return function destroyChoose(){
        $scope.$destroy();
        $el.remove();
    };

    function choose(value){ _.set(global, propertyName, value); }
}

// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
function is_touch_device() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

    //  eslint-disable-next-line no-undef
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) return true;

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);

    function mq(query) { return window.matchMedia(query).matches; }
}
