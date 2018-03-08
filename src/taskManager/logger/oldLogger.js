import _ from 'lodash';
import xhr from './xhr';

var serial = 1000;
export default {onRow:onRow, onEnd:onEnd, serialize:serialize, send:send};

/*
 * Regular logs
 */
function onRow(name, row, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);

    if (settings.isSave) return apiSave(row);
    if (settings.isManager) return row;

    logs.push(row);

    if (settings.pulse && logs.length >= settings.pulse){
        var res = [].concat(logs);
        logs.length = 0;
        return res;
    }

    function apiSave(row){
        return _.pairs(row) // row => [[key,value]]
            .map(function(pair){ 
                return {
                    name:pair[0], 
                    response: pair[1], 
                    serial: serial++,
                    taskName: name
                }; 
            });
    }
}


function onEnd(name, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);
    if (logs.length) return logs;
}

function serialize(name, logs, settings){
    var data,meta;
    var metaData =  _.assign({}, window.piGlobal.$meta, settings.meta);

    // manager style
    if (settings.isManager && !settings.isSave) return JSON.stringify(logs);

    // pip style
    if (settings.isPIP || settings.isTime) {
        data = 'json=' + JSON.stringify(logs); // do not re-encode json
        meta = serializePIP(metaData);
        return data + (meta ? '&'+meta : '');
    }

    // piQuest style
    data = logs.map(function(log) { return _.assign({},log,metaData); });
    return JSON.stringify(data);

    function serializePIP(data){
        var key, r = [];
        for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return r.join('&').replace(/%20/g, '+');
    }
}

function send(name, serialized, settings, ctx){
    var url = settings.isSave || settings.isQuest
        ? '/implicit/PiQuest'
        : settings.isPIP || settings.isTime
            ? '/implicit/PiPlayerApplet'
            : '/implicit/PiManager';

    xhr({url:url, mehtod:'POST', body:serialized}).catch(onError);

    function onError(e){ settings.onError.apply(null, [e,name,serialized,settings,ctx]); }
}
