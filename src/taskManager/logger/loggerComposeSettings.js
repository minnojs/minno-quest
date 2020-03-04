import _ from 'lodash';
import dfltLogger from './dfltLogger';
import oldLogger from './oldLogger';
import csvLogger from './csvLogger';
import debugLogger from './debugLogger';

export default loggerDefaultSettings;

function loggerDefaultSettings(localSettings, globalSettings){
    var settings = _.assign({}, globalSettings, localSettings);
    var defaults = getLoggerDefaultSettingsObj(settings);
    return _.defaults(settings, defaults);
}

function getLoggerDefaultSettingsObj(settings){
    var type = settings.type;

    if (settings.postCsv) return csvLogger;
    if (type == 'csv') return csvLogger;
    if (type == 'old') return oldLogger;
    if (type == 'debug') return debugLogger;
    return dfltLogger;
}
