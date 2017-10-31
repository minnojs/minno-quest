/*
 * @name: spinner Directive
 */

// get template
import template from './spinner.html';

directive.$inject = [];
function directive(){
    return {
        transclude: true,
        replace: true,
        template:template,
        require: [],
        // controller: '',
        // controllerAs: 'ctrl',
        scope:{
            spinner: '=piSpinner'
        }
    };
}

export default directive;
