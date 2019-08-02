import _ from 'lodash';
import Logger from './logger';
import dfltLogger from './dfltLogger';
import oldLogger from './oldLogger';
import csvLogger from './csvLogger';
import debugLogger from './debugLogger';

export default function managerLogger(settings, piConsole){
    var composedSettings = _.assign({onError:onError}, getSettingsObject(settings), settings);
    return Logger(composedSettings);

    function onError(){
        piConsole({
            type:'error',
            message: 'Logger failed',
            error: _.head(arguments),
            rows: [
                ['Task Name:', arguments[1]],
                ['Data processed:', arguments.length == 5 ? arguments[2] : 'N/A'],
                ['Settings:', arguments[arguments.length-2]]
            ]
        });
    }
}

function getSettingsObject(settings){
    var type = settings.type;

    if (settings.postCsv) return csvLogger;
    if (type == 'csv') return csvLogger;
    if (type == 'old') return oldLogger;
    if (type == 'debug') return debugLogger;
    return dfltLogger;
}
