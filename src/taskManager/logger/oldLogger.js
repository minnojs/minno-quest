import _ from 'lodash';
import xhr from './xhr';

var serial = 1000;
var taskNumber = 0;
var lastTrialId; // keep track of last trialId to preven duplicates
export default {onRow:onRow, onEnd:onEnd, serialize:serialize, send:send};

/*
 * Regular logs
 */
function onRow(name, row, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);

    if (settings.isPost) return apiSave(row);
    if (settings.isManager) return row;

    if (settings.isPIP || settings.isTime){
        if (row.trial_id === lastTrialId) settings.onError.apply(null, [new Error('minno-time: PI server does not accept multiple logs per trial'),name,row,settings,ctx]);
        lastTrialId = row.trial_id;
    }

    logs.push(row);

    if (settings.pulse && logs.length >= settings.pulse){
        var res = [].concat(logs);
        logs.length = 0;
        return res;
    }

    function apiSave(row){
        return _.toPairs(row) // row => [[key,value]]
            .map(function(pair){ 
                return {
                    name:pair[0], 
                    response: pair[1], 
                    serial: serial++
                }; 
            });
    }
}


function onEnd(name, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);
    taskNumber++;
    serial=1000;
    if (logs.length) return logs;
}

function serialize(name, logs, settings){
    var data,meta;
    var metaData =  _.assign({taskName:name, taskNumber:taskNumber}, window.piGlobal.$meta, settings.meta);

    if (settings.isPost) return JSON.stringify(logs.map(assignMeta));
    if (settings.isManager) return JSON.stringify(_.assign(metaData,logs));

    data = logs.map(assignMeta);

    // pip style
    if (settings.isPIP || settings.isTime) {
        data = 'json=' + encodeURIComponent(JSON.stringify(data)); // do not re-encode json
        meta = serializePIP(metaData);
        return data + (meta ? '&'+meta : '');
    }

    // piQuest style
    return JSON.stringify(data);

    function assignMeta(log) { return _.assign({},log,metaData); }
    function serializePIP(data){
        var key, r = [];
        for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return r.join('&').replace(/%20/g, '+');
    }
}

function send(name, serialized, settings, ctx){
    var contentType = !settings.isPost && (settings.isPIP || settings.isTime) && 'application/x-www-form-urlencoded; charset=UTF-8';
    var url = settings.isPost || settings.isQuest
        ? '/implicit/PiQuest'
        : settings.isPIP || settings.isTime
            ? '/implicit/PiPlayerApplet'
            : '/implicit/PiManager';

    return xhr({url:url, mehtod:'POST', body:serialized, contentType:contentType}).catch(onError);


    function onError(e){ settings.onError.apply(null, [e,name,serialized,settings,ctx]); }
}
