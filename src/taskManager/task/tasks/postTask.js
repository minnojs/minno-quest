import _ from 'lodash';
export default activatePost;

activatePost.$inject = ['done', 'task', 'logger','$rootScope', 'piConsole'];
function activatePost(done, task, logger, $rootScope){
    var global = $rootScope.global;
    var data = task.path 
        ? getPath(task.path)
        : task.variableName
            ? getPath(task.variableName)
            : getData(task);

    var settings = _.assign({isPost:'true'}, task.settings);
    var log = logger.createLog(task.$name, settings);

    log(data);
    log.end(true);
    done();



    function getData(task, global){
        var data = task.data;

        if (_.isFunction(data)) return data(global, task);
        if (_.isPlainObject(data)) return data;
        return _.set({}, task.path || 'key', data);

    }

    function getPath(path){
        if (_.isString(path)) path = [path];

        return path.reduce(function(obj, key){
            var value = _.get(global, key);
            return _.set(obj, key, value);
        }, {});
    }
}

