/**
 * @name: taskActivateProvider
 */


import _ from 'lodash';


function provider(){
    var activators = {};

    this.$get = taskActivateProvider;

    this.set = function set(name, fn){
        activators[name] = fn;
    };

    this.get = function(name){
        return activators[name];
    };
}


taskActivateProvider.$inject = ['$q', '$rootScope', '$injector'];
function taskActivateProvider($q,$rootScope, $injector){
    var self = this;

    function taskActivate(task, $element, $scope, log){
        var def = $q.defer();
        var global = $rootScope.global;
        var script = task.$script;
        var activator = getActivator(script, task);
        var destroy;

        /**
         * activation function
         * @param {function} done calback for finishing the task
         * @param {obj} props an object with all the stuff we think we could need...
         * @type {[type]}
         */
        destroy = $injector.invoke(activator, null, {
            done: _.bind(def.resolve,def),
            task: task,
            script: script,
            $element: $element,
            $scope: $scope,
            global: global,
            log: log
        });

        // if activator returns a function use it to clean up the task
        if (_.isFunction(destroy)) def.promise['finally'](destroy);

        return def;
    }

    return taskActivate;

    function getActivator(script, task){
        var activator;
        if (_.isFunction(script) || _.isArray(script)) return script;

        if (script && _.isFunction(script.play)){
            activator = _.bind(script.play, script);
            activator.$inject = $injector.annotate(script.play);
        }

        if (script && _.isArray(script.play)){
            activator = _.bind(_.last(script.play), script);
            activator.$inject = $injector.annotate(script.play);
            return activator;
        }

        if (task.type) return self.get(task.type);

        throw new Error('Activator function not found for the "' + task.type + '" task');
    }
}

export default provider;
