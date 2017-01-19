define(['questAPI'], function(Quest){

	var API = new Quest();

	API.addSequence([
		{
			header: 'Hello World',
			questions: [
				{
					type: 'selectOne',
					stem: 'What is you favorite color?',
					answers: ['red', 'blue', 'green']
				}
			]
		}
	]);

	return API.script;
});
