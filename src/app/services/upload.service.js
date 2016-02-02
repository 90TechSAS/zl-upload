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

    function zlUploadService($http,$q,$timeout,$rootScope,$compile) {
      var vm = this;
      var url = '';

      /**
       * @ngdoc service
       * @name zlUploadService#upload
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Filelist} The Filelist that will be upload
       * @description Manipulate Filelist to prepare for upload
      */
      function upload(e,scope){
        var slice = Array.prototype.slice;
        var arrayUpload = slice.call(e);
        var progressContainer = angular.element(document.querySelector('.progress-container'));

        $rootScope.filesInformations = [];
        // for each file start an upload instance 
        angular.forEach(arrayUpload, function(value, key) {

          // bind to scope
          var valueProp = 'value' + key;

          // create a directive for each upload & append it to the main directive (need $apply to update view)
          var directiveString = $compile('<zl-progress-bar file-data=' + valueProp + '></zl-progress-bar></div>')(scope);
          
          // stock each object in an array to manipulate file's informations
          $rootScope.filesInformations.push({
            'id' : key+1,
            'progress' : 0,
            'file': value,
            'cancel' : true,
            'progressdirective': directiveString,
            'request' : new XMLHttpRequest()
          });

          scope[valueProp] = $rootScope.filesInformations[key];
          
          progressContainer.append($rootScope.filesInformations[key].progressdirective);
          $rootScope.filesInformations[key].cancel = true;

          // start upload deferred (get progress callback from deferred.notify)
          uploadFile(value,$rootScope.filesInformations[key].request)
            .then(function(done) {
              $timeout(function(){
                $rootScope.filesInformations[key].progressdirective.remove();
                $rootScope.filesInformations.splice(key, 1);
              });
            }, function(error) {
                console.log(error);
            },  function(progress) {
              // need to use timeout to ensure digest probs & then $apply() the var update to the view
              $timeout(function(){
                $rootScope.filesInformations[key].progress = progress;
                $rootScope.$apply();
              });
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
      function uploadFile(files,xhr){

        //xhr = new XMLHttpRequest();
        var deferred = $q.defer();
        console.log('start upload file');

        xhr.upload.onprogress = function (e) {
              var percentCompleted;
              if (e.lengthComputable) {
                percentCompleted = Math.round(e.loaded / e.total * 100);
                if (deferred.notify) {
                  deferred.notify(percentCompleted);
                }
              }
        };

        xhr.onload = function (e) {
          deferred.resolve(xhr.responseText);
        };

        xhr.upload.onerror = function (e) {
          console.log('error');
          var msg = xhr.responseText ? xhr.responseText : "An unknown error occurred posting to '" + vm.url + "'";
          deferred.reject(msg);
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
      function uploadCancel(xhrInstance) {
          xhrInstance.abort();
      }

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
        uploadFile:uploadFile,
        upload:upload,
        setUrl:setUrl,
        uploadCancel:uploadCancel
      });
    }
})();
