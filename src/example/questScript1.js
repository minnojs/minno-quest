define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { 
            questions: [
                {
                    type: 'multiGrid',
                    required: true,
                    name:'people',
                    columns: [
                        {stem: 'Relationship to you', type: 'dropdown', answers: ['Friend', 'Enemy']},
                        {stem: 'Gender', type: 'dropdown', answers: ['Male', 'Female']},
                        {stem: 'Age', type:'input'},
                        {stem: 'What is his/her alcohol consumption like?', type: 'dropdown', answers: ['Normal', 'Abnormal']},
                        {stem: 'Have you consumed alcohol with them?', type:'checkbox'}
                    ],
                    rows: ['Person 1', 'Person 2']
                }
            ]
        }, 
        { 
            questions: [
                {
                    type: 'multiGrid',
                    stem: 'Please mark any two people who know each other:',
                    name:'peopleknow',
                    columns: knowsColumns(7),
                    rows: knowsRows(7)
                }
            ]
        }
    ]);

    return API.script;

    function knowsColumns(length){
        var columns = [];
        for (var i=1; i < length; i++) columns.push('Person ' + (i+1));
        return columns;
    }

    function knowsRows(length){
        var rows = [];
        var row;
        // build rows array
        for (var i=1; i < length; i++){
            row = {stem: 'Person ' + i, overwrite: []};
            // build overwrite array
            for (var j=1; j<i; j++) row.overwrite.push({type:'text'});
            rows.push(row);
        }

        return rows;
    }
});
