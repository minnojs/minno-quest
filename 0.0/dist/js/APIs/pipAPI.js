define(["require","APIs/APIConstructor"],function(e){var t=e("APIs/APIConstructor"),n=t({type:"PIP",sets:["trial","stimulus","media"]});return n.prototype.addTrialSets=n.prototype.addTrialSet,n.prototype.addStimulusSets=n.prototype.addStimulusSet,n.prototype.addMediaSets=n.prototype.addMediaSet,n});