/**
 * Registers the branching mixers with the mixer
 * @return {function}         [mixer decorator]
 */
define(function(require){

	var _ = require('underscore');

	mixerBranchingDecorator.$inject = ['$delegate','mixerCondition'];

	function mixerBranchingDecorator(mix, condition){

		mix.mixers.branch = branch;
		mix.mixers.multiBranch = multiBranch;

		return mix;

		/**
		 * Checks if a conditions set is true
		 * @param  {Array} conditions [an array of conditions]
		 * @param  {Object} context   [A context for the condition checker]
		 * @return {Boolean}          [Are these conditions true]
		 */
		function evaluate(conditions,context){
			return _.reduce(conditions, function(result,cond){
				return result && condition(cond, context);
			}, true);
		}

		/**
		 * Branching mixer
		 * @return {Array}         [A data array with objects to continue with]
		 */
		function branch(obj, context){
			return evaluate(obj.conditions, context) ? obj.data : obj.elseData || [];
		}

		/**
		 * multiBranch mixer
		 * @return {Array}         [A data array with objects to continue with]
		 */
		function multiBranch(obj, context){
			var row;

			row = _.find(obj.branches, function(branch){
				return evaluate(branch.conditions, context);
			});

			if (row) {
				return row.data || [];
			}

			return obj.elseData || [];
		}
	}

	return mixerBranchingDecorator;
});