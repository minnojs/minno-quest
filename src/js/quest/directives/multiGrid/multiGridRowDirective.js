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
                        return _.get(scope, 'row.overwrite[' + index + ']') || column;
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
