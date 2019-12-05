import _ from 'lodash';
export default activateRedirect;
activateRedirect.$inject = ['done', 'task', 'managerBeforeUnload','logger'];
function activateRedirect(done, task, beforeUnload, logger){
    if (!_.result(task,'condition',true)) return done();
    // make sure we don't go away before finishing logging
    logger.$promise().finally(function(){
        beforeUnload.deactivate();
        location.href = task.url;
    });
}

