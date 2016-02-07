# zl-upload
Lightweight Angularjs directive allowing to upload files.

## FileUpload
**Parameters :**
 - `to` is the url for the upload
 - `multiple` allow to upload multiples files at the same time
 - `dragndrop` add the possibily to drag'n'drop files in a div
 - `autosubmit` auto submit files

Here an example on how to use a simple fileupload :

`<div class="container"><zl-upload to="upload.php" dragndrop multiple></zl-upload></div>`

## Below a basic implementation of zl-upload
    <html ng-app="demo">
    <head>
	    <!-- file upload stylesheet -->
	    <link href=../bower_components/zl-upload/style.min.js' rel='stylesheet' type='text/css'>
	</head>
    <body>
	<!-- your custom container -->
	<div class="container">
		<!-- custom upload directive -->
 		<zl-upload to="upload.php" dragndrop multiple></zl-upload>
 	</div>

	<!-- dependencies -->
	<script src="../bower_components/angular/angular.js"></script>
	<script src="../bower_components/lodash/lodash.js"></script>

	<!-- library to add -->
	<script src="../bower_components/zl-upload/zl-upload.js"></script>

	<!-- add 90Tech.zlUpload to your app  -->
	<script>
	  var demo = angular.module("demo",['90Tech.zlUpload']);
	</script>

**TODO :**
 - todo.md
 - manage files extensions
 - truncate filename on progressbar
 - change the use of $rootScope by a service callback
 - create bower package
 - gh-pages instead of test folder.
