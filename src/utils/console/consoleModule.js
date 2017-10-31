import angular from 'angular';
import consoleProvider from './consoleProvider';
import consolePrototypeProvider from './consolePrototypeProvider';
import consoleDirective from './consoleDirective';

export default module;

var module = angular.module('piConsole',[]);

module.service('piConsole', consoleProvider);
module.service('piConsolePrototype', consolePrototypeProvider);
module.directive('piConsole', consoleDirective);

module.filter('stringify', function(){
    return stringify;
});

function stringify(value, pretty) {
    if (value == null) { // null || undefined
        return '<i class="text-muted">undefined</i>';
    }
    if (value === '') {
        return '<i class="text-muted">an empty string</i>';
    }

    switch (typeof value) {
        case 'string':
            break;
        case 'number':
            value = '' + value;
            break;
        case 'object':
            // display the error message not the full thing...
            if (value instanceof Error){
                value = value.message;
                break;
            }
            /* fall through */
        default:
            // @TODO: implement this: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
            value = '<a href="javascript:void(0)">' + angular.toJson(value, !!pretty) + '</a>';
    }

    return value;
}
