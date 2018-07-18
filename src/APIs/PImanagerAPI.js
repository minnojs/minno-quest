import Constructor from './managerAPI';
import _ from 'lodash';

import messageTemplate from './pi/messageTemplate.jst';
import messageTemplateDebrief from './pi/messageTemplateDebrief.jst';
import messageTemplatePanel from './pi/messageTemplatePanel.jst';

export default API;

/**
 * Constructor for PIPlayer script creator
 * @return {Object}		Script creator
 */
function API(){
    Constructor.call(this);

    _.set(this, 'settings.onPreTask',onPreTask);
    _.set(this, 'settings.logger.url', piGlobal.$dataUrl);
    window.IS_PI && _.set(this, 'settings.logger.managerUrl', '/implicit/PiManager/');
    window.IS_PI && _.set(this, 'settings.logger.type', 'old');
}

// create API functions
_.extend(API.prototype, Constructor.prototype);

// annotate onPreTask
onPreTask.$inject = ['currentTask', '$http','managerBeforeUnload','templateDefaultContext', 'managerSettings', 'piConsole'];

/**
 * Before each task,
 * 		post to /implicit/PiManager
 * 		in case this is a quest/pip added logging meta
 *
 * @param  {Object} currentTask The task Object
 * @param  {Object} $http       The $http service
 * @return {Promise}            Resolved when server responds
 */
function onPreTask(currentTask, $http, beforeUnload, templateDefaultContext,managerSettings, piConsole){
    var global = window.piGlobal;
    var context = {};
    var data = _.assign({}, global.$meta, {
        taskName: currentTask.name || 'namelessTask', 
        taskNumber: currentTask.$meta.number, 
        taskURL:currentTask.scriptUrl || currentTask.templateUrl
    });

    // set last task flag
    if (currentTask.last){
        window.IS_PI && (data.sessionStatus = 'C');
        beforeUnload.deactivate();
    }

    // add logging meta
    if (currentTask.type == 'quest' || currentTask.type == 'pip'){
        currentTask.$script.serial = currentTask.$meta.number;
        _.set(currentTask, '$script.settings.logger.meta', _.assign({}, data, _.get(currentTask, '$script.settings.logger.meta', {})));
        _.set(currentTask, '$script.settings.logger.error', error);
    }

    var isDev = /^(localhost|127.0.0.1)/.test(location.host);
    if (currentTask.type == 'pip') currentTask.baseUrl = currentTask.baseUrl ? currentTask.baseUrl 
        : isDev ? '/pip' 
        : window.IS_PI ?'/implicit/common/all/js/pip/' + (currentTask.version || 0.3)
        : '/openserver/minnojs/minno-time/0.3';

    if (currentTask.type == 'time') currentTask.baseUrl = currentTask.baseUrl ? currentTask.baseUrl 
        : isDev ? '/pip' 
        : window.IS_PI ? '/implicit/common/all/js/pip/0.5/'
        : '/openserver/minnojs/minno-time/0.5';

    // add feedback functions to the default template context
    _.extend(templateDefaultContext,{
        showFeedback: _.bind(showFeedback,null,global),
        showPanel: showPanel
    });

    if (currentTask.type == 'message' && currentTask.piTemplate){
        _.assign(context, templateDefaultContext, {
            global: global,
            current: global.current,
            task: currentTask,
            tasksData: _.get(currentTask,'data',{})
        });

        // compile template here so that we have all the addtional functions available
        // event when the template is loaded from a file.
        context.content = currentTask.$template = _.template(currentTask.$template)(context);

        if (currentTask.piTemplate == 'debrief'){
            currentTask.$template = _.template(messageTemplateDebrief)(context); // insert into meta template
            currentTask.$template = _.template(currentTask.$template)(context); // render secondary template with extended context
        } else {
            currentTask.$template = _.template(messageTemplate)(context); // insert into meta template
        }
    }

    // @TODO: export as individual task
    if (currentTask.last && global.$mTurk){
        var $mTurk = global.$mTurk;
        var mturkUrl = $mTurk.isProduction ?  'http://www.mturk.com/mturk/externalSubmit' : 'https://workersandbox.mturk.com/mturk/externalSubmit';
        var onPost = currentTask.post || _.noop;


        if (!_.every(['assignmentId','hitId','workerId'], function(prop){return _.has($mTurk, prop);})){
            var e = new Error ('$mTurk is missing a crucial property (assignmentId,hitId,workerId)');
            piConsole({type:'error', error: e, message: 'mTurk Error'});
            throw e;
        }

        currentTask.post = function(){
            onPost.apply(this, arguments);
            postRedirect(mturkUrl,_.omit($mTurk,'isProduction'));
        };
    }

    // connect to errorception
    if (window._err && window._err.meta){
        var meta = window._err.meta;
        meta.subtaskName = currentTask.name;
        meta.subtaskURL = currentTask.scriptUrl || currentTask.templateUrl;
    }

    function error(response){
        var errMessage = response.statusText +' (' + response.status +').';
        var e = new Error('Failed to update. ' + errMessage);
        var reportNoConnection = currentTask.reportNoConnection;
        if (reportNoConnection){
            var message = document.createElement('div');
            message.className = 'crash-message';
            message.innerHTML = reportNoConnection;
            document.body.insertBefore(message, document.body.firstChild);
        }

        piConsole({type:'error', error:e, message: 'PI failed to update server'});
        throw e;
    }
}

function postRedirect(path, params, method) {
    method = method || 'post'; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function showPanel(content, header, footer){
    return _.template(messageTemplatePanel)({
        content: content,
        header: header,
        footer: footer
    });
}

function showFeedback(global, options){
    _.isPlainObject(options) || (options = {});

    _.defaults(options,{
        pre: '<p>',
        post: '</p>',
        wrap: true,
        header: '',
        noFeedback: '<p>No feedback was found</p>',
        property: 'feedback',
        exclude: []
    });

    if (!_.isArray(options.exclude)) { throw Error('showFeedback: Exclude must be an array'); }

    var feedback = _(global)
        .filter(function(task,taskName){
            var hasProperty =  _.isPlainObject(task) && !_.isUndefined(task[options.property]);
            var notExcluded = (_.indexOf(options.exclude,taskName) === -1) && (taskName !== 'current');
            return hasProperty && notExcluded;
        })
        .mapValues(function(task){
            return options.pre + task[options.property] + options.post;
        })
        .reduce(function(result, feedback){
            return result + feedback;
        },'') || options.noFeedback;

    return options.wrap ? showPanel(feedback,options.header,options.footer) : feedback;
}
