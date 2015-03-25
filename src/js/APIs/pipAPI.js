define(function(require){
	var factory = require('APIs/APIConstructor');

	var api = factory({
		type: 'PIP',
		sets: ['trial', 'stimulus','media']
	});

	api.prototype.addTrialSets = api.prototype.addTrialSet;
	api.prototype.addStimulusSets = api.prototype.addStimulusSet;
	api.prototype.addMediaSets = api.prototype.addMediaSet;

	return api;
});