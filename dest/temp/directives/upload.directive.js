/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive
 */

'use strict';

(function () {

  'use strict';

  zlUpload.$inject = ['$compile', '$timeout', 'zlUploadService'];

  /* drag & drop upload file directive */
  angular.module('90Tech.zlUpload').directive('zlUpload', zlUpload);

  function zlUpload($compile, $timeout, zlUploadService) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        dragndrop: '@',
        autosubmit: '@',
        multiple: '@',
        updateUploadView: '@'
      },
      template: '<div class="div-file-container {{dragndrop}}"><p><zl-file-input ng-show="updateUploadView.starting.inview"></zl-file-input>' + ' {{uploadListenerText}}</p><zl-submit-container ng-show="updateUploadView.ready.inview"></zl-submit-container><div class="progress-container" ng-show="updateUploadView.uploading.inview">' + '</div><zl-progress-average class="progress-average-container" ng-show="updateUploadView.uploading.inview"></zl-progress-average></div>',
      link: function link($scope, element, attrs, controller) {

        /********************************************
        *           DOM MANAGEMENT & PARAMS         *
        ********************************************/

        var dropdiv = angular.element(document.querySelector('.div-file-container'));
        var inputfile = '';
        var multiple = '';
        var zlFileInputText = 'Choose a file';

        $scope.updateUploadView = {
          starting: {
            inview: false,
            uploadtext: 'or drag and drop here'
          },
          ready: {
            inview: false,
            uploadtext: "files selected"
          },
          uploading: {
            inview: false,
            uploadtext: "files are getting uploaded"
          },
          done: {
            inview: false,
            uploadtext: "files uploaded perfectly !"
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

        if (attrs.dragndrop != undefined) {
          attrs.dragndrop = 'drop-div';
        }

        if (attrs.autosubmit == undefined) {
          var autosubmit = $compile('<zl-submit-button></zl-submit-button>')($scope);
          element.find('zl-submit-container').append(autosubmit);
        }
        if (attrs.multiple != undefined) {
          multiple = 'multiple';
          zlFileInputText = 'Choose your files';
        }
        element.find('zl-file-input').append($compile('<input class="custom-input-file" id="file" type="file" accept="*" ' + multiple + '/><label for="file"><strong>' + zlFileInputText + '</strong></label>')($scope));

        // method called to update the view on the state starting
        zlUploadService.startingInview($scope.updateUploadView.starting, attrs.dragndrop, $scope.updateInView);

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
        if (attrs.dragndrop != undefined) {
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
                // multiple parameter is set
                if (attrs.multiple != undefined) {
                  callServiceUpload(files);
                } else {
                  alert('You can\'t upload more than 1 file');
                }
              } else {
                callServiceUpload(files);
              }
            }
          });
        }
        // call the upload service
        function callServiceUpload(filesGetter) {
          // set files
          zlUploadService.setFiles(filesGetter);

          // show submit button if autosubmit is not set else start uploading
          if (attrs.autosubmit == undefined) {
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
      template: '<button class="zl-submit-file" ng-click="clickToSubmit();">Upload</button>',
      link: function link($scope, element, attrs) {
        $scope.clickToSubmit = function () {
          zlUploadService.uploadingInview($scope.updateUploadView.uploading, $scope, $scope.updateInView);
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
        var htmlText = "<div class='progress-bar'><div style='width:{{fileData.progress}}%;' class='progress-bar-bar'></div><div class='progress-state'>{{fileData.file.name}} : {{fileData.progress}} %</div><zl-cancel-retry id='zl-cancel-retry-{{fileData.id}}'></zl-cancel-retry>";
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

  function zlProgressAverage($timeout, zlUploadService) {
    return {
      restrict: 'EA',
      template: "<div class='progress-bar average-progress-bar'><div style='width:{{progressAverage}}%;' class='progress-bar-bar'></div><div class='progress-state'>{{progressAverage}}%<div>",
      link: function link($scope, element, attrs) {
        $scope.progressAverage = 0;
        $scope.showProgressAverage = false;

        $scope.$watch(function () {
          return zlUploadService.getAverageProgress();
        }, function (newValue) {

          _.defer(function () {
            // if(newValue!=0 && $scope.showProgressAverage != true){
            //   $scope.showProgressAverage = true;
            // }
            $scope.progressAverage = newValue;
            if (angular.equals(newValue, 100) && !angular.equals(newValue, 0)) {
              zlUploadService.doneInview($scope.updateUploadView.done, $scope.updateInView);
              $timeout(function () {
                zlUploadService.startingInview($scope.updateUploadView.starting, $scope.dragndrop, $scope.updateInView);
              }, 1500);
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