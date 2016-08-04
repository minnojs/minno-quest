<!DOCTYPE html>
<html lang="en">
	<head>

		<!-- Meta, title, CSS, favicons, etc. -->
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Bootstrap, a sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.">
		<meta name="keywords" content="HTML, CSS, JS, JavaScript, framework, bootstrap, front-end, frontend, web development">
		<meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">

		<title>
			{% if data.typeName == 'quest' %}
				piQuest
			{% elseif data.typeName == 'manager' %}
				piManager
			{% elseif data.typeName == 'basics' %}
				Basics
			{% endif %}
			&middot; V0.0
		</title>

		{% block head %}
		<!-- Bootstrap core CSS -->
		<link href="../../bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
		<link href="../css/highlight.css" rel="stylesheet">
		<link href="../css/style.css" rel="stylesheet">
		<style type="text/css">
			pre {display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8;-webkit-text-size-adjust:none}
			table {padding: 0;}
			table tr {border-top: 1px solid #cccccc;background-color: white;margin: 0;padding: 0;}
			table tr:nth-child(2n) {background-color: #f8f8f8;}
			table tr th {font-weight: bold;border: 1px solid #cccccc;text-align: left;margin: 0;padding: 6px 13px;}
			table tr td {border: 1px solid #cccccc;text-align: left;margin: 0;padding: 6px 13px;}
			table tr th :first-child, table tr td :first-child {margin-top: 0;}
			table tr th :last-child, table tr td :last-child {margin-bottom: 0;}
		</style>
		{% endblock head %}

		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		<!-- Favicons -->
		<link rel="apple-touch-icon" href="../apple-touch-icon.png">
		<link rel="icon" href="../favicon.ico">

	</head>

	<body>
		<a id="skippy" class="sr-only sr-only-focusable" href="#content"><div class="container"><span class="skiplink-text">Skip to main content</span></div></a>

		<!-- Docs master nav -->
		<header class="navbar navbar-static-top bs-docs-nav" id="top" role="banner">
			<div class="container">
				<div class="navbar-header">
					<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a href="../../" class="navbar-brand">Project Implicit</a>
				</div>
				<nav class="collapse navbar-collapse bs-navbar-collapse">
					<ul class="nav navbar-nav">
						<li class="{% if data.typeName == 'basics' %} active {% endif %}">
							<a href="../basics/overview.html">Basics</a>
						</li>
						<li class="{% if data.typeName == 'quest' %} active {% endif %}">
							<a href="../quest/overview.html">piQuest</a>
						</li>
						<li class="{% if data.typeName == 'manager' %} active {% endif %}">
							<a href="../manager/overview.html">piManager</a>
						</li>
						<li>
							<a href="/PIPlayer">piPlayer</a>
						</li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li>
							<form class="navbar-form navbar-left" role="search" method="get" action="http://www.google.com/search">
							  <div class="form-group">
							    <input type="text" class="form-control" placeholder="Search" name="q" size="25" maxlength="255">
							  </div>
							  <button type="submit" class="btn btn-default" value="Google Search">
							    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
							  </button>
							  <input type="hidden" name="sitesearch" value="projectimplicit.github.io" checked />
							</form>
						</li>

						<li><a href="https://github.com/ProjectImplicit/PIquest">Github</a></li>
					</ul>
				</nav>
			</div>
		</header>

		<div id="content" class="bs-docs-header">
			<div class="container">
				{% block title %} Project Implicit {% endblock %}
			</div>
		</div>

		<div class="container bs-docs-container">
			<div class="row">
				<div class="col-md-9" role="main">
					{% block content %}{% endblock %}
				</div>

				<div class="col-md-3" role="complementary">
					<nav class="bs-docs-sidebar hidden-print hidden-xs hidden-sm">

						{% macro navitem(name, filename, current) %}
							<li class="{%if filename.endsWith(current) %} active {% endif %}">
							<li class="{%if filename.indexOf('/' + current, filename.length - current.length - 1) !== -1 %} active {% endif %}">

								<a href="{{ filename }}.html">{{ name }}</a>
							</li>
						{% endmacro listitem %}

						{% macro navsubitem(name, filename, current) %}
							<li class="{%if filename.endsWith(current) %} active {% endif %}">
                                <a href="{{ filename }}.html">{{ name }}</a>
							</li>
						{% endmacro navsubitem %}

						{% macro example(name, filename, current) %}
							<li class="{%if filename.endsWith(current) %} active {% endif %}">
								<div>
									<a href="{{ filename }}Docco.html">{{ name }}</a>
									<a href="{{ filename }}.js" download="{{filename}}.js" title="Download"><span class="glyphicon glyphicon-download"></span></a>
									<a href="{{ filename }}Play.html" title="Play"><span class="glyphicon glyphicon-play-circle"></span></a>
								</div>
							</li>
						{% endmacro example %}

						<ul class="nav bs-docs-sidenav">
						{% if data.typeName == 'basics' %}

							{{ navitem("Overview", "../basics/overview", data.basename) }}
							{{ navitem("Javascript", "../basics/javascript", data.basename) }}
							{{ navitem("Creating a task", "../basics/create", data.basename) }}
                            <li>
								<a href="../sequencer/introduction.html">Sequencer</a>
                                <ul class="nav">
									{{ navsubitem("Introduction", "../sequencer/introduction", data.basename) }}
									{{ navsubitem("Mixer", "../sequencer/mixer", data.basename) }}
									{{ navsubitem("Templates", "../sequencer/templates", data.basename) }}
									{{ navsubitem("Variables", "../sequencer/variables", data.basename) }}
									{{ navsubitem("Inheritance", "../sequencer/inheritance", data.basename) }}
                                </ul>
                            </li>
							{{ navitem("API", "../basics/API", data.basename) }}
							{{ navitem("Resources", "../basics/resources", data.basename) }}

							<li>
								<a href="javascript:void(0)">Inheritance</a>
								<ul class="nav">
									{{ example("Abstraction", "../basics/inheritanceAbstraction", data.basename) }}
									{{ example("Random", "../basics/inheritanceRandom", data.basename) }}
									{{ example("Exclusive Random", "../basics/inheritanceExRandom", data.basename) }}
									{{ example("Sequential", "../basics/inheritanceSequential", data.basename) }}
									{{ example("By Data", "../basics/inheritanceByData", data.basename) }}
									{{ example("Custom", "../basics/inheritanceCustom", data.basename) }}

									{{ example("Seed", "../basics/inheritanceSeed", data.basename) }}
									{{ example("Repeat", "../basics/inheritanceRepeat", data.basename) }}
								</ul>
							</li>

							<li>
								<a href="javascript:void(0)">Mixers</a>
								<ul class="nav">
									{{ example("Random", "../basics/mixerRandom", data.basename) }}
									{{ example("Repeat", "../basics/mixerRepeat", data.basename) }}
									{{ example("Weighted Random", "../basics/mixerWeightedRandom", data.basename) }}
									{{ example("Choose", "../basics/mixerChoose", data.basename) }}
									{{ example("Wrapper", "../basics/mixerWrapper", data.basename) }}
									{{ example("Branch", "../basics/mixerBranch", data.basename) }}
									{{ example("Multi Branch", "../basics/mixerMultiBranch", data.basename) }}
								</ul>
							</li>

							<li>
								<a href="javascript:void(0)">Variables & Templates</a>
								<ul class="nav">
									{{ example("Global", "../basics/templateGlobal", data.basename) }}
									{{ example("Data", "../basics/templateData", data.basename) }}
									{{ example("Meta", "../basics/templateMeta", data.basename) }}
								</ul>
							</li>

						{% elseif data.typeName == 'quest' %}

							{{ navitem("Overview", "../quest/overview", data.basename) }}
							{{ navitem("Introduction", "../quest/introduction", data.basename) }}
							{{ navitem("API", "../quest/API", data.basename) }}
							{{ navitem("Playground", "../quest/questplayground", data.basename) }}
							<li>
								<a href="helloworldDocco.html">Examples</a>
								<ul class="nav">
									{{ example("Hello world", "../quest/helloworld", data.basename) }}
									{{ example("Body Awareness", "../quest/bodyAwareness", data.basename) }}
									{{ example("Weight demo", "../quest/weight", data.basename) }}
									{{ example("Using Images", "../quest/usingImages", data.basename) }}
									{{ example("Buttons", "../qsts/buttons", data.basename) }}
									{{ example("Buttons Advanced", "../qsts/buttonsAdvanced", data.basename) }}
									{{ example("Buttons One Page", "../qsts/buttonsOnePage", data.basename) }}
									{{ example("Dependency", "../qsts/dependency", data.basename) }}
									{{ example("Live Dependency", "../qsts/liveDependency", data.basename) }}
									{{ example("Grid","../qsts/grid", data.basename) }}
									{{ example("Timer","../qsts/timer", data.basename) }}
									{{ example("Open Ended", "../qsts/openEnded", data.basename) }}
									{{ example("Open Ended Long", "../qsts/openEndedLong", data.basename) }}
									{{ example("Rate Images", "../qsts/rateImages", data.basename) }}
									{{ example("Rate Images Sizes", "../qsts/rateImagesSizes", data.basename) }}
									{{ example("Scale With Feedback", "../qsts/scaleWithFeedback", data.basename) }}
									{{ example("Slider", "../qsts/slider", data.basename) }}
									{{ example("User Prev Resp", "../qsts/userPrevResp", data.basename) }}
									{{ example("Agreement scale", "../qsts/nfc", data.basename) }}
								</ul>
							</li>
							<li>
								<a href="javascript:void(0)">Questions</a>
								<ul class="nav">
									{{ example("Text", "../questExamples/text", data.basename) }}
									{{ example("Textarea", "../questExamples/textarea", data.basename) }}
									{{ example("Text Number", "../questExamples/textNumber", data.basename) }}
									{{ example("Select One", "../questExamples/selectOne", data.basename) }}
									{{ example("Select Multi", "../questExamples/selectMulti", data.basename) }}
									{{ example("Grid", "../questExamples/grid", data.basename) }}
									{{ example("Slider", "../questExamples/slider", data.basename) }}
									{{ example("Rank", "../questExamples/rank", data.basename) }}
								</ul>
							</li>
						{% elseif data.typeName == 'manager' %}

							{{ navitem("Overview", "overview", data.basename) }}
							{{ navitem("Messages", "messages", data.basename) }}
							{{ navitem("Post", "post", data.basename) }}
							{{ navitem("Redirect", "redirect", data.basename) }}
							<li>
								<a href="javascript:void(0)">Examples</a>
								<ul class="nav">
									{{ example("Weight experiment", "weightManager", data.basename) }}
									{{ example("Displaying Video", "videoManager", data.basename) }}
								</ul>
							</li>
							{{ navitem("API", "../manager/API", data.basename) }}
							{{ navitem("Playground", "../manager/managerplayground", data.basename) }}
						{% endif %}
						</ul>
						<!-- <a class="back-to-top" href="#top">
							Back to top
						</a> -->
					</nav>
				</div>
			</div>
		</div>

		<!-- Footer
		================================================== -->
		<footer class="bs-docs-footer" role="contentinfo">
			<div class="container">
				<p>Created by Project Implicit for the benefit of all.</p>
				<!-- <p>Code licensed under <a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">MIT</a>, documentation under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.</p> -->
				<ul class="bs-docs-footer-links text-muted">
					<li>Currently v0.0.45</li>
					<li>&middot;</li>
					<li><a href="https://github.com/ProjectImplicit/PIquest">GitHub</a></li>
					<li>&middot;</li>
					<li><a href="https://github.com/ProjectImplicit/PIquest/releases">Releases</a></li>
				</ul>
			</div>
		</footer>

	</body>
</html>
