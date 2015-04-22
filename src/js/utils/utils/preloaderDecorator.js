define(function(require){
	var _ = require('underscore');

	preloaderDecorator.$inject = ['$delegate'];
	function preloaderDecorator(preloader){
		preloader.register('image', imageLoader);
		return preloader;
	}

	function imageLoader(url){
		var def = this.$q.defer();
		var img = new Image();	// create img object
		img.onload = _.bind(def.resolve, def, img);
		img.onerror = _.bind(def.reject, def, img);
		img.src = url;
		return def.promise;
	}

	return preloaderDecorator;
});