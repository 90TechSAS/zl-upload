/**
 * Created by Renaud ROHLINGER on 25/01/2016.
 * Upload Service
 */

(function() {
  'use strict';


  angular
    .module('90Tech.zlUpload')
    .service('zlUploadService', zlUploadService);

    /**
     * @ngdoc service
     * @name 90Tech.zlUpload:zlUploadService
     * @description
     * # zlUploadService
     * Upload service
     *
    */
    function zlUploadService($http,$q,$rootScope,$compile) {
      var vm = this;
      var url = '';
      var files;
      var getAllProgress = [];
      var averageProgress = 0;
      var FilesInformations = [];
      var FilesInformationsIndex = {};



      /**
       * @ngdoc service
       * @name zlUploadService#upload
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Object} $scope Allow access to the view
       * @description Manipulate Filelist to prepare for upload
      */
      function upload($scope){
        var slice = Array.prototype.slice;
        var arrayUpload = slice.call(vm.getFiles());
        var progressContainer = angular.element(document.querySelector('.zlf-items-container'));

        // clean data before each new uploads
        getAllProgress = [];
        FilesInformations = [];
        progressContainer.empty();
        // for each file start an upload instance
        angular.forEach(arrayUpload, function(value, key) {
          // bind to scope
          var valueProp = 'value' + key;

          // create a directive for each upload & append it to the main directive (need $apply to update view)
          var directiveString = $compile('<zl-progress-bar class="zlf-item-container" file-data=' + valueProp + '></zl-progress-bar></div>')($scope);

          // stock each object in an array to manipulate file's informations
          getAllProgress.push(0);

          var i = Math.floor(Math.log(value.size) / Math.log(1024));

          var sizes = ['Bytes', 'Kb', 'Mb', 'Gb'];

          var size = (value.size / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i];

          var newFilesInformations = {
              'id' : key+1,
              'progress' : {},
              'file': value,
              'size': size,
              'cancel' : true,
              'progressdirective': directiveString,
              'request' : new XMLHttpRequest()
          };

          setFilesInformations(newFilesInformations);
          $scope[valueProp] = newFilesInformations;
          progressContainer.append(newFilesInformations.progressdirective);
          newFilesInformations.cancel = true;

          // start upload deferred (get progress callback from deferred.notify)
          emitUploadFile(value,key);

        });

      }

      /**
       * @ngdoc service
       * @name zlUploadService#startingInview
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Object,Boolean,Function} The Object file, the dragndrop check and the directive's function callback
       * @description Method called to update to the ready state
      */
      function startingInview(state, dragndrop,callback) {

        if(dragndrop!=undefined){
          state.uploadtext = '';
        }else{
          state.uploadtext = '';
        }
        state.inview = true;
        callback(state);
      }

      /**
       * @ngdoc service
       * @name zlUploadService#readyInview
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Object,Function} The Object file & the directive's function callback
       * @description Method called to update to the ready state
      */
      function readyInview(state,callback) {
        state.uploadtext = ' ' + vm.getFiles().length + ' files selected';
        state.inview = true;
        callback(state);
      }

      /**
       * @ngdoc service
       * @name zlUploadService#errorInview
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Object,Function} The Object file & the directive's function callback
       * @description Method called to show error
      */
      function errorInview(state,msg,callback) {
        state.inview = true;
        callback(state,msg);
      }


      /**
       * @ngdoc service
       * @name zlUploadService#uploadingInview
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Object,Function} The Object file & the directive's function callback
       * @description Method called to update to the uploading state & call the upload service method
      */
      function uploadingInview(state,$scope,callback) {
        state.inview = true;
        if(vm.getFiles()) {
          upload($scope);
        }
        callback(state);
      }

      /**
       * @ngdoc service
       * @name zlUploadService#doneInview
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {Object,Function} The Object file & the directive's function callback
       * @description Method called to update to the done state
      */
      function doneInview(state,callback) {
          state.inview = true;
          callback(state,state.uploadtext);
      }


      /**
       * @ngdoc service
       * @name zlUploadService#calculateAverageProgress
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description Calculate the average progress (% all files uploading)
      */
      function calculateAverageProgress(){
        var total = 0;
        for(var i = 0; i < getAllProgress.length; i++) {
            total += getAllProgress[i];
        }
        averageProgress = Math.round(total / getAllProgress.length);
      }

      /**
       * @ngdoc service
       * @name zlUploadService#getAverageProgress
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description return average progress (% all files uploading)
      */
      function getAverageProgress(){
        return averageProgress;
      }

      /**
       * @ngdoc service
       * @name zlUploadService#getFilesInformations
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description
      */
      function getFilesInformations(index){
        return FilesInformations[index];
      }

      /**
       * @ngdoc service
       * @name zlUploadService#setFilesInformations
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description
      */
      function setFilesInformations(object){
        var index = FilesInformationsIndex[object.id];
        if(index === undefined) {
            index = FilesInformations.length;
            FilesInformationsIndex[object.id] = index;
        }
        FilesInformations[index] = object;
      }

      /**
       * @ngdoc service
       * @name zlUploadService#emitUploadFile
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @param {File,Int} The file to upload & the index of filesInformations[]
       * @description Upload File & manage callback of the upload (done, error, progress)
      */
      function emitUploadFile(value,index){
        var progressContainer = angular.element(document.querySelector('.zlf-items-container'));
        var percentCompleted;
        var uploadedUpSpeed = 0;
        var lastUpTime = 0;
        var sizes = ['Bytes', 'Kb', 'Mb', 'Gb'];

        uploadFile(value,getFilesInformations(index).request)
          .then(function(done) {
              //getFilesInformations(index).progressdirective.remove();
          }, function(error) {
              console.log(error);
          },  function(e) {
              var endTime = (new Date()).getTime();
              var upspeed = ((e.loaded - uploadedUpSpeed) * 1000) / ((endTime - lastUpTime));
              var i = Math.floor(Math.log(e.loaded) / Math.log(1024));
              var ispeed = Math.floor(Math.log(upspeed) / Math.log(1024));
              percentCompleted = Math.round(e.loaded / e.total * 100);

              getFilesInformations(index).progress.percentCompleted = percentCompleted;

              if(e.loaded>0){
                getFilesInformations(index).progress.uploaded = (e.loaded / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i];
              }else{
                getFilesInformations(index).progress.uploaded = "0 Kb";
              }

              if(upspeed>0 && ispeed>0){
                getFilesInformations(index).progress.upspeed = (upspeed / Math.pow(1024, ispeed)).toPrecision(3) + ' ' + sizes[ispeed];
              }else{
                getFilesInformations(index).progress.upspeed = "0 Kb";
              }

              uploadedUpSpeed = e.loaded;
              lastUpTime = endTime;

              getAllProgress[index] = percentCompleted;
              calculateAverageProgress();
          });
      }

      // Create the XHR object.
      function createCORSRequest(xhr,method, url) {
        if ("withCredentials" in xhr) {
          // XHR for Chrome/Firefox/Opera/Safari.
          xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
          // XDomainRequest for IE.
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else {
          // CORS not supported.
          xhr = null;
        }
        return xhr;
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
        //var xhr = createCORSRequest(xhrGetter,'POST', vm.url);

        xhr.upload.onprogress = function (e) {
              if (e.lengthComputable) {
                if (deferred.notify) {
                  deferred.notify(e);
                }
              }
        };
        xhr.onload = function() {
          var text = xhr.responseText;
        };

        xhr.upload.onerror = function (e) {
          console.log('error');
          var msg = xhr.responseText ? xhr.responseText : "An unknown error occurred posting to '" + vm.url + "'";
          deferred.reject(msg);
        }

        var data = new FormData();

        if (vm.formData) {
          data.append(Object.keys(vm.formData)[0], vm.formData[Object.keys(vm.formData)[0]])
        }

        if (data) {
          data.append("files", files);
        }
        xhr.open('POST', vm.url, true);
        //xhr.setRequestHeader('Content-Type','undefined');

        if (!xhr) {
          alert('CORS not supported');
          return;
        }
        if (vm.headers) {
          
          for (var i in vm.headers)
          xhr.setRequestHeader(i, vm.headers[i])
        }
        xhr.send(data);
        return deferred.promise;
      };

      /**
       * @ngdoc service
       * @name zlUploadService#uploadCancel
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

      /**
       * @ngdoc service
       * @name zlUploadService#setHeader
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description Setter of the upload headers
       * @param headers Object
       */
      function setHeader(headers) {
        vm.headers = headers
      }

      /**
       * @ngdoc service
       * @name zlUploadService#setFormData
       * @methodOf 90Tech.zlUpload:zlUploadService
       * @description Setter od the upload formData
       * @param formData Object
       */
      function setFormData (formData) {
        vm.formData = formData
      }

      _.assign(vm, {
        emitUploadFile:emitUploadFile,
        readyInview:readyInview,
        startingInview:startingInview,
        uploadingInview:uploadingInview,
        doneInview:doneInview,
        errorInview:errorInview,
        getFiles:getFiles,
        getAllProgress:getAllProgress,
        setFiles:setFiles,
        getAverageProgress:getAverageProgress,
        setUrl:setUrl,
        uploadCancel:uploadCancel,
        setHeader: setHeader,
        setFormData: setFormData
      });
    }
})();
