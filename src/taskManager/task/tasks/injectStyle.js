export default activateInjectCss;

activateInjectCss.$inject = ['done', 'task'];
function activateInjectCss(done, task){
    injectStyle(task.css);
    done();
}

// VanilaJS
// http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
export function injectStyle(css){
    var head = document.head || document.querySelector('head');
    var style = document.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    return function(){
        head.removeChild(style);
    };
}

