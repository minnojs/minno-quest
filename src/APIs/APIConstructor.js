window.piGlobal || (window.piGlobal = {});

import _ from 'lodash';
import angular from 'angular';

export default APIconstructor;

var global = window.piGlobal;

/**
 * Create a new API
 * @param {Object} options
 * {
 * 		type: 'PIP',
 * 		sets: ['trial', 'stimulus', 'media']
 * }
 */
function APIconstructor(templateOptions){

    function API(){
        // this makes sure that we don't recycle objects set in the template
        var options = _.cloneDeep(templateOptions); 
        var script = this.script = {
            type: options.type,
            name: 'anonymous ' + options.type,
            settings: options.settings || {},
            current: global.current || {}, 
            sequence: []
        };

        this.settings = script.settings;

        // create set arrays
        _.forEach(options.sets, function(set){
            script[set + 'Sets'] = [];
        });
    }

    _.forEach(templateOptions.sets, function(set){
        _.set(API.prototype, _.camelCase('add-' + set + '-set') ,  add_set(set));
    });

    _.extend(API.prototype, templateOptions.static, {

        setName: function(name){
            this.script.name = name;
        },

        // settings
        addSettings: function(name, settingsObj){
            if (!_.isString(name)) throw new Error('The first argument to API.addSettings must be a string');

            if (_.isPlainObject(settingsObj)) this.settings[name] = _.extend(this.settings[name] || {}, settingsObj);
            else this.settings[name] = settingsObj;

            return this;
        },

        addSequence: function(sequence){
            var script = this.script;
            _.isArray(sequence) || (sequence = [sequence]);

            script.sequence = script.sequence.concat(sequence);

            return this;
        },

        addGlobal: function(obj){
            if (!_.isPlainObject(obj)) throw new Error('global must be an object');
            return _.merge(global, obj);
        },

        getGlobal: function(){
            return global;
        },

        addCurrent: function(obj){
            if (!_.isPlainObject(obj)) throw new Error('current must be an object');
            return _.merge(this.script.current, obj);
        },

        getCurrent: function(){
            return this.script.current;
        },

        // push a whole script
        addScript: function(obj){
            return _.merge(this.script,obj);
        },

        // returns script (for debuging probably)
        getScript: function(){
            return this.script;
        },

        save: function save(obj){
            var script = this.script;
            var toSave = script._toSave || (script._toSave = []);

            if (!_.isPlainObject(obj)) throw new Error('API.save can send only objects.'); 

            /**
             * Check if we already have a reference to the logger, if not - keep the logged object on ice
             * See taskManager/task/tasks/createLogs.js for the rational here
             *
             */
            return script._save ? script._save(obj) : toSave.push(obj);
        },

        // name, response, taskName, taskNumber
        post: function(url, obj){
            var $injector = angular.injector(['ng']);

            return $injector.invoke(['$http', function($http){
                return $http.post(url, obj);
            }]);
        },

        shuffle: _.shuffle.bind(_)
    });

    return API;
}


/**
 * Create a function that adds sets of a scpecific type
 * @param {String} type  	The type of set setter to create
 * @returns {Function} 	A setter object
 */
function add_set(type){

    /**
     * Adds a set to the targetSet
     * @param {String, Object} set    	Either full set object, or the name of this setArr
     * @param {Array} setArr 			An array of objects for this set
     * @returns {Object} The API object
     *
     * use examples:
     * fn({
     *   intro: [intro1, intro2],
     *   Default: [defaultTrial]
     * })
     * fn('intro',[intro1, intro2])
     * fn('Default',defaultTrial)
     *
     */
    function setSetter(set, setArr){
        // get the sets we want to extend (or create them)
        var targetSets = this.script[type + 'Sets'] || (this.script[type + 'Sets'] = []);
        var list;

        if (_.isUndefined(set)) throw new Error('There is an undefined "' + type + 'Set".');

        if (_.isArray(set)) list = set;
        if (_.isString(set)) list = addSet(set, arrayWrap(setArr));
        if (_.isPlainObject(set)) {
            list = _.map(set, function(arr, setName){
                return addSet(setName, arrayWrap(arr));
            });
            list = _.flatten(list); 
        }

        validateList(list);

        // merge the list into the targetSet
        targetSets.push.apply(targetSets, list);
    }

    function addSet(setName, arr){ return arr.map(function(el){ return _.set(el, 'set', setName); }); }
    function arrayWrap(arr){ return _.isArray(arr) ? arr : [arr]; }

    function validateList(list){
        if (_.isUndefined(list)) throw new Error('Error parsing "' + type + 'Set": Unknown set type.');
        if (list.every(function(el){ return _.has(el, 'set'); })) return;
        throw new Error('All elements must be defined and belong to a set (error parsing "' + type + 'Set")');
    }

    return setSetter;
}
