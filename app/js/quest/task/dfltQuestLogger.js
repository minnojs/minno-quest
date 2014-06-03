define(function(){

	function dfltQuestLogger(log, pageData, global){
		global;
		return {
			response: log.response,
			name: log.name,
			pageData: 'pageData place holder',
			global: 'globalData place holder'
		};
	}

	return dfltQuestLogger;

});