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
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) resolve(this.responseText);
                else reject(new Error('Failed posting to: ' + options.url));
            }
        };

        request.send(options.body);
    });
}
