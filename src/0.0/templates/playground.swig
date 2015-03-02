{% extends "../templates/layout.swig" %}

{% block title %}
	<h1>Playground</h1>
	<p>You can play around with the player right here. All you need to do is write your script and then click the activate button.</p>
{% endblock %}

{% block head %}
	{% parent %}
	<script src="../../bower_components/ace-builds/src-min/ace.js" type="text/javascript" charset="utf-8"></script>
	<style type="text/css" media="screen">
	    #editor {
	    	margin-top: 1em;
	        border-radius: 4px 4px 0;
	        border: 1px solid #ddd;
	        height: 30em;
	        font-size: 14px;
	    }

		@-webkit-keyframes fadeIn {
		  0% {opacity: 0;}
		  20% {opacity: 1;}
		  80% {opacity: 1;}
		  100% {opacity: 0;}
		}

		@keyframes fadeIn {
		  0% {opacity: 0;}
		  20% {opacity: 1;}
		  80% {opacity: 1;}
		  100% {opacity: 0;}
		}

		.fadeIn {
		  	-webkit-animation-name: fadeIn;
		    animation-name: fadeIn;
		    animation-duration: 6s;
			opacity:0;
		}
	</style>
{% endblock %}


{% block content %}
		<p>
			<button class="btn btn-default btn-lg btn-block" onclick="window.click()" type="button">Activate</button>
		</p>

		<div id="success" role="alert" class="alert alert-success" style="display:none">
			<strong>Well Done!</strong> The questionnaire has been successfully completed.
		</div>
		<div id="error" role="alert" class="alert alert-danger" style="display:none">
			<strong>Oh Snap!</strong> Something went wrong with the questionnaire. Why don't you fix it and try again?
		</div>

   		<div id="editor">
{% if data.dirname == 'quest' %}
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
{% elseif data.dirname == 'manager' %}
define(['managerAPI'], function(Manager){

    var API = new Manager();

    API.addSequence([
        {type:'message', template:'{{'<h1>Hellow world</h1>' | escape}}', keys: ' '}
    ]);

    return API.script;
});
{% endif %}
		</div>

		<script>
		    var editor = ace.edit("editor");
		    editor.setTheme("ace/theme/monokai");
		    editor.getSession().setMode("ace/mode/javascript");
		    var win;
		    var feedbackId = 'success';

		    function click(){
		    	// assume the feedback is success
				feedbackId = 'success';

				// clean out open window
		    	if (win){
		    		win.close();
		    		win = null;
		    	}

		    	win = window.open('{{ data.dirname }}activate.html', '{{ data.dirname|capitalize }}');

		    	win.onload = function(){
		    		// first set the unload listener
					win.addEventListener('unload', function(event) {
						var el = document.getElementById(feedbackId);
						window.focus();
						fade(el);
					});

					// then activate the player (this ensures that when )
					win.piActivate(editor.getValue());
		    	};
		    }

	    	window.addEventListener('error', function(e){
	    		console.error(e);
	    		feedbackId = 'error';
	    	});

	    	function fade(el){
				el.style.display = 'block';
				el.classList.add('fadeIn');
				setTimeout(function(){
					el.style.display = 'none';
					el.classList.remove('fadeIn');
				}, 6000);
	    	}

		</script>
{% endblock %}