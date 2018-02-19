import _ from 'lodash';
import xhr from './xhr';

export default {onRow:onRow, onEnd:onEnd, serialize:serialize, send:send};

/*
 * Regular logs
 */
function onRow(name, row, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);
    logs.push(row);

    if (settings.pulse && logs.length >= settings.pulse){
        var res = [].concat(logs);
        logs.length = 0;
        return res;
    }
}

function onEnd(name, settings, ctx){
    var logs = ctx[name] || (ctx[name] = []);
    if (logs.length) return logs;
}

function serialize(name, logs, settings){
    var obj =  _.assign({
        data: logs.map(function(log){ return _.set(log, 'taskName', name); }),
    }, settings.meta);

    return JSON.stringify(obj);
}

function send(name, serialized, settings){
    xhr({url:settings.url, mehtod:'PUT', body:serialized});
}
