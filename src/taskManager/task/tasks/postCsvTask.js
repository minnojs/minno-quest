import csvSettings from '../../logger/csvLogger';
import _ from 'lodash';
export default postCsv;
postCsv.$inject = ['done', 'task', 'logger'];
function postCsv(done, task, logger){
    var logs = logger.ctx.csv;
    if (!logs || !logs.length) return done();
    var serialized = csvSettings.serialize('manager', logs);
    var promise = csvSettings.send('manager', serialized, _.assign({}, logger.settings, task), logger.ctx);
    promise.then(function(){ logs.length = 0; }).finally(done);
}
