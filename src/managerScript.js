define(function(){
	return {
		onEnd: function(){console.log('onEnd');},

		sequence: [
			{
				type:'quest',
				scriptUrl: 'questScript1.js'
			},
			{
				type:'quest',
				scriptUrl: 'questScript2.js'
			}
		]
	};
});