export default allowLeaving;

allowLeaving.$inject = ['done', 'managerBeforeUnload'];
function allowLeaving(done, managerBeforeUnload){
    managerBeforeUnload.deactivate(); 
    done(); 
}
