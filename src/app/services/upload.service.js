/**
 * Created by Renaud ROHLINGER on 25/01/2016.
 * Upload Service
 */

(function() {
    'use strict';

    angular
        .module('90Tech.zlUpload',[])
        .service('zlUploadService', zlUploadService);


        function zlUploadService($http,$q) {
            var vm = this;
            var url = '';
            // Array File Management TODO
            var ArrayFiles = [];

            // Preview mode | Delete ?
            function readFile(file) {
               /* var deferred = $q.defer();
                var read = new FileReader()
                    read.onload = function(e) {
                        deferred.resolve(e.target.result);
                    }
                    read.onerror = function(e) {
                        deferred.reject(e);
                    }

                read.result(file);


                return deferred.promise;*/
                return file;
            };

            function uploadFile(files){

                    var data = new FormData();
                    data.append("files", files);

                    $http.post(vm.url,data,{
                        withCredentials: true,
                        headers : {'Content-Type': undefined},
                        transformRequest: angular.identity
                    }).success(function() {
                        console.log("Uploaded");
                    }).error(function() {
                        console.log("Error");
                    });
            };



            function addFile(){

            };

            function deleteFile(){

            };

            function setUrl(url){
                vm.url = url;
            };
            function getUrl(){
                return vm.url;
            };

            _.assign(vm, {
                uploadFile:uploadFile,
                setUrl:setUrl
            });
        }

})();
