import _ from 'lodash';
import Logger from './logger';

export default function managerLogger(settings, piConsole){
    var composedSettings = _.assign({onError:onError}, settings);
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
