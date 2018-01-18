define(['questAPI'], function(Quest){
    var API = new Quest();
    API.addSettings('logger', {url:null});
    API.addSequence([
        {
            progressBar: '<%= pagesMeta.number %> out of 10',
            questions : {
                type: 'selectOne',
                style:'multiButtons',
                errorMsg: {
                    required: 'Please select an answer, or click \'decline to answer\''
                },
                name:'item1',
                stem : 'On the whole, I am satisfied with myself.',
                answers : ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']
            }
        }
    ]);
    return API.script;
});
