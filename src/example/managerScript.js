define(['managerAPI'], function(Manager){
	var API = new Manager();
	API.addSettings('skin', '');
    //var images = Array(30).fill('http://placehold.it/120x120&text=image').map((v,i)=>v+i);
	//API.addSettings('preloadImages', images);

    API.addSettings('injectStyle', [
        '[pi-player] {position:fixed;left:0; right:0;}',
        '[pi-player] #canvas { margin-top: auto;}',
    ].join(''));

	API.addGlobal({
        $mTurk:{assignmentId:0,hitId:0,workerId:0},
        audit: {questions: {a:{response:'5'}, b:{response:undefined}, c:{response:3}}},
        demographics: {questions: {demo02:{response:'23'}, b:{response:undefined}, c:{response:345}}}
    });

	API.addTasksSet('instructions', {type:'message', keys:' '});

	API.addTasksSet('quests', [
		{
			type:'quest',
			name: 'first',
			scriptUrl: 'questScript1.js'
		},
		{
			type:'quest',
			name:'second',
			scriptUrl: 'questScript2.js'
		}
	]);

	API.addSettings('onEnd', function(){console.log('onEnd');});
	API.addSettings('skip', true);

	API.addSequence([
		{
			script:function(done, managerBeforeUnload, global){
				managerBeforeUnload.deactivate();
				done();
                global.current = global.iat =  {feedback:'bam!'};
            }
		},
        { type: 'quest', name: 'dotWidth', scriptUrl: '/test/timeSlider.js' },
        { type: 'message', template: 'yarkdasdf'},
        //{ type: 'postCsv', url: 'csv.php' }, 
        {
			type: 'pip',
			name: 'iat',
			version: '0.3',
			scriptUrl: '/test/maintask.js'
		},
        {
            mixer: 'branch',
            conditions: [
                // you can insert any additional conditions that you like here
                {compare:'global.demographics.questions.demo02.response', operator: function(val){
                    return +val >= 18 && +val <= 25;
                }},
                {operator: function(){
                    var questions = API.getGlobal().audit.questions;
                    var responses = [];
                    for (var key in questions) responses.push(+questions[key].response || 0); 
                    var sum = responses.reduce(function(sum, value){return sum + value}, 0);
                    return sum >= 8;
                }}
            ],
            
            data: [
                {type:'message', template: '123'}
            ],
            elseData: [
                {type:'message', template: '456'}
            ]
        },
		{
            preText: API.PROGRESS_BAR, 
            type:'quest',
			name: 'first',
			scriptUrl: 'questScript1.js'
		},

		{
            preText: API.PROGRESS_BAR, 
			type: 'message',
			template: [
				'<div pi-message-done>',
					'<div >first</div>',
					'<div>second</div>',
					'<div>third</div>',
				'</div>'
			].join('\n'),
			piTemplate: false,
			sload: function(){
				var proceed = document.querySelectorAll('.proceed')[0];
				proceed.style.visibility = 'hidden';
				setTimeout(function(){
					proceed.style.visibility = '';
				}, 10 * 1000); // after 10 seconds
			},
			data: {
				videoUrl: 'http://clips.vorwaerts-gmbh.de/big_buck_bnny.mp4',
				imageUrl: 'http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg'
			}
		},

		{
			type: 'pip',
			name: 'iat',
			version: '123',
			scriptUrl: '/test/imageTest.js'
		},

		{
			type:'quest',
			name: 'first',
			scriptUrl: 'questScript1.js'
		},
		{type:'post', data:{1:2}, url:'my/post/url'},
		{
			script: {
				// custom script content
				content: 'Hi there, I\'m your custom message',

				// the activator function uses three dependencie
		 		play: function activator(done, script, $element){
					var timeoutId = setTimeout(done, 5000);
					$element.html(script.content);

					// will be called at the end of the task to clean things up
					// (whether the end is forced or triggered by 'done')
					return function clear(){
						clearTimeout(timeoutId);
						$element.empty();
					};
				}
			}
		},
		{
			mixer:'branch',
			conditions: [{compare:'global.cond', to: 'myConds'}],
			data: [
				{inherit:'instructions', template: 'iat.html <%= global.cond %>'}
			]
		},

		{inherit:'instructions', templateUrl: 'iat.html'},

		{inherit:{type:'exRandom', set:'quests'}},
		//{inherit:'instructions', templateUrl: '../example/biat.html'},
		{
			type: 'pip',
			name: 'biat',
			version: '1',
			scriptUrl: 'biat.js'
		},

		{inherit:'instructions', templateUrl: '../example/iat.html'},

		{
			type: 'pip',
			name: 'iat',
			version: "0.0.12",
			scriptUrl: 'iat.js'
		},
		{inherit:'instructions', template: 'Please answer the following questionnaire:'},
		{inherit:{type:'exRandom', set:'quests'}},
		{inherit:'instructions', template: 'Please answer the following questionnaire:'},
		{inherit:{type:'exRandom', set:'quests'}}
	]);

	return API.script;
});
