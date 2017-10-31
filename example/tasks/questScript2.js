define(['questAPI'], function(Quest){

    var API = new Quest();

    API.addSettings('DEBUG', {
        tags: []
		//hideConsole: true, // default false : whether to display console
		//level: 'none' // ERROR > WARN > INFO > DEBUG || [E, W...] || warningsOnly: Error && WARNING

    });

    API.addSettings('logger', {
        pulse: 2,
        url: '/implicit/PiQuest'
    });

    API.addSettings('onEnd', function(){
        console.log('onEnd script2');
    });

    API.addSequence([
        {
            prevText: '123',
            prev:true,
            progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
            header: 'Yoo hoo we are on!!!!!!!',

            questions: [
                {
                    name: 'myName',
                    stem: 'What is your name? (try yba!)',
                    autoSubmit: true
                },
                {
                    mixer:'branch',
                    remix:true,
                    conditions:[{compare: 'questions.myName.response',to:'yba', DEBUG:false}],
                    data:[
                        {
                            stem: 'how are you?',
                            name: 'secondary',
                            type: 'dropdown',
                            autoSubmit: true,
                            dflt:'good',
                            answers: ['good','bad','ugly'],
                            errorMsg: {correct:'That may not be correct... say good!'}
                        }
                    ]
                }
            ]
        },
/*
		{
			prevText: '123',
			prev:true,
			progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
			header: '<%= pagesData.pageName %>: Questionnaire page num. <%= 1 + 1 %>',
			decline:"Cutsom decline text",
			noSubmit: 0,
			submitText: "Custom submit text",
			data: {pageName:'page name from data'},
			numbered: true,
			numberStart: 4,
			questions: [
				{
					name:'baat',
					type: 'selectMulti',
					stem: "Multi question",
					dflt: [1,2],
					numericValues: true,
					answers: [
						'plateu',
						'reverie',
						'syndrom',
						'polyAdept'
					],
					required: true,
					correct:true,
					correctValue: [2,4],
					errorMsg: {correct:"answer is reverie polyAdept"}
				},
				{
					name: 'myName',
					stem: "What is your name? (try yba!)",
					autoSubmit: true
				},
				{
					stem: 'how are you?',
					type: 'selectOne',
					autoSubmit: true,
					dflt:'good',
					buttons: true,
					answers: ['good','bad','ugly'],
					correct:true,
					correctValue: 'good',
					errorMsg: {correct:"That may not be correct... say good!"}
				}

			]
		},
		{
			mixer: 'branch',
			remix:true,
			conditions: [{compare: 'questions.myName.response', to:'yba', DEBUG:false}],
			data: [{
				progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
				header: 'Hi <%= questions.myName.response %>',
				questions: [
					{
						data: {myDflt:'this is a secret page...'},
						stem: 'This question can only be reached if you type yba for the previous question',
						dflt: '<%= questionsData.myDflt %>'
					}
				]
			}]
		},
		{
			mixer: 'repeat',
			times: 2,
			data: [
				{
								prevText: '123',
			prev:true,

					progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
					regenerateTemplate:true,
					header: 'This Royal Questionnaire of mine.',
					timeoutMessage: 'My message',
					decline:true,
					numbered: true,
					numberStart: 4,
					questions: [
						{
							mixer: 'random',
							data: [
								{
									stem: "First question",
									required: true
								},
								{
									stem: "Second question"
								}
							]
						}
					]
				}
			]
		},
		{
			progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
			questions: [
				{
					stem: 'how are you?',
					type: 'selectOne',
					dflt:2,
					buttons: true,
					answers: ['good','bad','ugly']
				},
				{
					stem: 'how are you?',
					type: 'selectOne',
					answers: ['good','bad','ugly']
				}
			]
		},
		{
			mixer: 'wrapper',
			data: [
				{
					header: 'This Royal Questionnaire of mine.',
					questions: [
						{
							stem: "Third question"
						},
						{
							stem: "Fourth question"
						}
					]
				}
			]
		}
*/
    ]);

    return API.script;
});