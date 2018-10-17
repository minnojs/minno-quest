define(['questAPI'], function(Quest){
	var API = new Quest();


	// ### Sequence
	API.addSequence(
	[
		{
			decline:false,
			numbered: false,
			questions :
			{
				type:'selectOne',
				stem:'Select a questionnaire',
				name:'selectq',
				autoSubmit:true,
				answers : [
					{
						text: 'Basic scale with agreement items',
						value : 'basicScale'
					},
					{
						text: 'Rate images',
						value : 'rateimages'
					},
					{
						text: 'Rate images (and set their height)',
						value : 'rateimagessizes'
					},
					{
						text: 'Show horizontal scale',
						value : 'buttons'
					},
					{
						text: 'Show horizontal scale (advanced code)',
						value : 'buttonsadvanced'
					},
					{
						text: 'Show horizontal scale (all questions in one page)',
						value : 'buttonsonepage'
					},
					{
						text: 'Use slider',
						value : 'slider'
					},
					{
						text: 'Use grid',
						value : 'grid'
					},
					{
						text: "Use participant's response in another question",
						value : 'userprevresp'
					},
					{
						text: "Select a question according to the participant's response",
						value : 'dependency'
					},
					{
						text: "Open ended question (short responses)",
						value : 'openended'
					},
					{
						text: "Open ended question (long responses)",
						value : 'openendedlong'
					}
				]
			}
		}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
