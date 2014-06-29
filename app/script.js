define([], function(){
	return {
		pages: [],

		questions:[],

		settings: {
			logger: {
				pulse: 3,
				url: 'mine/sps'
				//DEBUG:true
			},
			onEnd: function(){
				location.href = location.href;
			}
		},

		sequence: [
			{
				header: 'Questionnaire page num. 1',
				decline:true,
				numbered: true,
				numberStart: 4,
				questions: [
					{
						type: 'selectMulti',
						stem: "Multi question",
						dflt: [1,2],
						numericValues: true,
						answers: [
							'plateu',
							'reverie',
							'syndrom',
							'polyAdept'
						]
					},
					{
						name: 'myName',
						stem: "What is your name?"
					}
				]
			},
			{
				mixer: 'branch',
				conditions: [{compare: 'questions.myName.response', to:'yba', DEBUG:true}],
				data: [{
					header: 'Hi <%= questions.myName.response %>',
					questions: [
						{
							stem: 'This question can only be reached if you type yba for the previous question'
						}
					]
				}]
			},
			{
				mixer: 'repeat',
				times: 2,
				data: [
					{
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

				questions: [
					{
						stem: 'how are you?',
						name: 'select example',
						type: 'selectOne',
						dflt:1,
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


		]
	};
});