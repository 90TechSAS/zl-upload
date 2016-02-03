/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive 
 */

'use strict';

(function () {

  'use strict';

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