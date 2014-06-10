define([], function(){
	return {
		pages: [],
		questions:[],
		settings: {
			logger: {
				pulse: 3,
				url: 'mine/sps',
				DEBUG:true
			},
			onEnd: function(){
				location.href = location.href;
			}
		},
		sequence: [
			{
				mixer: 'repeat',
				times: 2,
				data: [
					{
						header: 'This Royal Questionnaire of mine.',
						timeoutMessage: 'My message',
						decline:true,
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