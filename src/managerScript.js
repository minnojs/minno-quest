define(function(){
	return {
		onEnd: function(){console.log('onEnd');},

		sequence: [
			{
				type:'quest',
				scriptUrl: '/src/questScript1.js'
			},
			{
				type:'quest',
				scriptUrl: '/src/questScript2.js'
			}
		]
	};
});