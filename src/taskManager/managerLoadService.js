import _ from 'lodash';

managerLoadService.$inject = ['$q', 'managerGetScript'];
function managerLoadService($q, getScript){

    function managerLoadScript(source){
        var promise = _.isString(source) ? getScript(source) : source;
        return $q.when(promise).then(normalizeTasks);
    }

    return managerLoadScript;
}

export default managerLoadService;

// if we loaded a non manager - play it!
function normalizeTasks(script){
    if (!script.type || script.type == 'manager') return script;
    var dfltLogger = _.get(script,'settings.logger',{type:'debug'});
    return {
        type: 'manager',
        settings: {logger:dfltLogger},
        current: {},
        sequence: [
            {type:script.type, script:script}
        ]
    };
}
