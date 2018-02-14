import stream from 'mithril-stream';
import _ from 'lodash';

export default Logger;

function Logger(defaultSettings){
    var ctx = {};
    return {createLog:createLog,ctx:ctx};

    function createLog(name, localSettings){
        var log = stream();
        var logs = stream();
        var settings = _.defaults({}, localSettings, defaultSettings);

        if (!_.isString(name)) throw new Error('Log name must be a string');
        validateSettings(settings);
        
        log.map(onRow).map(logs);
        log.end.map(onEnd).map(logs);

        logs
            .map(filterUndefined)
            .map(serialize)
            .map(send);

        return log;

        function onRow(row){ return settings.onRow(name, row, settings, ctx); }
        function onEnd(){ return settings.onEnd(name, settings, ctx); }
        function filterUndefined(val){ return _.isUndefined(val) ? stream.HALT : val; }
        function serialize(logs){ return settings.serialize(name, logs, settings, ctx); }
        function send(serialized){ return settings.send(name, serialized, settings, ctx); }

        function validateSettings(settings){
            var functionNames = ['onRow','onEnd','serialize','send'];
            if (functionNames.every(function(prop){return _.isFunction(settings[prop]);})) return;
            throw new Error('The Logger requires all four of the following functions: "onRow","onEnd","serialize","send"');
        }
    }
}


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
