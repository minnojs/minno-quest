/*
 * The directive for creating the generic question layout (stub, surrounding etc.).
 */
define(function (require) {

    var PREFIX = 'quest';
    var template = require('text!./wrapper.html');
    var _ = require('underscore');

    function capitaliseFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    directive.$inject = ['$compile', '$injector'];
    function directive($compile, $injector){
        return {
            replace: true,
            template:template,
            priority: 5, // Allows the wrapper to use the same scope as the questions
            scope:{
                data: '=questData',
                current: '=questCurrent'
            },
            link: function(scope,element) {
                var type = scope.data.type || 'text';
                var questElement = element.children().eq(2);
                var attrName = PREFIX + capitaliseFirstLetter(type);

				// Make sure that this directive exists
                if (!$injector.has(attrName + 'Directive')){
                    throw new Error ('Unknown question type: "' + type + '"');
                }

				// snake case the attr name
                attrName = _.kebabCase(attrName);

				// add the appropriate attribute to the directive and compile it
                questElement.attr(attrName,true);
                $compile(questElement)(scope);
            }

        };
    }

    return directive;
});