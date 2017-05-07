define(function(require){
    var factory = require('./APIConstructor');

    var api = factory({
        type: 'PIP',
        sets: ['trial', 'stimulus','media']
    });

    api.prototype.addTrialSets = api.prototype.addTrialSet;
    api.prototype.addStimulusSets = api.prototype.addStimulusSet;
    api.prototype.addMediaSets = api.prototype.addMediaSet;

    api.prototype.getLogs = function getLogs(){
        return this.script.current.logs;
    };

    return api;
});