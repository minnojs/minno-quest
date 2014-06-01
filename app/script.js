define([], function(){
	return {
		pages: [],
		questions:[],
		settings: {
			onEnd: function(){
				location.href = location.href;
			}
		},
		sequence: [
			{
				header: 'This Royal Questionnaire of mine.',
				questions: [
					{
						stem: "First question"
					},
					{
						stem: "Second question"
					}
				]
			},
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
	};
});