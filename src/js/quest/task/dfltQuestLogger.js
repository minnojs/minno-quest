define(function(require){
    var _ = require('underscore');

    function dfltQuestLogger(log, pageData, global){
        global;
        var logObj = _.extend({},pageData,log);
        if (logObj.declined) {
            logObj.response = log.responseObj = undefined;
        }
        return logObj;
    }

    return dfltQuestLogger;

});