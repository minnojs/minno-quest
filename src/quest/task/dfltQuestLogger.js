import _ from 'lodash';

function dfltQuestLogger(log, pageData, global){
    global;
    var logObj = _.extend({},pageData,log);
    if (logObj.declined) {
        logObj.response = log.responseObj = undefined;
    }
    return logObj;
}

export default dfltQuestLogger;
