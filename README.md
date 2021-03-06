# zl-upload
Lightweight Angularjs directive allowing to upload files.

## FileUpload
**Parameters :**
 - `zlf-to` is the url for the upload
 - `zlf-max-files` if set, allow to upload x files maximum. The limit by default is 1 file max
 - `zlf-max-size-mb` if set, provide a limit of size to the files accepted (in MB)
 - `zlf-accept` if set, allow to filter files extensions
 - `zlf-dragndrop` add the possibily to drag'n'drop files in a div
 - `zlf-autosubmit` auto submit files


Here an example on how to use a simple fileupload :

`<zl-upload to="your-server-url" zlf-dragndrop zlf-max-files="2" zlf-max-size-mb="1" zlf-autosubmit></zl-upload>`

## CORS NodeJS server implementation example
      var express = require('express'),
          cors = require('cors'),
          port = process.env.PORT || 3000,
          app = express();


      var options = {
        origin: true,
        methods: ['POST']
      };
      app.options('/upload', cors(options));
      app.post('/upload', cors(options), function(req, res){
        res.json({
          file: 'success !'
        });
      });

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
 - files extensions, still not implemented in drag & drop
 - truncate filename on progressbar
 - create bower package
