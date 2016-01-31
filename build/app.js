(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _uploadConfig = require('./upload.config');

var _uploadConfig2 = _interopRequireDefault(_uploadConfig);

var _servicesUploadService = require('./services/upload.service');

var _servicesUploadService2 = _interopRequireDefault(_servicesUploadService);

var _directivesUploadDirective = require('./directives/upload.directive');

var _directivesUploadDirective2 = _interopRequireDefault(_directivesUploadDirective);
},{"./directives/upload.directive":2,"./services/upload.service":3,"./upload.config":4}],2:[function(require,module,exports){
/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive 
 */

'use strict';

(function () {

  'use strict';

  zlUploadFile.$inject = ["zlUploadService"];
  zlProgressBar.$inject = ["$q", "zlUploadService"];
  zlCancelButton.$inject = ["$q", "zlUploadService"];
  angular.module('90Tech.zlUpload').directive('zlUpload', zlUpload);

  zlUpload.$inject = ['zlUploadService'];

  function zlUpload(zlUploadService) {
    return {
      restrict: 'E',
      transclude: true,
      template: function template(element) {
        var uploadMethod = element[0].hasAttribute('dragndrop') ? '<zl-upload-drag-and-drop></zl-upload-drag-and-drop>' : '<zl-upload-file></zl-upload-file>';
        return uploadMethod;
      },
      link: function link(scope, element, attrs, ngModel) {
        // Set url to upload
        zlUploadService.setUrl(attrs.to);
      } // link
    }; // return
  };

  zlUploadDragAndDrop.$inject = ['zlUploadService'];

  angular.module('90Tech.zlUpload').directive('zlUploadDragAndDrop', zlUploadDragAndDrop);

  function zlUploadDragAndDrop(zlUploadService) {
    return {
      restrict: 'E',
      replace: true,
      template: function template(element) {
        var autosubmit = element.parent()[0].hasAttribute('autosubmit') ? '' : '<button class="submit-file">Upload</button>';
        var htmlText = '<div class="div-file-container drop-div"><p>Drag your files here to upload</p> ' + autosubmit + '<zl-progress-bar></zl-progress-bar></div>';
        return htmlText;
      },
      link: function link(scope, element, attrs) {
        element.on('dragover', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
        element.on('dragenter', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
        element.on('drop', function (e) {
          e.preventDefault();
          e.stopPropagation();
          // Multiple files condition
          if (element.parent()[0].hasAttribute('multiple')) {
            console.log('multiple upload');
          } else {}
          if (e) {
            // start upload upload->UploadFile
            zlUploadService.upload(e.dataTransfer.files, function (complete) {
              console.log({ percentDone: complete });
            }).then(function (data) {
              //scope.onDone({files: ret.files, data: ret.data});
              console.log(data);
            }, function (error) {
              //scope.onError({files: scope.files, type: 'UPLOAD_ERROR', msg: error});
              console.log(error);
            }, function (progress) {
              console.log({ percentDone: progress });
              console.log(progress);
            });
          }
        });
      }
    };
  }

  angular.module('90Tech.zlUpload').directive('zlUploadFile', zlUploadFile);

  function zlUploadFile(zlUploadService) {
    return {
      restrict: 'E',
      replace: true,
      template: function template(element) {
        var multiple = element.parent()[0].hasAttribute('multiple') ? 'multiple' : '';
        var autosubmit = element.parent()[0].hasAttribute('autosubmit') ? '' : '<button class="submit-file">Upload</button>';
        var htmlText = '<div class="div-file-container"><p><input type="file" accept="*" ' + multiple + '/></p>' + autosubmit + '<zl-progress-bar></zl-progress-bar></div>';
        return htmlText;
      },
      link: function link(scope, element, attrs) {
        // on change event listener
        element.bind('change', function () {
          var e = element.find('input')[0].files;
          if (e) {
            // start upload upload->UploadFile
            zlUploadService.upload(e, function (complete) {
              console.log(complete);
            });
          }
        }); //change
      }
    };
  }

  angular.module('90Tech.zlUpload').directive('zlProgressBar', zlProgressBar);

  function zlProgressBar($q, zlUploadService) {
    return {
      restrict: 'E',
      template: "<div class='progress-bar'><div class='progress-bar-bar'></div><zl-cancel-button></zl-cancel-button><div>",
      link: function link($scope, element, attrs) {

        // on upload progression, update progressionBar view
        $scope.$on('handleUploadBroadcast', function (e, progress) {
          updateProgress(progress);
          console.log(progress);
        });
        function updateProgress(progress) {
          document.getElementsByClassName('progress-bar-bar')[0].style.width = progress + "%";
        }
      }
    };
  }

  angular.module('90Tech.zlUpload').directive('zlCancelButton', zlCancelButton);

  function zlCancelButton($q, zlUploadService) {
    return {
      restrict: 'E',
      scope: {
        showCancelButton: '@',
        uploadCancel: '&'

      },
      template: "<button ng-show='showCancelButton' ng-click='uploadCancel();'>{{showCancelButton}}</button>",
      link: function link($scope, element, attrs) {

        // by default, hide cancel button
        $scope.showCancelButton = false;

        // on upload progression, update progressionBar view
        $scope.$on('handleUploadState', function (e, showListener) {
          $scope.showCancelButton = showListener;
          $scope.$apply();

          // need to update view
          console.log($scope.showCancelButton);
        });

        // cancel upload button listener
        $scope.uploadCancel = function (cancelUpload) {
          zlUploadService.uploadCancel();
        };
      }
    };
  }
})();
},{}],3:[function(require,module,exports){
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
  zlUploadService.$inject = ["$http", "$q", "$timeout", "$rootScope"];
  angular.module('90Tech.zlUpload').service('zlUploadService', zlUploadService);

  function zlUploadService($http, $q, $timeout, $rootScope) {
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
    function upload(e) {
      var slice = Array.prototype.slice;
      /*  Wait all files to be read then do stuff 
        1 - convert Filelist object to an array of file with call( [File][File][File])
        2 - then call the readFile method of the zlUpload service 
        for each element of converted array with map([zlUploadService.uploadFile(File)][zlUploadService.uploadFile(File)]) 
      */

      // show cancel button & others stuffs
      broadCastUploadState(true);

      $q.all(slice.call(e).map(uploadFile)).then(function () {
        console.log('all files uploaded');
        // hide cancel button & others stuffs
        $timeout(function () {
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
    function uploadFile(files, progressCb) {

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
        $rootScope.$apply(function () {
          deferred.reject(msg);
        });
      };

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

    function addFile() {};

    function deleteFile() {};

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
    function broadCastUploadProgress(uploadProgression) {
      $rootScope.$broadcast('handleUploadBroadcast', uploadProgression);
    };

    /**
     * @ngdoc service
     * @name zlUploadService#broadCastStartingUpload
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @param {Bool} Boolean of progression div
     * @description Notify the state of the upload
    */
    function broadCastUploadState(startUploadBoolean) {
      $rootScope.$broadcast('handleUploadState', startUploadBoolean);
    };

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
      setUrl: setUrl,
      uploadCancel: uploadCancel
    });
  }
})();
},{}],4:[function(require,module,exports){
"use strict";

angular.module("90Tech.zlUpload", []).config([
// register an event listener on the XMLHttpRequest object for the event that is “in progress.”
function () {
    XMLHttpRequest.prototype.setRequestHeader = (function (sup) {
        return function (header, value) {
            if (header === "__XHR__" && angular.isFunction(value)) value(this);else sup.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.setRequestHeader);
}]);
},{}]},{},[1]);
