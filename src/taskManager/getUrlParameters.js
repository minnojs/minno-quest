export default function getParameters() {
    var result = {}; 
    var url = window.location.search;
    if (!url) return result;
    url = url.substr(1);
    url
        .split('&')
        .map(function(str){ return str.split('='); })
        .forEach(function(pair){ 
            result[pair[0]] = decodeURIComponent(pair[1]); 
        });

    return result;
}
