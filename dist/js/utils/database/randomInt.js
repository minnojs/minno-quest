/*
 * a function that returns a random integer between 0 and length
 * @param length: the upper boundary to the randomization.
 */
define([], function(){
	
	function randomInt(length){
		return Math.floor(Math.random()*length);
	}

	return randomInt;
});