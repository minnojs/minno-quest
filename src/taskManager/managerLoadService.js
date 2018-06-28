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
    return {
        type: 'manager',
        settings: {logger:{type:'debug'}},
        current: {},
        sequence: [
            {type:script.type, script:script}
        ]
    };
}
