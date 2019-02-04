import _ from 'lodash';
export default activatePost;

activatePost.$inject = ['done', 'task', 'logger','$rootScope', 'piConsole'];
function activatePost(done, task, logger, $rootScope, piConsole){
    var global = $rootScope.global;
    var path = task.variableName;
    var value = getValue(task);
    
    if (!_.isString(path)) {
        var e = new Error('setValue task: no variableName set');
        piConsole({
            type:'error',
            message: 'setValue variableName must be a string',
            error: e
        });
        throw e;
    }

    _.set(global, path, value);
    piConsole({
        type:'info',
        message: 'setValue',
        context: {
            variableName: path,
            value: value
        }
    });

    if (task.post) post(task, value);

    done();

    function getValue(task, global){
        if ('value' in task) return task.value;
        if (_.isString(task.valueFromPath)) return _.get(global, task.valueFromPath);
        if (_.isFunction(task.fn)) return task.fn(global);
        var e = new Error('setValue task: no value set');
        piConsole({
            type:'error',
            message: 'setValue must have one of the following properties set correctly: "value", "valueFromPath" or "fn"',
            error: e
        });
        throw e;
    }

    function post(task, value){
        var settings = _.assign({isSave:true}, task.settings);
        var log = logger.createLog(task.$name, settings);
        // we don't want to use _.set because we don't want to set a "deep" value here.
        var data = {};
        data[path] = value;
        log(data);
        log.end(true);
    }
}

