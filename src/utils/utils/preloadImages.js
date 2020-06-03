import _ from 'lodash';
export default preload;

// this is important so that when we preload many images (>200) they stay chached.
// Weird. I know.
var cache = [];

/**
 * images :: [url]
 **/
function preload(images){
    images = _.uniq(images);

    var current = 0;
    // start four load recursions so that we have max 4 preloaded in parralel
    next();
    next();
    next();
    next();

    function next(){ if (current < images.length) preloadImg(images[current++], next); }
    function preloadImg(url, cb){
        var img = new Image();	// create img object
        cache.push(img);
        img.onload = cb;
        img.onerror = cb;
        img.src = url;
    }
}

