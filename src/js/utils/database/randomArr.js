/*
 * a function that returns a random array of integers between 0 and length
 * @param length: the upper boundary to the randomization.
 */
define(['underscore'], function(_){
	
	function randomArr(length){
		return _.shuffle(_.range(length));
	}

	return randomArr;
});