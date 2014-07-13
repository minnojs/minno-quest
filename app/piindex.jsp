<%@page pageEncoding="UTF-8" %>
<%@page import="org.uva.*, java.io.*" %>
<%

StudySession studySession = (StudySession) session.getAttribute("studysession");
String fullUrl = ((PageTask)studySession.getCurrentTask()).getUrl();
String urlPath = fullUrl.substring(0,fullUrl.indexOf("piindex"));

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
<!--[if IE 7]>				 <html class="no-js lt-ie9 lt-ie8" id="ng-app" ng-app=""> <![endif]-->
<!--[if IE 8]>				 <html class="no-js lt-ie9" id="ng-app" ng-app=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" > <!--<![endif]-->
	<head>
		<base href="<%= getBase + "/implicit" + urlPath %>">
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>PI questionnaire</title>
		<meta name="description" content="Project Implicit Questionnaire">
		<meta name="viewport" content="width=device-width">

		<!-- build:css styles/vendor.css -->
		<!-- bower:css -->
		<link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.css" />
		<!-- endbower -->
		<!-- endbuild -->

		<!-- build:css({.tmp,app}) styles/main.css -->
		<!-- <link rel="stylesheet" href="styles/main.css"> -->
		<!-- endbuild -->

		<style type="text/css">
			/* http://www.sitepoint.com/css3-responsive-centered-image/ */
			img.pi-logo {
				position: absolute;
				max-width: 80%;
				top: 50%;
				left: 50%;
				margin-left: -100px;
				margin-top: -62px;
				border-radius: 3px;
			}

			img.pi-logo:empty {
				margin: auto;
				-webkit-transform: translate(-50%, -50%);
				-moz-transform: translate(-50%, -50%);
				-ms-transform: translate(-50%, -50%);
				-o-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
			}

			@media screen and (orientation: portrait) {
			  img.pi-logo { max-width: 90%; }
			}

			@media screen and (orientation: landscape) {
			  img.pi-logo { max-height: 90%; }
			}
		</style>
	</head>

	<body ng-app>
		<!--[if lt IE 7]>
			<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->

		<div class="container">
			<div pi-task="<%= script %>">
				<img class="pi-logo" src="img/logo.png" />
			</div>
		</div>
	</body>

	<!-- Uncomment For debugging -->
	<!-- <script type="text/javascript" src="libs/jquery/dist/jquery.js"></script> -->

	<!--[if lt IE 7]>
		<script src="//cdnjs.cloudflare.com/ajax/libs/json3/3.3.1/json3.min.js"></script>
	<![endif]-->
	<!--[if lt IE 8]>
		<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"></script>
	<![endif]-->
	<script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.min.js" data-main="js/bootstrap.js"></script>
	<script>window.require || document.write('<script src="libs/requirejs/require.js" data-main="js/bootstrap.js"><\/script>');</script>
</html>