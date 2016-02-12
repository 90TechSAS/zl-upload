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
  zlProgressBar.$inject = ["$compile", "$q", "zlUploadService"];
  zlProgressAverage.$inject = ["$timeout", "zlUploadService"];
  zlCancelRetry.$inject = ["$q", "$compile", "zlUploadService"];
  zlCancelButton.$inject = ["$q", "zlUploadService"];
  zlRetryButton.$inject = ["$q", "zlUploadService"];
  zlUpload.$inject = ['$compile', '$timeout', 'zlUploadService'];

  /* drag & drop upload file directive */
  angular.module('90Tech.zlUpload').directive('zlUpload', zlUpload);

  function zlUpload($compile, $timeout, zlUploadService) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        zlfDragndrop: '@',
        zlfAutosubmit: '@',
        zlfMaxFiles: '@',
        zlfMaxSizeMb: '@',
        zlfAccept: '@',
        updateUploadView: '@',
        zlfCustomSubContainer: '@'
      },
      template: '<div class="zlf-container"><div class="zlf-sub-container {{zlfDragndrop}} {{zlfCustomSubContainer}}">                    <span class="zlf-cloud-icon" ng-class="{\'done\' : updateUploadView.done.inview,\'uploading\' : updateUploadView.uploading.inview }" ng-show="!updateUploadView.starting.inview"></span>                    <zlf-file-input-el ng-show="updateUploadView.starting.inview"></zlf-file-input-el><svg ng-show="updateUploadView.uploading.inview" height="80px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet">\n  <path stroke="#616161" id="outline" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"\n        d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 \t\t\t\tc-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />\n  <path id="outline-bg" opacity="0.09" fill="none" stroke="#ededed" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"\n        d="\t\t\t\tM93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 \t\t\t\tc-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />\n\t\t\t\t</svg>{{uploadListenerText}}</div>                    <zl-submit-container ng-show="updateUploadView.ready.inview"></zl-submit-container>                    <div class="zlf-items-container" ng-show="updateUploadView.uploading.inview">                    </div><zl-progress-average ng-show="updateUploadView.uploading.inview"></zl-progress-average>                    </div>',
      link: function link($scope, element, attrs, controller) {

        /********************************************
        *           DOM MANAGEMENT & PARAMS         *
        ********************************************/

        var dropdiv = angular.element(document.querySelector('.div-file-container'));
        var inputfile = '';
        var multiple = '';
        var accept = '';
        var zlFileInputText = '';

        $scope.updateUploadView = {
          starting: {
            inview: false,
            uploadtext: ''
          },
          ready: {
            inview: false,
            uploadtext: 'files selected'
          },
          uploading: {
            inview: false,
            uploadtext: ''
          },
          done: {
            inview: false,
            'class': 'success',
            uploadtext: 'Every files are uploaded'
          },
          error: {
            inview: false,
            'class': 'error',
            uploadtext: ''
          }
        };

        // callback updating the view
        $scope.updateInView = function (state) {
          angular.forEach($scope.updateUploadView, function (element, key) {

            // allow to hide others views that aren't needed & show the message
            if (element == state) {
              _.defer(function () {
                element.inview = true;
                $scope.uploadListenerText = state.uploadtext;
                $scope.zlfCustomSubContainer = '';
                $scope.$apply();
              });
            } else {
              _.defer(function () {
                element.inview = false;
                $scope.$apply();
              });
            }
          });
        };

        // callback updating the view + custom message
        $scope.updateInViewCustom = function (state, msg) {
          angular.forEach($scope.updateUploadView, function (element, key) {
            // allow to hide others views that aren't needed & show the message
            if (element == state) {
              console.log(state);

              _.defer(function () {
                element.inview = true;
                $scope.uploadListenerText = msg;
                $scope.zlfCustomSubContainer = state['class'];
                $timeout(function () {
                  $scope.progressAverage = 0;
                  zlUploadService.startingInview($scope.updateUploadView.starting, $scope.zlfDragndrop, $scope.updateInView);
                }, 1500);
                $scope.$apply();
              });
            } else {
              _.defer(function () {
                element.inview = false;
                $scope.$apply();
              });
            }
          });
        };

        $scope.uploadToast = {};
        $scope.progressAverage = 0;
        $scope.showProgressAverage = false;

        $scope.setUploadToast = function (type, msg) {
          _.defer(function () {
            $scope.uploadToast.inview = true;
            $scope.uploadToast.msg = msg;
            $scope.uploadToast.type = type;
            $timeout(function () {
              $scope.uploadToast.inview = false;
            }, 2000);
            $scope.$apply();
          });
        };

        if (attrs.zlfDragndrop != undefined) {
          attrs.zlfDragndrop = 'drop-div';
        }
        if (attrs.zlfAccept == undefined) {
          accept = '*';
        } else {
          accept = $scope.zlfAccept;
        }

        if (attrs.zlfAutosubmit == undefined) {
          var zlfAutosubmit = $compile('<zl-submit-button></zl-submit-button>')($scope);
          element.find('zl-submit-container').append(zlfAutosubmit);
        }

        if (attrs.zlfMaxFiles == undefined) {
          $scope.zlfMaxFiles = 1;
          zlFileInputText = 'UPLOAD FILE';
        } else {
          multiple = 'multiple';
          zlFileInputText = 'UPLOAD FILES';
        }

        element.find('zlf-file-input-el').append($compile('<input class="zlf-file-input" id="file" type="file" accept="' + accept + '" ' + multiple + '/><label for="file"><strong><span class="zlf-cloud-icon"></span>' + zlFileInputText + '</strong></label>')($scope));

        // method called to update the view on the state starting
        zlUploadService.startingInview($scope.updateUploadView.starting, attrs.zlfDragndrop, $scope.updateInView);

        // set file url
        zlUploadService.setUrl(attrs.to);

        /*************************************
        *           FILE UPLOAD BIND         *
        **************************************/

        // file input bind -> upload procedure starting
        element.bind('change', function () {
          // set files
          var files = element.find('input')[0].files;

          callServiceUpload(files);
        });

        // drag and drop bind -> upload procedure starting
        if (!$scope.zlfDragndrop) {
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

            // boolean to check if user is dropping more than 1 file
            var dropMultipleFiles = files.length > 1;

            // check if the upload is already in progress or not
            if ($scope.updateUploadView.starting.inview === true || $scope.updateUploadView.ready.inview === true) {
              // check if there is more than 1 file
              if (dropMultipleFiles) {
                callServiceUpload(files);
              } else {
                callServiceUpload(files);
              }
            }
          });
        }
        function extensionTest(file) {
          var extensionIsSet = attrs.zlfAccept != undefined && attrs.zlfAccept != '*';
          if (extensionIsSet) {
            var acceptRegex = $scope.zlfAccept.split(',').join('|');
            var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + acceptRegex + ")$");
            if (!regex.test(file.name.toLowerCase())) {
              zlUploadService.errorInview($scope.updateUploadView.error, 'Extensions allowed : ' + $scope.zlfAccept + ' only.', $scope.updateInViewCustom);
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }

        // call the upload service
        function callServiceUpload(filesGetter) {

          var ExceedLimit = [];

          if (filesGetter.length > $scope.zlfMaxFiles) {
            zlUploadService.errorInview($scope.updateUploadView.error, 'Cannot upload ' + filesGetter.length + ' files, maximum is ' + $scope.zlfMaxFiles, $scope.updateInViewCustom);
            return;
          }
          for (var i = 0; i < $scope.zlfMaxFiles; i++) {
            if (i >= filesGetter.length) break;
            var file = filesGetter[i];
            if (file.size > $scope.zlfMaxSizeMb * 1048576) {
              ExceedLimit.push(file);
            }
            if (extensionTest(filesGetter[i])) {
              return;
            }
          }

          if (ExceedLimit.length > 0) {
            zlUploadService.errorInview($scope.updateUploadView.error, 'Files are larger than the specified max (' + $scope.zlfMaxSizeMb + 'MB)', $scope.updateInViewCustom);
            return;
          }

          // set files
          zlUploadService.setFiles(filesGetter);

          // show submit button if zlfAutosubmit is not set else start uploading
          if (attrs.zlfAutosubmit == undefined) {
            zlUploadService.readyInview($scope.updateUploadView.ready, $scope.updateInView);
          } else {
            zlUploadService.uploadingInview($scope.updateUploadView.uploading, $scope, $scope.updateInView);
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
      template: '<button class="zlf-file-submit" ng-click="clickToSubmit();">Upload</button>',
      link: function link($scope, element, attrs) {
        $scope.clickToSubmit = function () {
          zlUploadService.uploadingInview($scope.updateUploadView.uploading, $scope, $scope.updateInView);
        };
      }
    };
  }

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular.module('90Tech.zlUpload').directive('zlProgressBar', zlProgressBar);

  function zlProgressBar($compile, $q, zlUploadService) {
    return {
      restrict: 'EA',
      scope: {
        fileData: '='
      },
      template: function template() {
        var htmlText = '<div><div class="zlf-file-item" filetype="{{fileData.file.name.split(\'.\').pop()}}"><span class="file-corner"></span></div>                          <div class=\'zlf-content-item\'>{{fileData.file.name| limitTo : 20}}<div class=\'progress-state\'>           {{fileData.progress.uploaded}}/{{fileData.size}} ({{fileData.progress.upspeed}}/sec)</div></div><zl-cancel-retry class="zlf-item-btn-container" id=\'zl-cancel-retry-{{fileData.id}}\'></zl-cancel-retry>';
        return htmlText;
      },
      link: function link($scope, element, attrs) {
        $scope.$watch(function () {
          return $scope.fileData.progress;
        }, function (newValue) {
          if (angular.equals(newValue.percentCompleted, 100)) {
            var btn = angular.element(document.querySelector('#zl-cancel-retry-' + $scope.fileData.id));
            var e = $compile('<button class=\'zlf-btn-upload zlf-btn-success\' ng-disabled=\'true\'></button>')($scope);
            btn.empty();
            btn.append(e);
          }
          // if(newValue.upspeed==undefined){
          //   $scope.fileData.upspeed = 0;
          // }
          // if (angular.equals(newValue.percentCompleted, 100)) {
          //     _.defer(function(){
          //       angular.element(document.querySelector('#zl-cancel-retry-'+$scope.fileData.id)).empty();
          //       $scope.$apply();
          //     });
          // }
        }, true);
      }
    };
  }

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular.module('90Tech.zlUpload').directive('zlProgressAverage', zlProgressAverage);

  function zlProgressAverage($timeout, zlUploadService) {
    return {
      restrict: 'EA',
      template: "<div class='zlf-progress-average'><div style='width:{{progressAverage}}%;' class='zlf-progress-bar'></div></div>",
      link: function link($scope, element, attrs) {
        $scope.progressAverage = 0;
        $scope.showProgressAverage = false;

        $scope.$watch(function () {
          return zlUploadService.getAverageProgress();
        }, function (newValue) {
          _.defer(function () {
            if (angular.equals(newValue, 100) && !angular.equals(newValue, 0)) {
              zlUploadService.doneInview($scope.updateUploadView.done, $scope.updateInViewCustom);
              $timeout(function () {
                $scope.progressAverage = 0;
                zlUploadService.startingInview($scope.updateUploadView.starting, $scope.zlfDragndrop, $scope.updateInView);
              }, 1500);
            } else {
              $scope.progressAverage = newValue;
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
      template: "<button class='zlf-btn-upload zlf-btn-cancel' ng-click='uploadCancel();'></button>",
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
      template: "<button class='zlf-btn-upload zlf-btn-retry' ng-click='uploadRetry();'></button>",
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

  zlUploadService.$inject = ["$http", "$q", "$rootScope", "$compile"];
  angular.module('90Tech.zlUpload').service('zlUploadService', zlUploadService);

  /**
   * @ngdoc service
   * @name 90Tech.zlUpload:zlUploadService
   * @description
   * # zlUploadService
   * Upload service
   *
  */
  function zlUploadService($http, $q, $rootScope, $compile) {
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
    function upload($scope) {
      var slice = Array.prototype.slice;
      var arrayUpload = slice.call(vm.getFiles());
      var progressContainer = angular.element(document.querySelector('.zlf-items-container'));

      // clean data before each new uploads
      getAllProgress = [];
      FilesInformations = [];
      progressContainer.empty();
      // for each file start an upload instance
      angular.forEach(arrayUpload, function (value, key) {
        console.log(key);
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
          'id': key + 1,
          'progress': {},
          'file': value,
          'size': size,
          'cancel': true,
          'progressdirective': directiveString,
          'request': new XMLHttpRequest()
        };

        setFilesInformations(newFilesInformations);
        $scope[valueProp] = newFilesInformations;
        progressContainer.append(newFilesInformations.progressdirective);
        newFilesInformations.cancel = true;

        // start upload deferred (get progress callback from deferred.notify)
        emitUploadFile(value, key);
      });
    }

    /**
     * @ngdoc service
     * @name zlUploadService#startingInview
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @param {Object,Boolean,Function} The Object file, the dragndrop check and the directive's function callback
     * @description Method called to update to the ready state
    */
    function startingInview(state, dragndrop, callback) {

      if (dragndrop != undefined) {
        state.uploadtext = '';
      } else {
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
    function readyInview(state, callback) {
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
    function errorInview(state, msg, callback) {
      state.inview = true;
      callback(state, msg);
    }

    /**
     * @ngdoc service
     * @name zlUploadService#uploadingInview
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @param {Object,Function} The Object file & the directive's function callback
     * @description Method called to update to the uploading state & call the upload service method
    */
    function uploadingInview(state, $scope, callback) {
      state.inview = true;
      if (vm.getFiles()) {
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
    function doneInview(state, callback) {
      state.inview = true;
      callback(state, state.uploadtext);
    }

    /**
     * @ngdoc service
     * @name zlUploadService#calculateAverageProgress
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @description Calculate the average progress (% all files uploading)
    */
    function calculateAverageProgress() {
      var total = 0;
      for (var i = 0; i < getAllProgress.length; i++) {
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
    function getAverageProgress() {
      return averageProgress;
    }

    /**
     * @ngdoc service
     * @name zlUploadService#getFilesInformations
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @description
    */
    function getFilesInformations(index) {
      return FilesInformations[index];
    }

    /**
     * @ngdoc service
     * @name zlUploadService#setFilesInformations
     * @methodOf 90Tech.zlUpload:zlUploadService
     * @description
    */
    function setFilesInformations(object) {
      var index = FilesInformationsIndex[object.id];
      if (index === undefined) {
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
    function emitUploadFile(value, index) {
      var progressContainer = angular.element(document.querySelector('.zlf-items-container'));
      var percentCompleted;
      var uploadedUpSpeed = 0;
      var lastUpTime = 0;
      var sizes = ['Bytes', 'Kb', 'Mb', 'Gb'];

      uploadFile(value, getFilesInformations(index).request).then(function (done) {
        //getFilesInformations(index).progressdirective.remove();
        console.log(getFilesInformations(index).progressdirective);
      }, function (error) {
        console.log(error);
      }, function (e) {
        var endTime = new Date().getTime();
        var upspeed = (e.loaded - uploadedUpSpeed) * 1000 / (endTime - lastUpTime);
        var i = Math.floor(Math.log(e.loaded) / Math.log(1024));
        var ispeed = Math.floor(Math.log(upspeed) / Math.log(1024));
        percentCompleted = Math.round(e.loaded / e.total * 100);

        getFilesInformations(index).progress.percentCompleted = percentCompleted;

        if (e.loaded > 0) {
          getFilesInformations(index).progress.uploaded = (e.loaded / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i];
        } else {
          getFilesInformations(index).progress.uploaded = "0 Kb";
        }

        if (upspeed > 0 && ispeed > 0) {
          getFilesInformations(index).progress.upspeed = (upspeed / Math.pow(1024, ispeed)).toPrecision(3) + ' ' + sizes[ispeed];
        } else {
          getFilesInformations(index).progress.upspeed = "0 Kb";
        }

        uploadedUpSpeed = e.loaded;
        lastUpTime = endTime;

        getAllProgress[index] = percentCompleted;
        calculateAverageProgress();
      });
    }

    // Create the XHR object.
    function createCORSRequest(xhr, method, url) {
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
    function uploadFile(files, xhr) {

      //var xhr = $rootScope.filesInformations[index].request;
      var deferred = $q.defer();
      console.log('start upload file');

      //var xhr = createCORSRequest(xhrGetter,'POST', vm.url);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          if (deferred.notify) {
            deferred.notify(e);
          }
        }
      };
      xhr.onload = function () {
        var text = xhr.responseText;
        console.log(text);
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
      xhr.open('POST', vm.url, true);
      //xhr.setRequestHeader('Content-Type','undefined');

      if (!xhr) {
        alert('CORS not supported');
        return;
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
      readyInview: readyInview,
      startingInview: startingInview,
      uploadingInview: uploadingInview,
      doneInview: doneInview,
      errorInview: errorInview,
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
