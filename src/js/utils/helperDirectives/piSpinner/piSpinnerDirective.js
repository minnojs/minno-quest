/*
 * @name: spinner Directive
 */
define(function (require) {
	// get template
    var template = require('text!./spinner.html');

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

    return directive;
});