/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive 
 */

'use strict';

(function () {

  'use strict';

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
          // need to update view
          $scope.$apply();
        });

        // cancel upload button listener
        $scope.uploadCancel = function (cancelUpload) {
          zlUploadService.uploadCancel();
        };
      }
    };
  }
})();