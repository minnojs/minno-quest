define(function(require){

    var _ = require('underscore');


	/**
	 * Constructor for PIQuest script creator
	 * @return {Object}		Script creator
	 */
    function API(){
        this.script = {
            settings:{},
            tasks: [],
            sequence: [],
            global: {},
            current: {}
        };

        this.settings = this.script.settings;
    }

    _.extend(API.prototype, {

		// settings
        addSettings: function(name, settingsObj){
            var settings;

            if (_.isPlainObject(settingsObj)){
                settings = this.script.settings[name] = this.script.settings[name] || {};
                _.extend(settings, settingsObj);
            } else {
                this.script.settings[name] = settingsObj;
            }

            return this;
        },

        addTasksSet : function(set, list){
            var script = this.script;
            _.isArray(list) || (list = [list]);

            _.each(list, function(value){
                value.set = set;
                script.tasks.push(value);
            });

            return this;
        },

        addSequence: function(sequence){
            var script = this.script;
            _.isArray(sequence) || (sequence = [sequence]);

            script.sequence = script.sequence.concat(sequence);

            return this;
        },

        addGlobal: function(global){
            if (!_.isPlainObject(global)){
                throw new Error('global must be an object');
            }
            _.merge(this.script.global, global);
        },

        addCurrent: function(current){
            if (!_.isPlainObject(current)){
                throw new Error('current must be an object');
            }
            _.merge(this.script.current, current);
        }

    });

    return API;
});