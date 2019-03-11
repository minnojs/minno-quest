import _ from 'lodash';
import Logger from './logger/managerLogger';
import createLogs from './task/tasks/createLogs';
import getUrlParameters from './getUrlParameters';
import {injectStyle} from './task/tasks/injectStyle';

managerService.$inject = ['$rootScope', '$q', 'managerSequence', 'managerTaskLoad', '$injector', 'piConsole'];
function managerService($rootScope, $q, ManagerSequence, taskLoad, $injector, piConsole){

    /**
     * This is the constructor for the manager object.
     *
     * The manager is responsible for the interface between the managerDirective and the managerSequence
     * It deals with loading tasks (pulled from the sequence)
     * And notifying the directive that a new task is ready to be run.
     *
     * listens to manager:next and manager:prev ==> proceeds sequence
     *
     * emits manager:loaded <== when a script is loaded
     *
     * @param  {Scope} $scope The scope to be notified
     * @param  {Object} script The manager script to be parsed
     * @return {Object}
     */
    function Manager($scope, script){
        var self = this;
        var settings = script.settings || {};

        // make sure this works without a new statement
        if (!(this instanceof Manager)) return new Manager($scope,script);

        this.$scope = $scope;
        this.script = script;
        this.logger = Logger(settings.logger || {}, piConsole); // the central logger to be used by tasks
        this.log = createLogs(this.logger, this.script, {type:'manager', $name:script.name || 'manager'}); // a specific log to deal with manager logging (make sure we post immediately
        $scope.$on('$destroy', function(){ self.log.end(true); });

        // create sequence
        this.sequence = new ManagerSequence(script);

        // activate all setup stuff
        setup(this, $scope, settings);

        $scope.$on('manager:next', function(event, target){
            target || (target = {type:'next'});
            switch (target.type){
                case 'current':
                    self.load(target);
                    break;
                case 'prev':
                    self.prev(target);
                    break;
                case 'next':
                    /* fall through */
                default:
                    self.next(target);
            }
        });
        $scope.$on('manager:prev', function(){self.prev();});
    }

    _.extend(Manager.prototype, {
        next: function(target){
            this.sequence.next();
            this.load(target);
        },

        prev: function(target){
            this.sequence.prev();
            this.load(target);
        },

        current: function(){
            // taskLoad sets the loaded script into $script
            return this.sequence.current();
        },

        load: function(target){
            var task = this.current();
            var $scope = this.$scope;
            var loadOptions = {
                baseUrl: this.baseUrl,
                bustCache: target && target.bustCache
            };

            // taskLoad adds $script and $template to the task object
            if (task) return taskLoad(task, loadOptions).then(function(){
                piConsole({
                    tags:['manager'],
                    type:'debug',
                    message:'Manager:currentTask',
                    context: task
                });
                $scope.$emit('manager:loaded');
            });

            // let the directive deal with the end of the sequence
            $scope.$emit('manager:loaded');
        },

        setBaseUrl: function(baseUrl){
            this.baseUrl = baseUrl;
        }
    });

    return Manager;

    // just to separate the activation of all the settings: KISS
    function setup(manager, $scope, settings){
        var canvas = $injector.get('managerCanvas');
        var $document = $injector.get('$document');
        var preloadImages = $injector.get('piPreloadImages');
        var beforeUnload = $injector.get('managerBeforeUnload');
        var rootElement = $injector.get('$rootElement');
        var canvasOff, stylesOff, skinClass = settings.skin || 'default';
        var piConsole = $injector.get('piConsole');
        var global = $scope.global;

        // prevent accidental browsing away
        beforeUnload.activate();
        $scope.$on('$destroy', beforeUnload.deactivate);

        // activate canvas
        canvasOff = canvas(settings.canvas);
        $scope.$on('$destroy', canvasOff);

        // inject styles
        if (settings.injectStyle) {
            piConsole({
                type:'warn',
                message: 'settings.injectStyle is deprecated, please use the injectStyle task instead',
                context: settings.injectStyle
            });
            stylesOff = injectStyle(settings.injectStyle);
            $scope.$on('$destroy', stylesOff);
        }

        // preload images
        preloadImages(settings.preloadImages || []);

        // activate titles
        if (settings.title) $document[0].title = settings.title;

        rootElement.addClass(skinClass + '-skin');
        rootElement.attr('dir', settings.rtl ? 'rtl' : '');

        // connect piConsole to settings
        piConsole.settings = settings.DEBUG || {};

        global.$url = getUrlParameters();

        // post "postOnce" data
        if (global.$postOnce) manager.log(global.$postOnce, settings);
    }
}

export default managerService;