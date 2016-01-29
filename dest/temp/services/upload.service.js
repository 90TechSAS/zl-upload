/**
 * Created by Renaud ROHLINGER on 25/01/2016.
 * Upload Service
 */

'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name 90Tech.zlUpload:zlUploadService
     * @description
     * # zlUploadService
     * Upload service
     *
    */
    angular.module('90Tech.zlUpload').service('zlUploadService', zlUploadService);

    function zlUploadService($http, $q, $rootScope) {
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

        /**
         * @ngdoc service
         * @name zlUploadService#uploadFile
         * @methodOf 90Tech.zlUpload:zlUploadService
         * @param {File} The file to upload
         * @description Upload File method
        */
        function uploadFile(files) {

            var data = new FormData(),
                xhr = new XMLHttpRequest();
            data.append("files", files);
            /*
                                $http.post(vm.url,data,{
                                    withCredentials: true,
                                    headers: {
                                        // custom header while waiting AngularJs to make $xhrFactory service (soon)
                                        __XHR__: function() {
                                            return function(xhr) {
                                                xhr.upload.addEventListener("progress", function(event) {
                                                    setProgressStatus((event.loaded/event.total) * 100);
                                                    vm.progressStatus = (event.loaded/event.total) * 100;
                                                    $rootScope.$apply();
                                                });
                                            };
                                        },
                                    },
                                    transformRequest: angular.identity
                                }).success(function() {
                                    console.log("Uploaded");
                                }).error(function() {
                                    console.log("Error");
                                });*/
            xhr.onloadstart = function () {
                console.log('Factory: upload started: ');
            };

            // When the request has failed.
            xhr.onerror = function (e) {};

            // Send to server, where we can then access it with $_FILES['file].
            xhr.open('POST', vm.url);
            xhr.send(data);
        };

        /**
         * @ngdoc service
         * @name zlUploadService#upload
         * @methodOf 90Tech.zlUpload:zlUploadService
         * @param {Filelist} The Filelist that will be upload
         * @description Manipulate Filelist to prepare for upload
        */
        function upload(e) {

            var slice = Array.prototype.slice;
            /*  Wait all files to be read then do stuff 
              1 - convert Filelist object to an array of file with call( [File][File][File])
              2 - then call the readFile method of the zlUpload service 
              for each element of converted array with map([zlUploadService.uploadFile(File)][zlUploadService.uploadFile(File)]) 
            */
            $q.all(slice.call(e).map(uploadFile)).then(function () {});
        }

        function addFile() {};

        function deleteFile() {};

        /**
         * @ngdoc service
         * @name zlUploadService#setUrl
         * @methodOf 90Tech.zlUpload:zlUploadService
         * @param {String} The Url use to upload
         * @description Setter of the upload's url
        */
        function setUrl(url) {
            vm.url = url;
        };

        /**
         * @ngdoc service
         * @name zlUploadService#getUrl
         * @methodOf 90Tech.zlUpload:zlUploadService
         * @description Getter of the upload's url
        */
        function getUrl() {
            return vm.url;
        };

        _.assign(vm, {
            upload: upload,
            setUrl: setUrl
        });
    }
})();