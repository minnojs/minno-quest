import factory from './APIConstructor';
export default api;

var api = factory({
    type: 'minno-time',
    settings: {
        logger:{pulse:20}
    },
    sets: ['trial', 'stimulus','media']
});

api.prototype.addTrialSets = api.prototype.addTrialSet;
api.prototype.addStimulusSets = api.prototype.addStimulusSet;
api.prototype.addMediaSets = api.prototype.addMediaSet;

api.prototype.getLogs = function getLogs(){
    return this.script.current.logs;
};
