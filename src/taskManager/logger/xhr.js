/**
 * @param options.url url
 * @param options.method method
 * @param options.body body
 **/
export default function xhr(options){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open(options.method || 'POST',options.url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        request.onreadystatechange = function() {

            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 400) resolve(request.responseText);
                else reject(new Error('Failed sending to: "' + options.url + '". ' + request.statusText + ' (' + request.status +')'));
            }
        };

        request.send(options.body);
    });
}
