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

  zlSubmitButton.$inject = ["$q", "zlUploadService"];
  zlProgressBar.$inject = ["$q", "zlUploadService"];
  zlProgressAverage.$inject = ["zlUploadService"];
  zlCancelRetry.$inject = ["$q", "$compile", "zlUploadService"];
  zlCancelButton.$inject = ["$q", "zlUploadService"];
  zlRetryButton.$inject = ["$q", "zlUploadService"];
  zlUpload.$inject = ['$compile', 'zlUploadService'];

  /* drag & drop upload file directive */
  angular.module('90Tech.zlUpload').directive('zlUpload', zlUpload);

  function zlUpload($compile, zlUploadService) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        dragndrop: '@',
        autosubmit: '@',
        multiple: '@'
      },
      template: '<div class="div-file-container {{dragndrop}}"><p><zl-file-input></zl-file-input>' + '{{uploadFileText}}</p><zl-submit-container></zl-submit-container><div class="progress-container">' + '</div><zl-progress-average class="progress-average-container"></zl-progress-average></div>',
      link: function link($scope, element, attrs) {

        var dropdiv = angular.element(document.querySelector('.div-file-container'));
        var inputfile = '';
        var multiple = '';

        if (attrs.dragndrop != undefined) {
          attrs.dragndrop = 'drop-div';
          $scope.uploadFileText = " or drag & drop";
        }
        if (attrs.autosubmit == undefined) {
          var autosubmit = $compile('<zl-submit-button ng-show="showUpload"></zl-submit-button>')($scope);
          element.find('zl-submit-container').append(autosubmit);
        }
        if (attrs.multiple != undefined) {
          multiple = 'multiple';
        }
        element.find('zl-file-input').append($compile('<input class="custom-input-file" id="file" type="file" accept="*" ' + multiple + '/><label for="file"><strong>Choose a file</strong></label>')($scope));

        // set file url
        zlUploadService.setUrl(attrs.to);

        // file on change listener
        element.bind('change', function () {

          // show submit button if autosubmit is not set
          if (attrs.autosubmit == undefined) {
            $scope.showUpload = true;
          }

          // set files
          var files = element.find('input')[0].files;

          _.defer(function () {
            $scope.uploadFileText = ' - ' + files.length + ' files selected';
            $scope.$apply();
          });

          zlUploadService.setFiles(files);
          upload(files);
        });

        // if dragndrop start listeners
        if (attrs.dragndrop != undefined) {
          console.log(element);
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

            // show submit button if autosubmit is not set
            if (attrs.autosubmit == undefined) {
              $scope.showUpload = true;
            }
            var files = e.dataTransfer.files;

            _.defer(function () {
              $scope.uploadFileText = ' - ' + files.length + ' files selected';
              $scope.$apply();
            });

            // set files
            zlUploadService.setFiles(files);
            upload(files);
          });
        }

        function upload(files) {
          // autosubmit & files are ok
          if (attrs.autosubmit != undefined && zlUploadService.getFiles()) {
            _.defer(function () {
              $scope.uploadFileText = "Uploading...";
              $scope.showUpload = false;
              $scope.$apply();
              zlUploadService.upload(files, $scope);
            });
          }
        }
      }
    };
  }

  /* progressbar cancel button directive. Parent : zlCancelRetry */
  angular.module('90Tech.zlUpload').directive('zlSubmitButton', zlSubmitButton);

  function zlSubmitButton($q, zlUploadService) {
    return {
      restrict: 'E',
      template: '<button class="zl-submit-file" ng-click="clickToSubmit();">Upload</button>',
      link: function link($scope, element, attrs) {

        $scope.clickToSubmit = function () {
          $scope.uploadFileText = " Uploading...";
          $scope.showUpload = false;
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
        var htmlText = "<div class='progress-bar'><div class='progress-state'>{{fileData.file.name}} : {{fileData.progress}} %</div><div style='width:{{fileData.progress}}%;' class='progress-bar-bar'></div><zl-cancel-retry id='zl-cancel-retry-{{fileData.id}}'></zl-cancel-retry>";
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

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular.module('90Tech.zlUpload').directive('zlProgressAverage', zlProgressAverage);

  function zlProgressAverage(zlUploadService) {
    return {
      restrict: 'EA',
      template: "<div ng-show='showProgressAverage' class='progress-bar average-progress-bar'><div class='progress-state'>Progression : {{progressAverage}}<div><div style='width:{{progressAverage}}%;' class='progress-bar-bar'></div>",
      link: function link($scope, element, attrs) {
        $scope.progressAverage = 0;
        $scope.showProgressAverage = false;

        $scope.$watch(function () {
          return zlUploadService.getAverageProgress();
        }, function (newValue) {

          _.defer(function () {
            if (newValue != 0 && $scope.showProgressAverage != true) {
              $scope.showProgressAverage = true;
            }
            $scope.progressAverage = newValue;
            if (angular.equals(newValue, 100) && !angular.equals(newValue, 0)) {
              $scope.uploadFileText = " or drag & drop";
              $scope.showUpload = true;
              $scope.showProgressAverage = false;
            }
            $scope.$apply();
          });
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
      template: "<button class='cancel-upload-button' ng-click='uploadCancel();'>cancel</button>",
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
      template: "<button class='retry-upload-button' ng-click='uploadRetry();'>retry</button>",
      link: function link($scope, element, attrs) {
        // by default, hide cancel button

        // cancel upload button listener
        $scope.uploadRetry = function () {
          _.defer(function () {
            $scope.fileData.cancel = true;
            $scope.$apply();
          });
          var key = $scope.fileData.id - 1;
          zlUploadService.emitUploadFile($scope.fileData.file, key);
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
    var getAllProgress = [];
    var averageProgress = 0;
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

      // clean data before each new uploads
      getAllProgress = [];
      $rootScope.filesInformations = [];

      //$rootScope.getAllProgress = [];
      // for each file start an upload instance
      angular.forEach(arrayUpload, function (value, key) {

        // bind to scope
        var valueProp = 'value' + key;

        // create a directive for each upload & append it to the main directive (need $apply to update view)
        var directiveString = $compile('<zl-progress-bar file-data=' + valueProp + '></zl-progress-bar></div>')(scope);

        // stock each object in an array to manipulate file's informations
        getAllProgress.push(0);

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
        emitUploadFile(value, key);
      });
    }

    function calculateAverageProgress() {
      var total = 0;
      for (var i = 0; i < getAllProgress.length; i++) {
        total += getAllProgress[i];
      }
      averageProgress = Math.round(total / getAllProgress.length);
    }

    function getAverageProgress() {
      return averageProgress;
    }

    function emitUploadFile(value, index) {
      uploadFile(value, $rootScope.filesInformations[index].request).then(function (done) {

        _.defer(function () {
          $rootScope.filesInformations[index].progressdirective.remove();
        });
      }, function (error) {
        console.log(error);
      }, function (progress) {

        _.defer(function () {
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
    function uploadFile(files, xhr) {

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
      emitUploadFile: emitUploadFile,
      upload: upload,
      getFiles: getFiles,
      getAllProgress: getAllProgress,
      setFiles: setFiles,
      getAverageProgress: getAverageProgress,
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
