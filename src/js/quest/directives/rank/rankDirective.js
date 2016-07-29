define(function (require) {

    var _ = require('underscore');
	var angular = require('angular');
	var template = require('text!./rank.html');

	directive.$inject = ['$compile'];
	function directive($compile){
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
                var list = (data.list || []).map(function(value, index){
                    typeof value === 'object' || (value = {text:value});
                    value.value || (value.value = index + 1);
                    value.id = index + 1;
                    return value;
                });

                if (!data.noRandomize) { list = _.shuffle(list); }
                updateOrder(list);

                // Setup the model
                // ***************
				ctrl.registerModel(ngModel, {
					dflt: _.pluck(list, 'id')
				});

                ngModel.$isEmpty = function(value){
                    return _.isEqual(value, _.range(1, list.length +1));
                }

                // Expose the list
                // ***************
                scope.list = list;
                scope.$watchCollection('list', function(newValue, oldValue){
                    scope.response = _.pluck(list, 'value');
                });

                scope.setupWatch = function(scope){
                    scope.$watch('$parent.response', function(){
                        // this needs to be async in order for the select box to catch up with the model
                        scope.$evalAsync('selected = row.order');
                    });
                }

                // Actions
                // *******
                scope.reset = function(){
                    list = scope.list = _.sortBy(list, 'id');
                }

                scope.move = function(fromIndex, toIndex, s){
                    arraymove(list, fromIndex, toIndex);
                    updateOrder(list);
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
