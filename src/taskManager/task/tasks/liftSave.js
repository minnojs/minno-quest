/**
 * This is a horrible horrible hack.
 * ---------------------------------
 * Here is the rational:
 * The task script was supposed to be a declarative description of the task.
 * A requirement was added to allow procedural saving of data.
 * When a script is loaded we have no guarantee that the manager even exists yet.
 * Therefore API.save pushes all logs into _toSave until the task is loaded, and then _save gives a direct reference to the logger
 **/
export default liftSave;
function liftSave(log, script){
    script._save = log;
    if (script._toSave) {
        script._toSave.map(log);
        script._toSave.length = 0;
    }
}
