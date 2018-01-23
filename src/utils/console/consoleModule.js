import angular from 'angular';
import _ from 'lodash';
import stream from 'mithril-stream';
import template from './console.html';

export default module;

var module = angular.module('piConsole',[]);

module.factory('piConsole', piConsoleFactory);

piConsoleFactory.$inject = ['$log'];
function piConsoleFactory($log){
    var piConsole = stream();
    piConsole.map(function(log){ $log[log.type](log.message); });
    piConsole.map(filterLogs).map(displayLogs());
    return window.DEBUG ? piConsole : _.noop;

    function filterLogs(log){
        var level = _.get(piConsole, 'settings.level', 'error');

        if (level === 'error' && log.type === 'error') return log;
        if (level === 'verbose') return log;
        if (level === 'none') return stream.HALT;
        
        return {type:'error', error: new Error('Unknown log level: ' + level), message: 'Error in debug settings'};
    }

    function displayLogs(){
        var panelClasses = {error:'panel-danger', warn:'panel-warning', info:'panel-info', debug:'panel-success',log:'panel-success'};
        var container = document.querySelector('[pi-console]');
        var compiledTemplate = _.template(template);

        if (!container) return _.noop;

        container.addEventListener('click',function(e){
            if (e.target === container) container.classList.toggle('noshow');
            if (e.target.classList.contains('close')) container.removeChild(e.target.parentNode.parentNode);
            hideRow(e.target);
        });

        return createLog;

        // hide row when heading is clicked 
        function hideRow(target){
            if (target == container) return false;
            if (target.classList.contains('panel-heading')) return target.parentNode.classList.toggle('noshow');
            hideRow(target.parentNode);
        }

        function createLog(log){
            var el = document.createElement('div');
            el.classList.add('panel');
            el.classList.add('noshow');
            el.classList.add(panelClasses[log.type]);
            el.innerHTML = compiledTemplate({log:log, syntaxHighlight:syntaxHighlight});
            container.insertBefore(el, container.firstChild || null);
        }
    }
}


function syntaxHighlight(json) {    
    var _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red';
        
    json = JSON.stringify(json, null, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var style = _number;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                style = _key;
            } else {
                style = _string;
            }
        } 
        else if (/true|false/.test(match)) style = _boolean;
        else if (/null/.test(match)) style = _null;
        return '<span style="' + style + '">' + match + '</span>';
    });
}
