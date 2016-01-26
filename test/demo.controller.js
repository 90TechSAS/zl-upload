/**
 * Created by Renaud ROHLINGER on 25/01/2016.
 * Home router
 */


(function() {
    'use strict';


    angular
        .module('demo',['90Tech.zlUpload'])
        .controller('DemoController', DemoController); 

        function DemoController($scope, zlUploadService){
            $scope.uploadFile = function(){
                var file = $scope.myFile;
            console.log($scope);
                console.log('file is ' );
                console.dir(file);
                var uploadUrl = "./fileUpload";
                zlUploadService.uploadFileToUrl(file, uploadUrl);
            };
            
        };


})();

