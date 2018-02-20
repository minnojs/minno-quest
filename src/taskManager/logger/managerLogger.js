import _ from 'lodash';
import Logger from './logger';
import dfltLogger from './dfltLogger';
import oldLogger from './oldLogger';
import csvLogger from './csvLogger';

export default function managerLogger(settings, piConsole){
    var composedSettings = _.assign({onError:onError}, getSettingsObject(settings), settings);
    return Logger(composedSettings);

    function onError(){
        piConsole({
            type:'error',
            message: 'Logger failed',
            error: _.first(arguments),
            rows: [
                ['Task Name:', arguments[1]],
                ['Data processed:', arguments.length == 5 ? arguments[2] : 'N/A'],
                ['Settings:', arguments[arguments.length-2]]
            ]
        });
    }
}

function getSettingsObject(settings){
    if (settings.postCsv) return csvLogger;
    if (settings.type == 'old') return oldLogger;
    if (settings.type == 'new') return dfltLogger;
    return oldLogger;
}
   
