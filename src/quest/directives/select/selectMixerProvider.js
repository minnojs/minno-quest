import _ from 'lodash';

selectMixerProvider.$inject = ['questShuffle', 'mixerRecursive'];
function selectMixerProvider(shuffle, mixer){

    function selectMixer(answersArr, options){
        var answers = mixer(answersArr);

        // inject values
        answers = _.map(answers, function(answer, index){

            if (!_.isPlainObject(answer)){
                answer = {text:answer};
            }

            if (_.isUndefined(answer.value)){
                answer.value = options.numericValues ? index + 1 : answer.text;
            }
            return answer;
        });

        if (options.reverse){
            answers = _(answers).reverse().value();
        }

        if (options.randomize){
            answers = shuffle(answers);
        }

        _.each(answers, function(answer,index){
            answer.order = index;
        });

        return answers;
    }

    return selectMixer;
}

export default selectMixerProvider;
