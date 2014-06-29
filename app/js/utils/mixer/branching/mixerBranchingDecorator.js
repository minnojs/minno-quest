/**
 * Registers the branching mixers with the mixer
 * @return {function}         [mixer decorator]
 */
define(function(require){

	var _ = require('underscore');

	mixerBranchingDecorator.$inject = ['$delegate','mixerEvaluate'];
	function mixerBranchingDecorator(mix, evaluate){

		mix.mixers.branch = branch;
		mix.mixers.multiBranch = multiBranch;

		return mix;

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