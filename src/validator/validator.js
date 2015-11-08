/* jshint esnext:true */
define(function (){

	function multiPick(arr, propArr){
		return arr
			.map(e=> e && [].concat(e[propArr[0]], e[propArr[1]], e[propArr[2]])) // gather all stim arrays
			.reduce((previous, current)=>previous.concat(current),[]) // flatten arrays
			.filter(t=>t); // remove all undefined stim
	}

	function flattenSequence(sequence){
		function unMix(e){
			return flattenSequence([].concat(e.data, e.elseData, (e.branches || []).map(e=>e.data)));
		}

		return sequence
			.reduce((previous, current) => {return previous.concat(current && current.mixer ? unMix(current) : current);},[])
			.filter(t=>t); // remove all undefined stim;
	}


	function pipElements(script){
		var trials, stimuli, media;

		trials = [].concat(flattenSequence(script.sequence), script.trialSets).filter(t=>t);
		stimuli = [].concat(
			script.stimulusSets,
			multiPick(trials,['stimuli', 'layout'])
		).filter(t=>t);
		media = [].concat(
			script.mediaSets,
			multiPick(stimuli,['media','touchMedia'])
		).filter(t=>t);

		return {trials:trials, stimuli:stimuli, media:media};
	}

	function questElements(script){
		var pages, questions;

		pages = [].concat(
			flattenSequence(script.sequence),
			script.pagesSets
		).filter(t=>t);

		questions = [].concat(
			script.questionsSets,
			flattenSequence(multiPick(pages,['questions']))
		).filter(t=>t);

		return {pages:pages, questions:questions};
	}

	function managerElements(script){
		var tasks;

		tasks = [].concat(
			flattenSequence(script.sequence),
			script.pagesSets
		).filter(t=>t);

		return {tasks:tasks};
	}

	return {
		flattenSequence: flattenSequence
	};
});