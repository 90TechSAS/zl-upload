/**
 * Created by Renaud ROHLINGER on 25/01/2016.
 * Upload Service
 */

(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name 90Tech.zlUpload:zlUploadService
   * @description
   * # zlUploadService
   * Upload service
   *
  */
  angular
    .module('90Tech.zlUpload')
    .service('zlUploadService', zlUploadService);

    function zlUploadService($http,$q,$timeout,$rootScope) {
      var vm = this;
      var url = '';
      // Array File Management TODO
      var ArrayFiles = [];
      var xhr = new XMLHttpRequest();

      /**
       * @ngdoc service
       * @name zlUploadService#upload
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Filelist} The Filelist that will be upload
       * @description Manipulate Filelist to prepare for upload
      */
      function upload(e){
        var slice = Array.prototype.slice;
        /*  Wait all files to be read then do stuff 
          1 - convert Filelist object to an array of file with call( [File][File][File])
          2 - then call the readFile method of the zlUpload service 
          for each element of converted array with map([zlUploadService.uploadFile(File)][zlUploadService.uploadFile(File)]) 
        */

        // show cancel button & others stuffs 
        broadCastUploadState(true);

        $q.all(slice.call(e).map(uploadFile))
          .then(function() {
            console.log('all files uploaded');
            // hide cancel button & others stuffs 
            $timeout(function(){
              broadCastUploadState(false);
            });
          });

      }

      /**
       * @ngdoc service
       * @name zlUploadService#uploadFile
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {File} The file to upload
       * @description Upload File method
      */
      function uploadFile(files, progressCb){

        xhr = new XMLHttpRequest();
        var deferred = $q.defer();
        console.log('start upload file');

        xhr.upload.onprogress = function (e) {
          var percentCompleted;
          if (e.lengthComputable) {
            percentCompleted = Math.round(e.loaded / e.total * 100);
            broadCastUploadProgress(percentCompleted);
          }
                
        };

        xhr.onload = function (e) {
          console.log('Your file has been uploaded successfully !');
        };

        xhr.upload.onerror = function (e) {
          console.log('error');
          var msg = xhr.responseText ? xhr.responseText : "An unknown error occurred posting to '" + vm.url + "'";
          $rootScope.$apply (function () {
              deferred.reject(msg);
          });
        }

        var data = new FormData();

        if (data) {
          data.append("files", files);
        }
        xhr.open("POST", vm.url);
        xhr.send(data);
        return deferred.promise;    
      };

      /**
       * @ngdoc service
       * @name zlUploadService#uploadFile
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description Cancel XMLHttpRequest
      */
      function uploadCancel() {
          xhr.abort();
          console.log('mission aborted');
      }

      function addFile(){

      };

      function deleteFile(){

      };

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
      };

      /**
       * @ngdoc service
       * @name zlUploadService#broadCastUploadProgress
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Int} The % of the upload progression
       * @description Update upload progression broadcast to progressBar Directive
      */
      function broadCastUploadProgress (uploadProgression) {
        $rootScope.$broadcast('handleUploadBroadcast', uploadProgression);
      };

      /**
       * @ngdoc service
       * @name zlUploadService#broadCastStartingUpload
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Bool} Boolean of progression div
       * @description Notify the state of the upload
      */
      function broadCastUploadState (startUploadBoolean) {
        $rootScope.$broadcast('handleUploadState', startUploadBoolean);
      };


      /**
       * @ngdoc service
       * @name zlUploadService#setUrl
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {String} The Url use to upload
       * @description Setter of the upload's url
      */
      function setUrl(url){
        vm.url = url;
      };

      /**
       * @ngdoc service
       * @name zlUploadService#getUrl
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description Getter of the upload's url
      */
      function getUrl(){
        return vm.url;
      };

      _.assign(vm, {
        upload:upload,
        setUrl:setUrl,
        uploadCancel:uploadCancel
      });
    }
})();
