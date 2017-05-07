define(function(require){

    var _ = require('underscore');

    return function(){
        return dfltUnits;
    };

    function dfltUnits(value, unit) {
        var suffix;

		// if value is empty (unless it equals 0)
        if (!value && value !== 0 && value !== '0'){
            return '';
        }

        if (isNumeric(value)){
            suffix = _.isUndefined(unit) ? 'px' : String(unit);
            return value + suffix;
        }
        return value;
    }

	// taken from jquery
    function isNumeric(obj){
        return !_.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
    }
});