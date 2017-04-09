define(function(){
    return preload.bind(null, preloadImg);

    /**
     * preloadFn :: (data, cb) => SideEffect
     * images :: [url]
     **/
    function preload(preloadFn, images){
        var current = 0;
        // start four load recursions so that we have max 4 preloaded in parralel
        next();
        next();
        next();
        next();

        function next(){ if (current < images.length) preloadFn(images[current++], next); }
    }

    function preloadImg(url, cb){
        var img = new Image();	// create img object
        img.onload = cb;
        img.onerror = cb;
        img.src = url;
    }
});
