define(function(require){

    var _ = require('underscore');
    var angular = require('angular');

	/**
	 * Constructor for PIQuest script creator
	 * @return {Object}		Script creator
	 */
    function API(){
        this.script = {
            settings:{},
            pages: [],
            questions: [],
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

        addPagesSet : function(set, list){
            var script = this.script;
            _.isArray(list) || (list = [list]);

            _.each(list, function(value){
                value.set = set;
                script.pages.push(value);
            });

            return this;
        },

        addQuestionsSet : function(set, list){
            var script = this.script;
            _.isArray(list) || (list = [list]);

            _.each(list, function(value){
                value.set = set;
                script.questions.push(value);
            });

            return this;
        },

        addSequence: function(sequence){
            var script = this.script;
            _.isArray(sequence) || (sequence = [sequence]);

            script.sequence = script.sequence.concat(sequence);

            return this;
        },

        getGlobal: function(){
            return this.script.global;
        },

        addGlobal: function(global){
            if (!_.isPlainObject(global)){
                throw new Error('global must be an object');
            }
            _.merge(this.getGlobal(), global);
        },

        getCurrent: function(){
            return this.script.current;
        },

        addCurrent: function(current){
            if (!_.isPlainObject(current)){
                throw new Error('current must be an object');
            }
            _.merge(this.getCurrent(), current);
        },

        post: function(url, obj){
            var $injector = angular.injector(['ng']);

            return $injector.invoke(['$http', function($http){
                return $http.post(url, obj);
            }]);
        }
    });

    return API;
});