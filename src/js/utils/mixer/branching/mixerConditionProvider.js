define(function(require){
	var _ = require('underscore');
	var angular = require('angular');


	mixerConditionProvider.$inject = ['mixerDotNotation', 'piConsole'];
	function mixerConditionProvider(dotNotation, piConsole){

		function mixerCondition(condition, context){
			// @TODO angular.$parse may be a better candidate for doing this...
			var left = dotNotation(condition.compare,context);
			var right = dotNotation(condition.to,context);
			var operator = condition.operator;

			piConsole(['conditions']).info('Condition: ', left, operator || 'equals', right, condition);

			if (_.isFunction(operator)){
				return !! operator.apply(context,[left, right]);
			}

			switch(operator){
				case 'greaterThan':
					if (_.isNumber(left) && _.isNumber(right)){
						return +left > +right;
					}
					return false;

				case 'greaterThanOrEqual':
					if (_.isNumber(left) && _.isNumber(right)){
						return +left >= +right;
					}
					return false;

				case 'in':
					if (_.isArray(right)){
						// binary operator to turn indexOf into binary.
						return ~_.indexOf(right, left);
					}
					return false;

				case 'exactly':
					return left === right;

				case 'equals':
					/* falls through */
				default:
					if (_.isUndefined(right)){
						return !!left;
					}
					return angular.equals(left, right);
			}

			return operator;
		}

		return mixerCondition;
	}

	return mixerConditionProvider;
});