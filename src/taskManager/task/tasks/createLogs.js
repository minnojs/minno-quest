
import _ from 'lodash';
export default createLog;

/**
 * Create the source streams for logging.
 * The API.save stream is set directly into the stream (WARNING: side effects)
 * The task log stream is returned
 * @returns Stream 
 **/
function createLog(logger, script, task){
    var name = task.$name;
    var type = task.type;
    var settings = cloneSet(script.settings.logger, _.camelCase('is-' + type), true);

    var log = logger.createLog(name, settings);
    var saveLog = logger.createLog(name, cloneSet(settings, 'isSave',true));
    log.end(saveLog.end);

    /**
     * This is a horrible horrible hack.
     * ---------------------------------
     * Here is the rational:
     * The task script was supposed to be a declarative description of the task.
     * A requirement was added to allow procedural saving of data.
     * When a script is loaded we have no guarantee that the manager even exists yet.
     * Therefore API.save pushes all logs into _toSave until the task is loaded, and then _save gives a direct reference to the logger
     **/
    script._save = saveLog;
    if (script._toSave) {
        script._toSave.map(saveLog);
        script._toSave.length = 0;
    }

    return log;
}

function cloneSet(obj, prop, val){
    return _.assign(_.set({},prop, val), obj);
}
