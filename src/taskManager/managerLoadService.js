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
            // we use customize to copy script so that it does not get cloned by inflate
            // this is important because we want direct reference to the orginal "current"
            {type:script.type, customize:function(source){source.script = script;}}
        ]
    };
}
