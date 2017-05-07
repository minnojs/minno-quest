/* global performance */

/**
 * Returns current time (uses performance if possible).
 * Notably, this function return either time since epoch or since startup. It is useful only for latency calculations.
 * @return {integer} [Time in ms]
 */
define(function(){

    var nowFn;

	// if performance is set, look for the now function
    if (window.performance) {
        nowFn = performance.now ||
		performance.mozNow ||
		performance.webkitNow ||
		performance.msNow ||
		performance.oNow;
    }

	// if we have now proxy it (so it uses perfomance as "this")
	// otherwise use regular date/time
    return nowFn ?
		function now(){return nowFn.apply(performance);}
		: function now(){ return +new Date();};

});