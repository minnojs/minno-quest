define(['questAPI'], function(Quest){

	var API = new Quest();

	//API.addSettings('DEBUG', {level: 'error'});

	API.addSettings('onEnd', function(){
		console.log('onEnd script1');
		//location.href = location.href;
	});
	API.addSettings('skin', 'demo');
	API.addSettings('timers', {
		duration: 1,
		message: {
			header: 'Time out!',
			body: 'You will now be redirected to the next task.'
		}
	});

	API.addQuestionsSet('basicSelect',{
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});

	API.addSequence([
	        { // page begins
	            header: 'Grid questions simple',
	            autoFocus:true,
	            decline: true,
	            v1style: 2,
	            questions: [
						{
							stem: 'how are you?',
							name: 'secondary',
							type: 'dropdown',
							dflt:'good',
							answers: ['good','bad','ugly'],
							errorMsg: {correct:"That may not be correct... say good!"}
						},

	                {
	                    type: 'grid',
                        name:'gonzales',
	                    stem: 'What sort of things do you like?',
	                    columns: ['Strongly agree' , 'agree' , 'don\'t know' , 'disagree' , {stem:'Strongly disagree', type:'input'}],
	                    rows: ['I like grids', 'I like bannanas too'],
	                    rowStemCss: {width:'280px'}
	                },
	            	{
	            		type:'text',
	            		stem: 'iso'
	            	},

	            ]
	        }, // page ends
{
            questions: [
                {
                    type: 'rank',
                    stem: 'rank quest',
                    name: 'mart',
                    correct: false,
                    correctValue: [1,3,2,4],
                    randomize: false,
                    list: ['ark', 'snark', 'dog', 'cat']
                }
            ]
        },
        {
            questions: [
                {
                    type: 'rank',
                    stem: 'rank quest',
                    name: 'mart',
                    correct: false,
                    correctValue: [1,3,2,4],
                    noRandomize: true,
                    list: ['ark', 'snark', 'dog', 'cat']
                }
            ]
        },
{
    remix: true,
    mixer:'branch',
    conditions:{or:[{compare: 1, to: 'current.questions.b1_teacher.response',DEBUG:true}]},
        data:[  { // page begins
            header: 'Hello world!',
            decline: true,
            declineText: 'I prefer to keep this information to myself',
            questions: [
                { // question begins
                    type: 'selectOne',
                    name: 'test',
                    stem: 'When you say good morning, what do you mean?',
                    answers: [
                        'Do you wish me a good morning',
                        'Or mean that it is a good morning whether I want it or not',
                        'Or that you feel good this morning',
                        'Or that it is a morning to be good on',
                        'All of them at once'
                    ]
                } // question ends
            ]
        }]
},
			{
				header: 'Header',
				autoFocus:true,
				decline:true,
				v1style: 2,
				questions: 		{
					stem: 'myStem <%= pagesMeta.number %>',
					type:'selectOne',
					label:'label',
					autoSubmit: true,
					answers : [1,2,3,4,5]
				}
			},



		{
			//animate:"fade drop-in fakeAnimation",
			prevText: '123',
            v1style: 2,
			prev:true,
			progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
			header: 'Questionnaire: example for realtime branching',
			//timer: {duration:1.5, show:true, submitOnEnd:true,removeOnEnd:true, message:'doooooo'},
			questions: [
				{
					name: 'myName',
					stem: "What is your name? (try yba!)",
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
							errorMsg: {correct:"That may not be correct... say good!"}
						}
					]
				}
			]
		},

		// {
		// 	prevText: '123',
		// 	prev:true,
		// 	progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
		// 	header: '<%= pagesData.pageName %>: Questionnaire page num. <%= 1 + 1 %>',
		// 	decline:"Cutsom decline text",
		// 	noSubmit: 0,
		// 	submitText: "Custom submit text",
		// 	data: {pageName:'page name from data'},
		// 	numbered: true,
		// 	numberStart: 4,
		// 	questions: [
		// 		{
		// 			name:'baat',
		// 			type: 'selectMulti',
		// 			stem: "Multi question",
		// 			dflt: [1,2],
		// 			numericValues: true,
		// 			answers: [
		// 				'plateu',
		// 				'reverie',
		// 				'syndrom',
		// 				'polyAdept'
		// 			],
		// 			required: true,
		// 			correct:true,
		// 			correctValue: [2,4],
		// 			errorMsg: {correct:"answer is reverie polyAdept"}
		// 		},
		// 		{
		// 			name: 'myName',
		// 			stem: "What is your name? (try yba!)",
		// 			autoSubmit: true
		// 		},
		// 		{
		// 			stem: 'how are you?',
		// 			type: 'selectOne',
		// 			autoSubmit: true,
		// 			dflt:'good',
		// 			buttons: true,
		// 			answers: ['good','bad','ugly'],
		// 			correct:true,
		// 			correctValue: 'good',
		// 			errorMsg: {correct:"That may not be correct... say good!"}
		// 		}

		// 	]
		// },
		// {
		// 	mixer: 'branch',
		// 	remix:true,
		// 	conditions: [{compare: 'questions.myName.response', to:'yba', DEBUG:false}],
		// 	data: [{
		// 		progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
		// 		header: 'Hi <%= questions.myName.response %>',
		// 		questions: [
		// 			{
		// 				data: {myDflt:'this is a secret page...'},
		// 				stem: 'This question can only be reached if you type yba for the previous question',
		// 				dflt: '<%= questionsData.myDflt %>'
		// 			}
		// 		]
		// 	}]
		// },
		// {
		// 	mixer: 'repeat',
		// 	times: 2,
		// 	data: [
		// 		{
		// 						prevText: '123',
		// 	prev:true,

		// 			progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
		// 			regenerateTemplate:true,
		// 			header: 'This Royal Questionnaire of mine.',
		// 			timeoutMessage: 'My message',
		// 			decline:true,
		// 			numbered: true,
		// 			numberStart: 4,
		// 			questions: [
		// 				{
		// 					mixer: 'random',
		// 					data: [
		// 						{
		// 							stem: "First question",
		// 							required: true
		// 						},
		// 						{
		// 							stem: "Second question"
		// 						}
		// 					]
		// 				}
		// 			]
		// 		}
		// 	]
		// },
		// {
		// 	progressBar: '<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>',
		// 	questions: [
		// 		{
		// 			stem: 'how are you?',
		// 			type: 'selectOne',
		// 			dflt:2,
		// 			buttons: true,
		// 			answers: ['good','bad','ugly']
		// 		},
		// 		{
		// 			stem: 'how are you?',
		// 			type: 'selectOne',
		// 			answers: ['good','bad','ugly']
		// 		}
		// 	]
		// },
		// {
		// 	mixer: 'wrapper',
		// 	data: [
		// 		{
		// 			header: 'This Royal Questionnaire of mine.',
		// 			questions: [
		// 				{
		// 					stem: "Third question"
		// 				},
		// 				{
		// 					stem: "Fourth question"
		// 				}
		// 			]
		// 		}
		// 	]
		// }

	]);

	return API.script;
});
