define(function(require){
    var _ = require('underscore');

    toRegexFilter.$inject = ['piConsole'];
    function toRegexFilter($console){
        return toRegex;

        function toRegex(value) {
            var err;

            if (_.isUndefined(value)){
                return /(?:)/;
            }

            if (_.isRegExp(value) || _.isString(value)){
                return new RegExp(value);
            } else {
                err = new Error('Question pattern is not a valid regular expression');
                $console('text').error(err, value);
                throw err;
            }
        }
    }

    return toRegexFilter;
});