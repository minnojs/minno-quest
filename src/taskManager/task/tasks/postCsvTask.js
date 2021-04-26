import csvSettings from '../../logger/csvLogger';
import _ from 'lodash';
export default postCsv;
postCsv.$inject = ['done', 'task', 'logger'];
function postCsv(done, task, logger){
    // create a log
    var log = logger.createLog('manager', _.defaults({type:'csv'}, task));

    // ending a logger named manager triggers the send function
    log.end(true); 
    return logger.$promise().then(done);
}
