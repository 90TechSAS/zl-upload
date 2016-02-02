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
  zlSubmitButton.$inject = ["$q", "zlUploadService"];
  zlProgressBar.$inject = ["$q", "zlUploadService"];
  zlCancelRetry.$inject = ["$q", "$compile", "zlUploadService"];
  zlCancelButton.$inject = ["$q", "zlUploadService"];
  zlRetryButton.$inject = ["$q", "zlUploadService"];
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

  /* drag & drop upload file directive */
  angular.module('90Tech.zlUpload').directive('zlUploadDragAndDrop', zlUploadDragAndDrop);

  function zlUploadDragAndDrop(zlUploadService) {
    return {
      restrict: 'E',
      replace: true,
      template: function template(element) {
        var autosubmit = element.parent()[0].hasAttribute('autosubmit') ? '' : '<zl-submit-button></zl-submit-button>';
        var htmlText = '<div class="div-file-container drop-div"><p>{{uploadFileDropText}}</p> ' + autosubmit + '<div class="progress-container"></div></div>';
        return htmlText;
      },
      link: function link($scope, element, attrs) {
        var dropdiv = angular.element(document.querySelector('.drop-div'));

        $scope.uploadFileDropText = "Drag files here";

        element.on('dragover', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
        element.on('dragenter', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropdiv.addClass('dragover');
        });
        element.on('dragleave', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropdiv.removeClass('dragover');
        });
        element.on('drop', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropdiv.removeClass('dragover');

          var files = e.dataTransfer.files;

          _.defer(function () {
            $scope.uploadFileDropText = files.length + " Files selected";
            $scope.$apply();
          });

          console.log($scope.uploadFileDropText);

          zlUploadService.setFiles(files);

          if (element.parent()[0].hasAttribute('autosubmit')) {
            _.defer(function () {
              $scope.uploadFileDropText = "Uploading...";
              $scope.$apply();
            });

            // start upload upload->UploadFile
            zlUploadService.upload(zlUploadService.getFiles(), $scope);
          }
        });
      }
    };
  }

  /* upload file directive */
  angular.module('90Tech.zlUpload').directive('zlUploadFile', zlUploadFile);

  function zlUploadFile(zlUploadService) {
    return {
      restrict: 'E',
      replace: true,
      template: function template(element) {
        var multiple = element.parent()[0].hasAttribute('multiple') ? 'multiple' : '';
        var autosubmit = element.parent()[0].hasAttribute('autosubmit') ? '' : '<button class="submit-file">Upload</button>';
        var htmlText = '<div class="div-file-container"><p><input type="file" accept="*" ' + multiple + '/></p>' + autosubmit + '<div class="progress-container"></div></div>';
        return htmlText;
      },
      link: function link($scope, element, attrs) {

        // on change event listener
        element.bind('change', function () {

          zlUploadService.setFiles(element.find('input')[0].files);
          if (zlUploadService.getFiles()) {
            zlUploadService.upload(zlUploadService.getFiles(), $scope);
          }
        }); //change listener
      }
    };
  }

  /* progressbar cancel button directive. Parent : zlCancelRetry */
  angular.module('90Tech.zlUpload').directive('zlSubmitButton', zlSubmitButton);

  function zlSubmitButton($q, zlUploadService) {
    return {
      restrict: 'E',
      template: '<button class="submit-file" ng-click="clickToSubmit();">Upload</button>',
      link: function link($scope, element, attrs) {

        $scope.clickToSubmit = function () {
          $scope.uploadFileDropText = " Uploading...";
          zlUploadService.upload(zlUploadService.getFiles(), $scope);
        };
      }
    };
  }

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular.module('90Tech.zlUpload').directive('zlProgressBar', zlProgressBar);

  function zlProgressBar($q, zlUploadService) {
    return {
      restrict: 'EA',
      scope: {
        fileData: '='
      },
      template: function template() {

        var htmlText = "<div class='progress-bar'><div id='progress-state'>{{fileData.file.name}} : {{fileData.progress}} %</div><div style='width:{{fileData.progress}}%;' class='progress-bar-bar'></div><zl-cancel-retry id='zl-cancel-retry-{{fileData.id}}'></zl-cancel-retry>";
        return htmlText;
      },
      link: function link($scope, element, attrs) {

        $scope.$watch(function () {
          return $scope.fileData.progress;
        }, function (newValue) {
          if (angular.equals(newValue, 100)) {
            _.defer(function () {
              angular.element(document.querySelector('#zl-cancel-retry-' + $scope.fileData.id)).empty();
              $scope.$apply();
            });
          }
        }, true);
      }
    };
  }
  /* progressbar buttons directive. Parent : zlProgressBar */
  angular.module('90Tech.zlUpload').directive('zlCancelRetry', zlCancelRetry);

  function zlCancelRetry($q, $compile, zlUploadService) {
    return {
      restrict: 'E',
      template: "",
      link: function link($scope, element, template) {

        swapBtn(true);

        $scope.$watch(function () {
          return $scope.fileData.cancel;
        }, function (newValue, oldValue) {
          if (!angular.equals(oldValue, newValue)) {
            swapBtn(newValue);
          }
        }, true);

        function swapBtn(cancelOrRetry) {
          var appendBtn = cancelOrRetry ? '</div><zl-cancel-button></zl-cancel-button><div>' : '</div><zl-retry-button></zl-retry-button><div>';

          _.defer(function () {
            element.empty();
            element.append($compile(appendBtn)($scope));
            $scope.$apply();
          });
        }
      }
    };
  }

  /* progressbar cancel button directive. Parent : zlCancelRetry */
  angular.module('90Tech.zlUpload').directive('zlCancelButton', zlCancelButton);

  function zlCancelButton($q, zlUploadService) {
    return {
      restrict: 'E',
      template: "<button id='cancelUploadButton' ng-click='uploadCancel();'>cancel</button>",
      link: function link($scope, element, attrs) {

        // cancel upload button listener
        $scope.uploadCancel = function () {
          zlUploadService.uploadCancel($scope.fileData.request);
          _.defer(function () {
            $scope.fileData.cancel = false;
            $scope.$apply();
          });
        };
      }
    };
  }

  /* progressbar retry button directive. Parent : zlCancelRetry */
  angular.module('90Tech.zlUpload').directive('zlRetryButton', zlRetryButton);

  function zlRetryButton($q, zlUploadService) {
    return {
      restrict: 'E',
      template: "<button id='zlRetryButton' ng-click='uploadRetry();'>retry</button>",
      link: function link($scope, element, attrs) {
        // by default, hide cancel button

        // cancel upload button listener
        $scope.uploadRetry = function () {
          _.defer(function () {
            $scope.fileData.cancel = true;
            $scope.$apply();
          });

          zlUploadService.uploadFile($scope.fileData.file, $scope.fileData.request).then(function (done) {
            _.defer(function () {
              $scope.fileData.progressdirective.remove();
            });
          }, function (error) {
            console.log(error);
          }, function (progress) {
            // need to use timeout to ensure digest probs & then $apply() the var update to the view
            _.defer(function () {
              $scope.fileData.progress = progress;
              $scope.$apply();
            });
          });
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
  zlUploadService.$inject = ["$http", "$q", "$rootScope", "$compile"];
  angular.module('90Tech.zlUpload').service('zlUploadService', zlUploadService);

  function zlUploadService($http, $q, $rootScope, $compile) {
    var vm = this;
    var url = '';
    var files;

    /**
     * @ngdoc service
     * @name zlUploadService#upload
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @param {Filelist} The Filelist that will be upload
     * @description Manipulate Filelist to prepare for upload
    */
    function upload(e, scope) {
      var slice = Array.prototype.slice;
      var arrayUpload = slice.call(e);
      var progressContainer = angular.element(document.querySelector('.progress-container'));

      $rootScope.filesInformations = [];
      // for each file start an upload instance
      angular.forEach(arrayUpload, function (value, key) {

        // bind to scope
        var valueProp = 'value' + key;

        // create a directive for each upload & append it to the main directive (need $apply to update view)
        var directiveString = $compile('<zl-progress-bar file-data=' + valueProp + '></zl-progress-bar></div>')(scope);

        // stock each object in an array to manipulate file's informations
        $rootScope.filesInformations.push({
          'id': key + 1,
          'progress': 0,
          'file': value,
          'cancel': true,
          'progressdirective': directiveString,
          'request': new XMLHttpRequest()
        });

        scope[valueProp] = $rootScope.filesInformations[key];

        progressContainer.append($rootScope.filesInformations[key].progressdirective);
        $rootScope.filesInformations[key].cancel = true;

        // start upload deferred (get progress callback from deferred.notify)
        uploadFile(value, $rootScope.filesInformations[key].request).then(function (done) {

          _.defer(function () {
            $rootScope.filesInformations[key].progressdirective.remove();
          });
        }, function (error) {
          console.log(error);
        }, function (progress) {

          _.defer(function () {
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
    function uploadFile(files, xhr) {

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
    function setUrl(url) {
      vm.url = url;
    };

    /**
     * @ngdoc service
     * @name zlUploadService#getUrl
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @description Getter of the upload's url
    */
    function getFiles() {
      return vm.files;
    };

    /**
     * @ngdoc service
     * @name zlUploadService#setUrl
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @param {String} The Url use to upload
     * @description Setter of the upload's url
    */
    function setFiles(files) {
      vm.files = files;
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
      uploadFile: uploadFile,
      upload: upload,
      getFiles: getFiles,
      setFiles: setFiles,
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
