define(function (require) {

    var _ = require('underscore');
    var angular = require('angular');
    var dragula = require('dragula');
    var template = require('text!./rank.html');

    directive.$inject = ['$compile'];
    function directive(){
        return {
            replace: true,
            require: ['ngModel'],
            controller: 'questController',
            controllerAs: 'ctrl',
            template: template,
            scope:{
                data: '=questData'
            },
            link: function(scope, element, attr, ctrls) {
                var ngModel = ctrls[0];
                var ctrl = scope.ctrl;
                var data = scope.data;
                var range = _.isArray(data.list) && data.list.length ? _.range(1, data.list.length +1) : [];

                // Setup the model
                // ***************
                ctrl.registerModel(ngModel, {
                    dflt: _.get(data,'randomize', true) ? _.shuffle(range) : range
                });

                ngModel.$isEmpty = function(value){
                    return _.isEqual(value, _.range(1, list.length +1));
                };

                // Expose the list
                // ***************

                // model --> view
                // map the existing response into a full fledged list
                // existign response is either from a previous response or from the default
                var list = scope.list = ctrl.log.response.map(function(value, index){
                    return {order: index, id: value, text: data.list[value-1]};
                });

                // view --> model
                scope.$watchCollection('list', function(){
                    scope.response = _.pluck(list, 'id');
                });

                // We need to update the model for the dropdowns manually
                // this needs to be async in order for the select box to catch up with the model
                scope.setupWatch = function(scope){
                    scope.$watch('$parent.response', function(){
                        scope.$evalAsync('selected = row.order');
                    });
                };

                // Actions
                // *******
                scope.reset = function(){
                    list = scope.list = _.sortBy(list, 'id');
                };

                scope.move = function(fromIndex, toIndex){
                    arraymove(list, fromIndex, toIndex);
                    updateOrder(list);
                };

                /**
                 * Drag and drop
                 **/

                var dragIndex, dropIndex;
                var drake = dragula({
                    // a container needs the dragula-container attr and to be in the current question
                    isContainer: function(el){
                        return el.hasAttribute('dragula-container') && element[0].contains(el);
                    }
                });

                drake.on('drag', function(dragElm, source){
                    dragIndex = domIndexOf(dragElm, source);
                });

                drake.on('drop', function(dropElm, target){
                    dropIndex = domIndexOf(dropElm, target);
                    scope.move(dragIndex, dropIndex);
                    scope.$digest();
                });

                scope.$on('$destroy',drake.destroy);

                function domIndexOf(child, parent) {
                    return Array.prototype.indexOf.call(angular.element(parent).children(), child);
                }

                /**
                 * Required
                 * Since we don't control the ngModel element any more we need to manually create a required validation
                 * we don't implement $observe since in our case required is static
                 */

                if (data.required){
                    ngModel.$formatters.push(requiredValidator);
                    ngModel.$parsers.unshift(requiredValidator);
                    requiredValidator(scope.response); // check validity at the begining - without need for change...
                }

                function updateOrder(list){
                    list.forEach(function(value, index){value.order = index;});
                }

                function arraymove(arr, fromIndex, toIndex) {
                    var element = arr[fromIndex];
                    arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, element);
                }

                function requiredValidator(value){
                    var ctrl = ngModel;
                    if (ctrl.$isEmpty(value)) {
                        ctrl.$setValidity('required', false);
                        return;
                    } else {
                        ctrl.$setValidity('required', true);
                        return value;
                    }
                }
            }
        };
    }

    return directive;
});
