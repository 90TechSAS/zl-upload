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

    function zlUploadService($http,$q,$rootScope,$compile) {
      var vm = this;
      var url = '';
      var files;
      var getAllProgress = [];
      var averageProgress = 0;
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

        // clean data before each new uploads
        getAllProgress = [];
        $rootScope.filesInformations = [];


        //$rootScope.getAllProgress = [];
        // for each file start an upload instance 
        angular.forEach(arrayUpload, function(value, key) {

          // bind to scope
          var valueProp = 'value' + key;

          // create a directive for each upload & append it to the main directive (need $apply to update view)
          var directiveString = $compile('<zl-progress-bar file-data=' + valueProp + '></zl-progress-bar></div>')(scope);
          
          // stock each object in an array to manipulate file's informations
          getAllProgress.push(0);

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
          emitUploadFile(value,key);

        });
      }

      function calculateAverageProgress(){
        var total = 0;
        for(var i = 0; i < getAllProgress.length; i++) {
            total += getAllProgress[i];
        }
        averageProgress = Math.round(total / getAllProgress.length);
      }

      function getAverageProgress(){
        return averageProgress;
      }

      function emitUploadFile(value,index){
          uploadFile(value,$rootScope.filesInformations[index].request)
            .then(function(done) {

              _.defer(function(){
                $rootScope.filesInformations[index].progressdirective.remove();
              });

            }, function(error) {
                console.log(error);
            },  function(progress) {

              _.defer(function(){
                $rootScope.filesInformations[index].progress = progress;
                getAllProgress[index] = progress;
                calculateAverageProgress();
                $rootScope.$apply();
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

        //var xhr = $rootScope.filesInformations[index].request;
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
      function getFiles(){
        return vm.files;
      };


      /**
       * @ngdoc service
       * @name zlUploadService#setUrl
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {String} The Url use to upload
       * @description Setter of the upload's url
      */
      function setFiles(files){
        vm.files = files;
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
        emitUploadFile:emitUploadFile,
        upload:upload,
        getFiles:getFiles,
        getAllProgress:getAllProgress,
        setFiles:setFiles,
        getAverageProgress:getAverageProgress,
        setUrl:setUrl,
        uploadCancel:uploadCancel
      });
    }
})();
