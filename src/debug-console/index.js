import m from 'mithril';
import stream from 'mithril-stream';
import './console.css';

var root = document.createElement('div');
document.body.appendChild(root);

var levelMap = {error:1,warn:2,info:3,debug:4,log:5};
var panelClasses = {1:'panel-danger', 2:'panel-warning', 3:'panel-info', 4:'panel-success',5:'panel-success'};
var labelClasses = {1:'label-danger', 2:'label-warning', 3:'label-info', 4:'label-success',5:'label-success'};
var SHOW_STORAGE_KEY = 'minno-console-show';
var LEVEL_STORAGE_KEY = 'minno-console-level';

// init local storage
if (!localStorage.getItem(LEVEL_STORAGE_KEY)) {
    localStorage.setItem(LEVEL_STORAGE_KEY, 1);
    localStorage.setItem(SHOW_STORAGE_KEY, true);
}

var Console = {
    oninit: function(vnode){
        var state = vnode.state;
        var $messages = stream();
        var unseen = state.unseen = [];

        state.$show = stream(localStorage.getItem(SHOW_STORAGE_KEY) === 'true');
        state.$level = stream(localStorage.getItem(LEVEL_STORAGE_KEY));

        // update local storage
        state.$show.map(updateStorage(SHOW_STORAGE_KEY)); 
        state.$level.map(updateStorage(LEVEL_STORAGE_KEY)); 

        state.$logs = stream.scan(function(acc,val){ acc.push(val); return acc;}, [], $messages);
        state.$unseenLogs = stream.combine(function(show, messages, changed){
            if (changed.indexOf(messages)>-1) unseen.push(messages());
            if (show()) unseen.length = 0;
            return unseen;
        }, [state.$show, $messages]);

        window.addEventListener('message', function receiveMessage(event){
            if (event.data.type === 'kill-console') m.mount(root, null);
            $messages(event.data);
            m.redraw();
        },false);

        function updateStorage(key){
            return function(val){ localStorage.setItem(key,val); };
        }
    },
    view: function(vnode){
        var state = vnode.state;
        var show = state.$show();
        var level = state.$level();

        return m('.minno-console', {class: show ? '' : 'minno-console-hide'}, [
            m('.input-group', [
                m('span.input-group-addon', [
                    'Console',
                    unseenCounter()
                ]),
                state.$show() && m('select.form-control', {title: 'Select log level',onchange:m.withAttr('value', state.$level), value:state.level}, [
                    m('option', {value:1, selected:level==1}, 'Error'),
                    m('option', {value:9, selected:level==9}, 'All')
                ]),        
                m('span.input-group-btn',[
                    m('button.btn.btn-default',{
                        title: show ? 'Hide console' : 'Show console',
                        onclick: toggleShow
                    }, m('strong', show ? '<<' : '>>'))
                ])
            ]),
            show && m(Scroller, {className:'.minno-console-logs'}, state.$logs().filter(levelFilter).map(function(r){ return m(consoleRow, r); }))
        ]);

        function toggleShow(){ state.$show(!show); }
        function levelFilter(log){ return level >= (levelMap[log.type] || 5);}
        function unseenCounter(){
            var unseenLength = state.unseen.filter(levelFilter).length;
            var maxLevel = state.unseen.reduce(function(acc,log){ return Math.min(levelMap[log.type] || 5, acc); }, 5);
            return !!unseenLength && m('span.label',{class:labelClasses[maxLevel], style:'margin-left:5px;'}, unseenLength);
        }
    }
};


var consoleRow = {
    hide:false,
    open:false,
    view: function(vnode){
        var row = vnode.attrs;
        var state = vnode.state;
        return !state.hide && m('.panel', {class: panelClasses[levelMap[row.type] || 5] }, [
            m('.panel-heading', [
                m('strong', row.message),
                row.error ? ' ' + row.error.message : '',

                m('button', {class:'close', style:'margin-left:5px;', onclick:toggle(state,'hide')}, m.trust('&times;')),
                (row.context || row.rows) && m('button', {
                    class:'close', 
                    onclick: toggle(state,'open')
                }, m.trust(state.open ? '&minus;' : '&plus;'))
            ]),

            state.open && [
                row.context && m('.panel-body', [
                    m('strong', 'Context:'),
                    m('pre', syntaxHighlight(row.context))
                ]),

                row.rows && m('list-group', row.rows
                    .map(function(r){return [].concat(r);}) // ensure each row is an array
                    .map(function(r){
                        return m('.list-group-item', r
                            .map(syntaxHighlight)
                            .map(function(v){return m('span', {style:'margin-right:7px;'},v);})
                        );
                    })
                )
            ]
        ]);
    }
};

function toggle(state, prop){
    return function(){state[prop]=!state[prop];};
}

function syntaxHighlight(json) {    
    var _string = 'color:green',
        _number = 'color:darkorange',
            _boolean = 'color:blue',
                _null = 'color:magenta',
                    _key = 'color:red';

                    json = JSON.stringify(json, null, 2);
                    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return m.trust(json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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
                    }));
}

var Scroller = {
    oncreate: function(vnode){
        var container = vnode.dom;
        container.scrollTop = container.scrollHeight;
    },
    onbeforeupdate:function(vnode, old){
        var container = old.dom;
        vnode.state.isScrolledDown = (container.scrollTop + container.clientHeight === container.scrollHeight);
    },
    onupdate: function(vnode){
        var container = vnode.dom;
        if (vnode.state.isScrolledDown) container.scrollTop = container.scrollHeight;
    },
    view: function(vnode){
        return m(vnode.attrs.className || 'div', vnode.children);
    }
};

m.mount(root, Console);
