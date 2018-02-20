import csvSettings from '../../logger/csvLogger';
export default postCsv;
postCsv.$inject = ['done', 'task', '$scope'];
function postCsv(done, task, $scope){
    var Logger = $scope.$parent.$parent.manager.logger;
    var logs = Logger.ctx.logs;
    if (!logs || !logs.length) return done();
    var serialized = csvSettings.serialize('manager', logs);
    var promise = csvSettings.send('manager', serialized, task);
    promise.then(function(){ logs.length = 0; }).finally(done);
}
