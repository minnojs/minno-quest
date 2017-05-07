define(function (require) {
    var _ = require('underscore');
    function gridRowDirective(){
        return {
            replace: true,
            template: require('text!./gridRow.html'),
            require: ['ngModel'],
            controller: 'questController',
            controllerAs: 'ctrl',
            scope: {
                row: '=questGridRow',
                data: '=questGridData'
            },
            link: function(scope, element, attr, ctrls) {
                var ngModel = ctrls[0];
                var ctrl = scope.ctrl;
                var columns = scope.columns = scope.$parent.columns
                    .map(function(column, index){
                        return _.get(scope, 'row.overwrite[' + index + ']') || column;
                    })
                    .map(function(column){
                        column.hasOwnProperty('type') || (column.type = 'checkbox');

                        if (column.type == 'dropdown'){
                            _.isArray(column.answers) || (column.answers = []);
                            column.answers = column.answers.map(function(row, index){
                                if (!_.isObject(row)) row = {text: row};
                                if (!('value' in row)) row.value = index+1;
                                return row;
                            });
                        }

                        return column;
                    });

                // set values
                columns
                    .filter(function hasValue(column){return column.type != 'text';})
                    .forEach(function setValue(column, index){
                        column.hasOwnProperty('value') || (column.value = index+1);
                    });

                // setReverseValues
                columns
                    .filter(function(column){return !column.noReverse;}) // ignore columns that shouldn't be reveresed
                    .filter(function hasValue(column){return column.type != 'text';})
                    .forEach(function(column, index, columns){
                        column.reverseValue = columns[columns.length - index - 1].value; // set the value from the mirroring column
                    });

                scope.model = ngModel;

                // keep row updated with response so that we can watch it from the grid directive
                scope.$watch('response', function(newVal){
                    scope.row.$response = newVal;
                });

                ctrl.registerModel(ngModel, {
                    data: scope.row
                });
            }
        };
    }

    return gridRowDirective;
});
