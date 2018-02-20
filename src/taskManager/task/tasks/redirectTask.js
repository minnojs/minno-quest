import _ from 'lodash';
export default activateRedirect;
activateRedirect.$inject = ['done', 'task', 'managerBeforeUnload'];
function activateRedirect(done, task, beforeUnload){
    if (!_.result(task,'condition',true)) return done();
    beforeUnload.deactivate();
    location.href = task.url;
}

