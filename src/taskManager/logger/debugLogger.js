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

function serialize(name, logs){
    return logs;
}

function send(name, serialized, settings){
    // eslint-disable-next-line no-console
    if (!settings.url) console.warn('Logger('+name+'): You have not set a logger url');
    // eslint-disable-next-line no-console
    serialized.map(function(val){ console.info('Logger('+name+'):', val); });
}
