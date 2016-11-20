define(['questAPI'], function(Quest){
    var API = new Quest();


    API.addPagesSet('basicPage',{
        noSubmit:false,
        decline:true,
        v1style:2,
        progressBar: '<%= pagesMeta.number %> out of 4',
        required: true,
        errorMsg: {required: "Please select an answer or click 'decline to answer.'"}
    });

    API.addSequence([
        {
            inherit:'basicPage',
            questions:[
                {
                    type:'multiGrid',
                    name: 'people1',
                    stem:'Please list the 10 most important people you interact with at least once a week. Please list them by the first letter of their first name and the first letter of their last name. They can be friends, family, co-workers, or anyone who you interact with who impacts your life. This should be someone that you interact with <b>in person</b> on a regular basis. ',
                    rowStemCss: {width:'2%'},
                    required: true,
                    errorMsg: {required: "Please type an answer"},
                    columns: [
                        {
                            type:'input',
                            stemCss :{width:'10%'},
                            pattern: '^[a-z]{3,5}$'
                        }
                    ],

                    rows: ['Person 1',  
                        'Person 2', 
                        'Person 3',  
                        'Person 4',  
                        'Person 5', 
                        'Person 6',  
                        'Person 7',  
                        'Person 8', 
                        'Person 9', 
                        'Person 10' ]
                }
            ]
        },
        { 
            inherit:'basicPage',
            questions: [
                {
                    type: 'multiGrid',
                    name:'people2',
                    required: true,
                    errorMsg: {required: "Please select an answer"},
                    columns: [
                        {
                            stem: 'Relationship to you', 
                            type: 'dropdown', 
                            answers: [{text:'Family',value:1}, 
                                {text:'Friends',value:2},
                                {text:'Romantic Partners',value:3},
                                {text:'Co-workers',value:4},
                                {text:'Other',value:5}] 
                        },

                        {
                            stem: 'Gender', 
                            type: 'dropdown',
                            answers: [{text:'Male',value:1}, {text:'Female',value:2}]

                        },

                        {
                            stem: 'Age',
                            type:'input'
                        },

                        {
                            stem: 'What is his/her alcohol consumption like?', 
                            type: 'dropdown',
                            answers: [{text:'Doesn\'t drink alcohol at all',value:1},
                                {text:'Light drinker',value:2},
                                {text:'Moderate drinker',value:3},
                                {text:'Heavy drinker',value:4}]

                        },
                        {
                            stem: 'Have you consumed alcohol with them?', 
                            type:'dropdown',
                            answers:[
                                {text:'Yes', value:1},
                                {text:'No',value:2}]

                        }
                    ],
                    rows: [ 
                        '<%=current.questions.people1001.response%>', 
                        '<%=current.questions.people1002.response%>', 
                        '<%=current.questions.people1003.response%>', 
                        '<%=current.questions.people1004.response%>', 
                        '<%=current.questions.people1005.response%>', 
                        '<%=current.questions.people1006.response%>', 
                        '<%=current.questions.people1007.response%>', 
                        '<%=current.questions.people1008.response%>', 
                        '<%=current.questions.people1009.response%>', 
                        '<%=current.questions.people1010.response%>'
                    ]
                }
            ]
        }, 

        {
            inherit:'basicPage',
            questions:[
                {
                    type:'grid',
                    cellLabels:true,
                    stem:'Please indicate how close you are to the individuals you have listed:',
                    rowStemHide: false,
                    checkboxType : 'colorMark',
                    required : true,
                    errorMsg: {
                        required: "Please select an answer."
                    },
                    name:'closeness',
                    columnStemHide:true,
                    maxWidth:420,
                    columns: [
                        {type:'text', textProperty:'left', css : {width:'13.5%'}},
                        {stem:'1 <br/>Not at all close', value:1, css : {width:'7%'}},
                        {stem:'2', value: 2, css : {width:'7%'}},
                        {stem:'3', value: 3, css : {width:'7%'}},
                        {stem:'4 <br/>Somewhat close', value: 4, css : {width:'7%'}},
                        {stem:'5', value: 5, css : {width:'7%'}},
                        {stem:'6', value: 6, css : {width:'7%'}},
                        {stem:'7 <br/>Very close', value: 7, css : {width:'7%'}},
                        {type:'text', textProperty:'right', css : {width:'13.5%'}}
                    ],
                    rows: [
                        {left:'<%=current.questions.people1001.response%>', name:'person1_close'},
                        {left:'<%=current.questions.people1002.response%>', name:'person2_close'},
                        {left:'<%=current.questions.people1003.response%>', name:'person3_close'},
                        {left:'<%=current.questions.people1004.response%>', name:'person4_close'},
                        {left:'<%=current.questions.people1005.response%>', name:'person5_close'},
                        {left:'<%=current.questions.people1006.response%>', name:'person6_close'},
                        {left:'<%=current.questions.people1007.response%>', name:'person7_close'},
                        {left:'<%=current.questions.people1008.response%>', name:'person8_close'},
                        {left:'<%=current.questions.people1009.response%>', name:'person9_close'},
                        {left:'<%=current.questions.people1010.response%>', name:'person10_close'}


                    ]}
            ]
        },

        {
            inherit:'basicPage',

            questions: [
                {
                    type: 'multiGrid',
                    stem: 'Using the following scale please indicate whether each of the individuals you listed knows the other listed people:',
                    name:'peopleknow',
                    required: false,
                    errorMsg: {required: "Please select an answer"},
                    columns: knowsColumns(10),
                    rows: knowsRows(10)
                }
            ]
        }
    ]);

    return API.script;

    function knowsColumns(length){
        var columns = [];
        for (var i=1; i < length; i++) columns.push('<%=current.questions.people10' + ('00' + (i+1)).slice(-3) + '.response%>');
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











