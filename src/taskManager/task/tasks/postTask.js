import _ from 'lodash';
export default activatePost;

activatePost.$inject = ['done', 'task', 'logger','$rootScope'];
function activatePost(done, task, logger, $rootScope){
    var global = $rootScope.global;
    var data = getData(task, global);
    var settings = _.assign({isSave:true}, task.settings);
    var log = logger.createLog(task.$name, settings);

    log(data);
    log.end(true);
    done();
}

function getData(task, global){
    var data = task.path ? _.get(global, task.path) : task.data;

    if (_.isPlainObject(data)) return data;
    if (_.isFunction(data)) return data(global, task);
    return _.set({}, task.path || 'key', data);
}
