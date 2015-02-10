{% extends "../templates/layout.swig" %}

{% block title %}
	<h1>Playground</h1>
	<p>You can play around with the player right here. All you need to do is write your script and then click the activate button.</p>
{% endblock %}

{% block head %}
	{% parent %}
	<script src="//cdn.jsdelivr.net/ace/1.1.8/min/ace.js" type="text/javascript" charset="utf-8"></script>
	<style type="text/css" media="screen">
	    #editor {
	    	margin-top: 1em;
	        border-radius: 4px 4px 0;
	        border: 1px solid #ddd;
	        height: 30em;
	        font-size: 14px;
	    }
	</style>
{% endblock %}


{% block content %}
		<p>
			<button class="btn btn-default btn-lg btn-block" onclick="window.click()" type="button">Activate</button>
		</p>
		<div id="editor">
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
		</div>

		<script>
		    var editor = ace.edit("editor");
		    editor.setTheme("ace/theme/monokai");
		    editor.getSession().setMode("ace/mode/javascript");
		    var win;

		    function click(){
		    	if (win){
		    		win.close();
		    		win = null;
		    	}
		    	win = window.open('playquest.html', 'questionnaire');
		    	win.onload = function(){
		    		win.piActivate(editor.getValue());
		    	};
		    }
		</script>
{% endblock %}