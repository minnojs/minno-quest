/**
 * The module responsible for the single task.
 * It knows how to load a task and activate it.
 * It also supplies the basic task directive.
 * @return {module} pi.task module.
 */


import {requirejs} from 'requirejs/require.js';
import angular from 'angular';
import _ from 'lodash';
import taskActivateProvider from './taskActivateProvider';
import taskDirective from './taskDirective';
import time from 'minno-time';
import managerToCsv from './managerToCsv';

export default module;

var module = angular.module('pi.task',[]);
module.provider('taskActivate', taskActivateProvider);
module.directive('piTask', taskDirective);


// the tasks defined here essentialy activate the default players for quest/message/pip.

/**
 * Quest
 */
module.config(['taskActivateProvider', function(activateProvider){

    activateQuest.$inject = ['done', '$element', '$scope', '$compile', 'script','task'];
    function activateQuest(done, $canvas, $scope, $compile, script, task){
        var $el;

        // update script name
        task.name && (script.name = task.name);

        $scope.script = script;

        $canvas.append('<div pi-quest></div>');
        $el = $canvas.contents();
        $compile($el)($scope);

        // clean up piQuest
        $el.controller('piQuest').task.promise['finally'](done);

        return function questDestroy(){
            $el.scope().$destroy();
            $el.remove();
        };
    }

    activateProvider.set('quest', activateQuest);
}]);

module.config(['taskActivateProvider', function(activateProvider){
    activateMessage.$inject = ['done', '$element', 'task', '$scope','$compile'];
    function activateMessage(done, $canvas, task, $scope, $compile){
        var $el;

        $scope.script = task;

        $canvas.append('<div pi-message></div>');
        $el = $canvas.contents();
        $compile($el)($scope);

        // clean up
        $scope.$on('message:done', function(){
            done();
        });

        return function destroyMessage(){
            $scope.$destroy();
            $el.remove();
        };
    }

    activateProvider.set('message', activateMessage);
}]);

/**
 * Post
 */
module.config(['taskActivateProvider', function(activateProvider){
    activatePost.$inject = ['done', 'task', '$http','$q', '$rootScope', 'piConsole'];
    function activatePost(done, task, $http, $q, $rootScope, piConsole){
        var canceler = $q.defer(); // http://stackoverflow.com/questions/13928057/how-to-cancel-an-http-request-in-angularjs
        var global = $rootScope.global;
        var data = task.path ? _.get(global, task.path) : task.data;

        $http
            .post(task.url, data, {timeout: canceler.promise})
            .then(done,fail);

        return canceler.resolve;

        function fail(response){
            var err = new Error('Post error("'+task.url+'"): ' + response.statusText); // but shout about the failure
            done(); // continue with the task
            piConsole({
                type:'error',
                error:err,
                message: 'Post error',
                context: task
            });
            throw err;
        }
    }

    activateProvider.set('post', activatePost);
}]);

module.config(['taskActivateProvider', function(activateProvider){
    activatePostCsv.$inject = ['done', 'task', '$http','$q', '$rootScope'];
    function activatePostCsv(done, task, $http, $q, $rootScope){
        var canceler = $q.defer(); // http://stackoverflow.com/questions/13928057/how-to-cancel-an-http-request-in-angularjs
        var global = $rootScope.global;
        var csv = managerToCsv(global);

        $http
            .post(task.url, csv, {timeout: canceler.promise})
            .then(done,done);

        return canceler.resolve;
    }

    activateProvider.set('postCsv', activatePostCsv);
}]);

/**
 * Redirect
 */
module.config(['taskActivateProvider', function(activateProvider){
    activateRedirect.$inject = ['done', 'task', 'managerBeforeUnload'];
    function activateRedirect(done, task, beforeUnload){
        if (_.result(task,'condition',true)){
            beforeUnload.deactivate();
            location.href = task.url;
        } else {
            done();
        }
    }

    activateProvider.set('redirect', activateRedirect);
}]);

/**
 * minno-time activator
 **/
module.config(['taskActivateProvider', function(activateProvider){
    activatePIP.$inject = ['done', '$element', 'task', 'script', 'piConsole'];
    function activatePIP(done, $canvas, task, script, piConsole){
        var $el, req;
        var pipSink;

        if (task.version > 0.4) {
            // update script name
            task.name && (script.name = task.name);

            $canvas.append('<div pi-player></div>');
            $el = $canvas.contents();
            $el.addClass('pi-spinner');

            requirejs([ task.baseUrl + '/dist/time.js'], function(time){
                pipSink = time($el[0], script);
                pipSink.onEnd(done);
                pipSink.$messages.map(piConsole);
                $el.removeClass('pi-spinner');
            });

            return function destroyPIP(){
                $el.remove();
                pipSink && pipSink.end();
            };
        }

        // load PIP
        req = requirejs.config({
            context: _.uniqueId(),
            baseUrl: task.baseUrl || '../bower_components/PIPlayer/dist/js', // can't use packages yet as urls in pip aren't relative...
            paths: {
                //plugins
                text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min', '../../bower_components/require-text/text'],

                // Core Libraries
                jquery: ['//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min','../../bower_components/jquery/dist/jquery.min'],
                underscore: ['//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min','../../bower_components/lodash-compat/lodash.min'],
                backbone: ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min', '../../bower_components/backbone/backbone']
            },

            deps: ['jquery', 'backbone', 'underscore']
        });

        // update script name
        task.name && (script.name = task.name);

        $canvas.append('<div pi-player></div>');
        $el = $canvas.contents();
        $el.addClass('pi-spinner');

        req(['activatePIP'], function(activate){
            $el.removeClass('pi-spinner');
            activate(script, done);
        });

        return function destroyPIP(){
            $el.remove();
            req(['app/task/main_view'], function(main){
                main.deferred.resolve();
                main.destroy();
            });
        };
    }

    activateProvider.set('pip', activatePIP);
}]);

/**
 * minno-time activator
 **/
module.config(['taskActivateProvider', function(activateProvider){
    activateTime.$inject = ['done', '$element', 'task', 'script', 'piConsole'];
    function activateTime(done, $canvas, task, script, piConsole){
        var $el;
        var pipSink;

        // update script name
        task.name && (script.name = task.name);

        $canvas.append('<div pi-player></div>');
        $el = $canvas.contents();

        pipSink = time($el[0], script);
        pipSink.onEnd(done);
        pipSink.$messages.map(piConsole);

        return function destroyPIP(){
            $el.remove();
            pipSink.end();
        };
    }

    activateProvider.set('time', activateTime);
}]);
