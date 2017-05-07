define(function (require) {

    var _ = require('underscore');

    function gridRowDirective(){
        return {
            replace: true,
            template: require('text!./multiGridRow.html'),
            require: ['ngModel'],
            controller: 'questController',
            controllerAs: 'ctrl',
            scope: {
                row: '=questMultiGridRow',
                data: '=questMultiGridData'
            },
            link: function(scope, element, attr, ctrls) {
                var ngModel = ctrls[0];
                var ctrl = scope.ctrl;

                scope.model = ngModel;
                scope.columns = scope.$parent.columns
                    .map(function(column, index){
                        return _.get(scope, 'row.overwrite[' + index + ']',column) ;
                    })
                    .map(function setType(column){
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

                ctrl.registerModel(ngModel, {
                    data: scope.row,
                    dflt: (scope.columns || []).map(mapDefault)
                });

                // setup validation
                ngModel.$parsers.unshift(requiredValidator);
                ngModel.$parsers.unshift(patternValidator);
                requiredValidator(ngModel.$viewValue);
                scope.$watchCollection('response', function(value){ngModel.$setViewValue(value.slice());}); // reset response so that parsers trigger
                
                function requiredValidator(value){
                    var isValid = scope.columns.every(isFull);
                    ngModel.$setValidity('required', isValid);
                    return value;

                    function isFull(column, index){
                        var val = value[index];
                        // if not required
                        if (!scope.data.required && !scope.row.required && !column.required) return true; 
                        switch (column.type){
                            case 'text': return true;
                            case 'input': return val !== '';
                            case 'dropdown': return !isNaN(val) && val !== null;
                            default: return val;
                        }
                    }
                }

                function patternValidator(value){
                    var isValid = scope.columns.every(fitsPattern);
                    ngModel.$setValidity('pattern', isValid);
                    return value;

                    function fitsPattern(column, index){
                        var val = value[index];
                        if (column.type !== 'input' || !column.pattern) return true;
                        if (_.isNumber(val) || _.isString(val)){
                            return (new RegExp(column.pattern)).test(val);
                        } 
                        else return false;
                    }
                }
            }
        };
    }

    return gridRowDirective;

    function mapDefault(column){
        if (typeof column === 'string') return false;
        if (column.type === 'text') return null;
        if (column.type === 'input') return '';
        if (column.type === 'dropdown') return NaN;
        return false; // checkbox
    }
});
