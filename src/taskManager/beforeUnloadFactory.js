import _ from 'lodash';

var addEvent = window.attachEvent || window.addEventListener;
var removeEvent = window.detachEvent || window.removeEventListener;
var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

var proto = {
    activate: function(){
        addEvent(chkevent, leaveEvent);
    },
    deactivate: function(){
        removeEvent(chkevent, leaveEvent);
    }
};

function leaveEvent(e) { // For >=IE7, Chrome, Firefox
    var confirmationMessage = 'Are you sure you want to leave this page? You may have some unsaved data here.';  // a space
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
}

export default function beforeunloadFactory(){
    return _.create(proto);
}
