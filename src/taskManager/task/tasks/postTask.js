import _ from 'lodash';
export default activatePost;

activatePost.$inject = ['done', 'task', '$http','$q', '$rootScope', 'piConsole'];
function activatePost(done, task, $http, $q, $rootScope, piConsole){
    var canceler = $q.defer(); // http://stackoverflow.com/questions/13928057/how-to-cancel-an-http-request-in-angularjs
    var global = $rootScope.global;
    var data = task.path ? _.get(global, task.path) : task.data;

    $http
        .post(task.url, data, {timeout: canceler.promise})
        .then(done,fail);

    return canceler.resolve;

    function fail(response){
        var err = new Error('Post error("'+task.url+'"): ' + response.statusText); // but shout about the failure
        done(); // continue with the task
        piConsole({
            type:'error',
            error:err,
            message: 'Post error',
            context: task
        });
        throw err;
    }
}

