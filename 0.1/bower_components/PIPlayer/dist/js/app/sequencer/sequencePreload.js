/*
 * gets all media that needs preloading and preloads it
 */
define(['underscore','utils/preloader','app/task/build_url'],function(_,preload,build_url){

	var loadMedia = function(media){
		// if this is an image, preload it
		if (!_.isUndefined(media.image)) {
			preload.add(build_url(media.image, 'image'),'image');
		}
		if (!_.isUndefined(media.template)) {
			preload.add(build_url(media.template,'template'),'template');
		}
	};

	var loadStimulus = function(stimulus) {
		if (stimulus.media) {
			loadMedia(stimulus.media);
		}
	};

	var loadInput = function(input){
		if (input.element) {
			loadMedia(input.element);
		}
	};

	var loadTrial = function(trial){
		_.each(trial.layout || [], loadStimulus);
		_.each(trial.stimuli || [], loadStimulus);
		_.each(trial.input || [], loadInput);
	};

	// load trials in sequence (essentialy, recursively pick out the trials out of the mixer)
	var loadSequence = function(sequence){
		_.each(sequence,function(element){
			if (!_.isUndefined(element.mixer)) {
				loadSequence(element.data);
			} else {
				loadTrial(element);
			}
		});
	};

	var loadScript = function(script){
		// load media sets
		_.each(script.mediaSets || [], function(set){
			_.each(set,loadMedia);
		});

		// load stimsets
		_.each(script.stimulusSets || [], function(set){
			_.each(set,loadStimulus);
		});

		// load trialsets
		_.each(script.trialSets || [], function(set){
			_.each(set,loadTrial);
		});

		loadSequence(script.sequence);
	}; // load script

	// accepts a piece of script and a type
	// @param script: a piece of script
	// @param type: what sort of object this is (media/stimulus/trial)
	// @param reset: should we reset the preloader before activating it (use if for some reason we lost the cache...)
	// @returns a deferred object
	return function(script, type, reset){
		if (reset) {
			preload.reset();
		}

		switch (type){
			case 'media'	: loadMedia(script); break;
			case 'stimulus'	: loadStimulus(script); break;
			case 'trial'	: loadTrial(script); break;
			case 'script'	:
				/* falls through */
			default:
				loadScript(script); break;
		}
		return preload.activate();
	};
});