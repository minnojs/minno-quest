import _ from 'lodash';
import xhr from './xhr';

var serial = 1;
export default {onRow:onRow, onEnd:onEnd, serialize:serialize, send:send};

/*
 * Regular logs
 */
function onRow(name, row, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);

    if (row.$isManual) return apiSave(row);

    logs.push(row);

    if (settings.pulse && logs.length >= settings.pulse){
        var res = [].concat(logs);
        logs.length = 0;
        return res;
    }
}

function apiSave(row){
    return _.pairs(row) // row => [[key,value]]
        .filter(function(pair){ return pair[0] !== '$isManual'; })
        .map(function(pair){ 
            return {
                name:pair[0], 
                response: pair[1], 
                serial: serial++
            }; 
        });
}

function onEnd(name, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);
    if (logs.length) return logs;
}

function serialize(name, logs, settings){
    var metaData =  _.assign({}, window.piGlobal.$meta, settings.meta);
    var data = 'json=' + JSON.stringify(logs); // do not re-encode json
    var meta = serialize(metaData);
    return data + (meta ? '&'+meta : '');

    function serialize(data){
        var key, r = [];
        for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return r.join('&').replace(/%20/g, '+');
    }
}

function send(name, serialized, settings, ctx){
    var url = name === 'manager' ? settings.managerUrl : settings.url;
    if (!url) return;
    xhr({url:url, mehtod:'POST', body:serialized}).catch(onError);

    function onError(e){ settings.onError.apply(null, [e,name,serialized,settings,ctx]); }
}
