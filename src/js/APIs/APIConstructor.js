define(function(require){

    window.piGlobal || (window.piGlobal = {});

    var _ = require('underscore');
    var angular = require('angular');
    var global = window.piGlobal;

    /**
     * Create a new API
     * @param {Object} options
     * {
     * 		type: 'PIP',
     * 		sets: ['trial', 'stimulus', 'media']
     * }
     */
    function APIconstructor(options){

        function API(){
            var script = this.script = {
                type: options.type,
                name: 'anonymous ' + options.type,
                settings: {},
                current: {}, // this is the actual namespace for this PIP
                sequence: []
            };

            this.settings = script.settings;

            // create set arrays
            _.forEach(options.sets, function(set){
                script[set + 'Sets'] = [];
            });
        }

        _.forEach(options.sets, function(set){
            API.prototype[_.camelCase('add-' + set + '-set')] = add_set(set);
        });

        _.extend(API.prototype, options.static, {

            setName: function(name){
                this.script.name = name;
            },

            // settings
            addSettings: function(name, settingsObj){
                var settings;

                if (_.isPlainObject(settingsObj)){
                    settings = this.settings[name] = this.settings[name] || {};
                    _.extend(settings, settingsObj);
                } else {
                    this.settings[name] = settingsObj;
                }

                return this;
            },

            addSequence: function(sequence){
                var script = this.script;
                _.isArray(sequence) || (sequence = [sequence]);

                script.sequence = script.sequence.concat(sequence);

                return this;
            },

            addGlobal: function(obj){
                if (!_.isPlainObject(obj)){
                    throw new Error('global must be an object');
                }
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

            save: function(){
                // eslint-disable-next-line no-console
                console.info('API.save was called with', arguments, 'but is not supported by this version of MinnoJS');
            },

            // name, response, taskName, taskNumber
            post: function(url, obj){
                // just so we can use this in standalone PIP
                if (require.defined('jquery')) return require('jquery' + '').ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(obj),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                });

                var $injector = angular.injector(['ng']);

                return $injector.invoke(['$http', function($http){
                    return $http.post(url, obj);
                }]);
            },

            shuffle: function(collection){
                return _.shuffle(collection);
            }
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

            if (_.isPlainObject(set)) {
                list = _(set)
                // for each set of elements
                .map(function(value, key){
                    // add the set name to each key
                    _.each(value, function(v){v.set = key;});
                    return value; // return the set
                })
                .flatten() // flatten all sets to a single array
                .value();
            }

            if (_.isArray(set)) list = set;

            if (_.isString(set)){
                list = _.isArray(setArr) ? setArr : [setArr];
                list = _.map(list, function(value){
                    value.set = set;
                    return value;
                });
            }

            // merge the list into the targetSet
            targetSets.push.apply(targetSets, list);
        }

        return setSetter;
    }

    return APIconstructor;
});
