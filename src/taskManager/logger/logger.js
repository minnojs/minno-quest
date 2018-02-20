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
        
        log.map(tryCatch(onRow)).map(logs);
        log.end.map(tryCatch(onEnd)).map(logs);

        logs
            .map(filterUndefined)
            .map(tryCatch(serialize))
            .map(tryCatch(send));

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

        function tryCatch(tryer){
            return function(){
                try { return tryer.apply(this, arguments); } 
                catch (e) { 
                    if (settings.onError) return settings.onError.apply(this, [e].concat(arguments)); 
                    throw e;
                }
            };
        }
    }
}
