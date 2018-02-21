import csvSettings from '../../logger/csvLogger';
export default postCsv;
postCsv.$inject = ['done', 'task', 'logger'];
function postCsv(done, task, logger){
    var logs = logger.ctx.logs;
    if (!logs || !logs.length) return done();
    var serialized = csvSettings.serialize('manager', logs);
    var promise = csvSettings.send('manager', serialized, task);
    promise.then(function(){ logs.length = 0; }).finally(done);
}
