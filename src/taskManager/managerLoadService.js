/**
 * @name: managerLoadService
 * @returns {$q} A $q.promise that returns the target script
 */


import _ from 'lodash';

managerLoadService.$inject = ['$q', 'managerGetScript'];
function managerLoadService($q, getScript){

    function managerLoadScript(source){
        var promise = _.isString(source) ? getScript(source) : source;
        return $q.when(promise);
    }

    return managerLoadScript;
}

export default managerLoadService;
