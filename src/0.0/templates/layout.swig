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

		<title>piQuest &middot; V0.0</title>

		<!-- Bootstrap core CSS -->
		<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
		<link href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/sunburst.min.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet">
		<style type="text/css">
			pre {display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8;-webkit-text-size-adjust:none}
		</style>

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
					<a href="../" class="navbar-brand">Project Implicit</a>
				</div>
				<nav class="collapse navbar-collapse bs-navbar-collapse">
					<ul class="nav navbar-nav">
						<li class="active">
							<a href="overview.html">piQuest</a>
						</li>
<!-- 						<li >
							<a href="../css/">CSS</a>
						</li>
 -->					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href="https://github.com/ProjectImplicit/PIquest">Github</a></li>
					</ul>
				</nav>
			</div>
		</header>

		<div id="content" class="bs-docs-header">
			<div class="container">
				{% block title %} Project Implicit {% endblock%}
			</div>
		</div>

		<div class="container bs-docs-container">
			<div class="row">
				<div class="col-md-9" role="main">
					{% block content %}{% endblock%}
				</div>

				<div class="col-md-3" role="complementary">
					<nav class="bs-docs-sidebar hidden-print hidden-xs hidden-sm">

						{% macro navitem(name, filename, current) %}
							<li class="{%if filename == current %} active {% endif %}">
								<a href="{{ filename }}.html">{{ name }}</a>
							</li>
						{% endmacro listitem %}

						{% macro example(name, filename, current) %}
							<li class="{%if filename == current %} active {% endif %}">
								<div>
									<a href="{{ filename }}Docco.html">{{ name }}</a>
									<a href="{{ filename }}.js" download="{{filename}}.js" title="Download"><span class="glyphicon glyphicon-download"></span></a>
									<a href="{{ filename }}Play.html" target="_blank" title="Play"><span class="glyphicon glyphicon-play-circle"></span></a>
								</div>
							</li>
						{% endmacro example %}

						<ul class="nav bs-docs-sidenav">
							{{ navitem("Overview", "overview", data.basename) }}
							{{ navitem("Introduction", "introduction", data.basename) }}
							{{ navitem("Tutorial", "tutorial", data.basename) }}
							<li>
								<a href="helloworldDocco.html">Examples</a>
								<ul class="nav">
									{{ example("Hello world", "helloworld", data.basename) }}
									{{ example("Weight demo", "weight", data.basename) }}
								</ul>
							</li>
							<li><a href="API.html">API</a></li>
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
					<li>Currently v0.0.24</li>
					<li>&middot;</li>
					<li><a href="https://github.com/ProjectImplicit/PIquest">GitHub</a></li>
					<li>&middot;</li>
					<li><a href="https://github.com/ProjectImplicit/PIquest/releases">Releases</a></li>
				</ul>
			</div>
		</footer>

	</body>
</html>
