import _ from 'lodash';
import xhr from './xhr';
import dfltLogger from './dfltLogger';

export default  _.defaults({serialize:serialize, send:send}, dfltLogger);

function send(name, serialized, settings){
    xhr({url:settings.url, mehtod:'POST', body:serialized});
}

function serialize(name, logs, settings){
    var metaData = settings.meta;
    var data = 'json=' + JSON.stringify(logs); // do not re-encode json
    var meta = serialize(metaData);
    return data + (meta ? '&'+meta : '');

    function serialize(data){
        var key, r = [];
        for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return r.join('&').replace(/%20/g, '+');
    }
}
