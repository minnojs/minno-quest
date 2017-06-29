<%@page pageEncoding="UTF-8" %>
<%@page import="org.uva.*, java.io.*" %>
<%

StudySession studySession = (StudySession) session.getAttribute("studysession");
String fullUrl = ((PageTask)studySession.getCurrentTask()).getUrl();
String urlPath = fullUrl.substring(0,fullUrl.indexOf("quest.jsp"));

String getProtocol=request.getScheme();
String getDomain=request.getServerName();
String getBase = getProtocol+"://"+getDomain;

	String script = request.getParameter("i");
	try{
		if (script == null){
			throw new Exception("Script is null");
		}
	} catch (Exception e){
		out.println("An exception occurred: " + e.getMessage());
	}
%>
<!doctype html>
<!--[if IE 7]>				 <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>				 <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" > <!--<![endif]-->
	<head>
		<base href="<%= getBase + "/implicit" + urlPath %>">
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>PI questionnaire</title>
		<meta name="description" content="Project Implicit Questionnaire">
		<meta name="viewport" content="width=device-width">
		<meta name="viewport" content="user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1" />
		<meta name="pinterest" content="nopin" />


		<% if (org.uva.Implicit.IS_PRODUCTION == "true") {%>
			<script>
				(function(_,e,rr,s){_errs=[s];var c=_.onerror;_.onerror=function(){var a=arguments;_errs.push(a);
				c&&c.apply(this,a)};var b=function(){var c=e.createElement(rr),b=e.getElementsByTagName(rr)[0];
				c.src="//beacon.errorception.com/"+s+".js";c.async=!0;b.parentNode.insertBefore(c,b)};
				_.addEventListener?_.addEventListener("load",b,!1):_.attachEvent("onload",b)})
				(window,document,"script","55530734a1b3d51609003d1c");
				_errs.meta = {
					script: '<%= script %>',
					session: '<%= studySession.getId() %>',
					taskId: '<%= studySession.getCurrentTask().getId() %>',
					studyId: '<%= studySession.getStudy().getId() %>',
					app: 'quest'
				}

				// https://github.com/yeoman/yeoman/issues/1051
				// prevent load timeouts
				var require = {waitSeconds:120}
			</script>
		<% } %>

		<link rel="stylesheet" href="styles/main.css" />

		<style type="text/css">

			.container {padding-top: 15px;}

			/* http://www.sitepoint.com/css3-responsive-centered-image/ */
			.pi-spinner {
				position: absolute;max-width: 80%;top: 50%;left: 50%;margin-left: -32px;margin-top: -32px;border-radius: 3px;
				display: block; -moz-box-sizing: border-box; box-sizing: border-box; background: url(img/loader.gif) no-repeat; width: 64px;height: 64px;padding-left: 64px; /* Equal to width of new image */}
			.pi-spinner:empty {margin: auto;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);}
			@media screen and (orientation: portrait) {.pi-spinner { max-width: 90%; }}
			@media screen and (orientation: landscape) {.pi-spinner { max-height: 90%; }}
		</style>
	</head>

	<body id="pi-app">
		<!--[if lt IE 7]>
			<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->

		<div class="container">
			<img class="pi-spinner" ng-hide="1"/>
			<div pi-manager-task="{type:'quest',scriptUrl:'<%= script %>'}"></div>
			<% if (org.uva.Implicit.IS_PRODUCTION == "false") {%><div pi-console></div><% } %>
		</div>

	</body>

	<!-- Uncomment For debugging -->
	<!-- <script type="text/javascript" src="../bower_components/jquery/dist/jquery.js"></script> -->

	<!--[if lt IE 7]>
		<script src="//cdnjs.cloudflare.com/ajax/libs/json3/3.3.1/json3.min.js"></script>
	<![endif]-->
	<!--[if lte IE 8]>
		<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->
	<script src="js/pibootstrap.js"></script>
</html>
