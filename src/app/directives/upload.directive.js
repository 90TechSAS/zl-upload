/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive 
 */

(function() {

'use strict';

  angular
    .module('90Tech.zlUpload')
    .directive('zlUpload', zlUpload);

    zlUpload.$inject = ['zlUploadService'];

    function zlUpload(zlUploadService){    
      return {
        restrict: 'E',
        transclude: true,
        template: function(element){
          var uploadMethod = element[0].hasAttribute('dragndrop') 
              ? '<zl-upload-drag-and-drop></zl-upload-drag-and-drop>' 
              : '<zl-upload-file></zl-upload-file>';
          return uploadMethod;
        },
        link : function(scope, element, attrs, ngModel) {
            // Set url to upload
          zlUploadService.setUrl(attrs.to);
        } // link
      }; // return
    };

  zlUploadDragAndDrop.$inject = ['zlUploadService'];
  
  /* drag & drop upload file directive */
  angular
    .module('90Tech.zlUpload')
    .directive('zlUploadDragAndDrop', zlUploadDragAndDrop);

    function zlUploadDragAndDrop(zlUploadService){    
      return {
        restrict: 'E',
        replace: true,
        template: function(element){
          var autosubmit = element.parent()[0].hasAttribute('autosubmit') 
            ? '' 
            : '<button class="submit-file">Upload</button>';
          var htmlText = '<div class="div-file-container drop-div"><p>Drag your files here to upload</p> '+autosubmit+'<div class="progress-container"></div></div>';
          return htmlText;
        },
        link: function($scope, element, attrs) {
          element.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
          });
          element.on('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
          });
          element.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Multiple files condition
            if (element.parent()[0].hasAttribute('multiple')){
                    console.log('multiple upload');
            } else{

            }
            if (e){
              // start upload upload->UploadFile
              zlUploadService.upload(e.dataTransfer.files,$scope);
            }
          });
        }
      };
    }

  /* upload file directive */
  angular
    .module('90Tech.zlUpload')
    .directive('zlUploadFile', zlUploadFile);

    function zlUploadFile(zlUploadService,$q,$compile,$rootScope,$timeout){    
      return {
        restrict: 'E',
        replace: true,
        template: function(element){
          var multiple = element.parent()[0].hasAttribute('multiple') 
            ? 'multiple' 
            : '';
          var autosubmit = element.parent()[0].hasAttribute('autosubmit') 
            ? '' 
            : '<button class="submit-file">Upload</button>';
          var htmlText = '<div class="div-file-container"><p><input type="file" accept="*" '+multiple+'/></p>'+autosubmit+'<div class="progress-container"></div></div>';
          return htmlText;
        },
        link: function($scope, element, attrs) {



          // on change event listener
          element.bind('change', function() {
            var e = element.find('input')[0].files;

            if (e){
              zlUploadService.upload(e,$scope);
            }

          }); //change listener

        }
      };
    }

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular
    .module('90Tech.zlUpload')
    .directive('zlProgressBar', zlProgressBar);

    function zlProgressBar($q,$timeout,zlUploadService){    
      return {
        restrict: 'EA',
        scope: {
            fileData:'='
        },
        template: function(){

          var htmlText = "<div class='progress-bar'><div id='progress-state'>{{fileData.file.name}} : {{fileData.progress}} %</div><div style='width:{{fileData.progress}}%;' class='progress-bar-bar'></div><zl-cancel-retry id='zl-cancel-retry-{{fileData.id}}'></zl-cancel-retry>";  
          return htmlText;
        },
        link: function ($scope, element, attrs) {

            $scope.$watch(
              function(){ return $scope.fileData.progress; }
              ,
              function (newValue) {
                if (angular.equals(newValue, 100)) {
                    $timeout(function(){
                      angular.element(document.querySelector('#zl-cancel-retry-'+$scope.fileData.id)).empty();
                      $scope.$apply(); 
                    });
                }
            },
            true);

          }
        };
      }  
  /* progressbar buttons directive. Parent : zlProgressBar */
  angular
    .module('90Tech.zlUpload')
    .directive('zlCancelRetry', zlCancelRetry);

    function zlCancelRetry($q,$timeout,$compile,zlUploadService){    
      return {
        restrict: 'E',
        template: "",    
        link: function ($scope,element, template) {

            swapBtn(true);

            $scope.$watch(
              function(){ return $scope.fileData.cancel; }
              ,
              function (newValue, oldValue) {
                if (!angular.equals(oldValue, newValue)) {
                    swapBtn(newValue);
                }
            },
            true);

            function swapBtn(cancelOrRetry){
              var appendBtn = cancelOrRetry
              ? '</div><zl-cancel-button></zl-cancel-button><div>' 
              : '</div><zl-retry-button></zl-retry-button><div>'; 

              $timeout(function(){
                element.empty();
                element.append($compile(appendBtn)($scope));
                $scope.$apply(); 
              });
                 
            }
        }
      };
    }

  /* progressbar cancel button directive. Parent : zlCancelRetry */
  angular
    .module('90Tech.zlUpload')
    .directive('zlCancelButton', zlCancelButton);

    function zlCancelButton($q,$timeout,zlUploadService){    
      return {
        restrict: 'E',
        template: "<button id='cancelUploadButton' ng-click='uploadCancel();'>cancel</button>",    
        link: function ($scope, element, attrs) {

          // cancel upload button listener
          $scope.uploadCancel = function() {
            zlUploadService.uploadCancel($scope.fileData.request);
            $timeout(function(){
                    $scope.fileData.cancel = false;
                    $scope.$apply();
            });
          }
        }
      };
    }

  /* progressbar retry button directive. Parent : zlCancelRetry */
  angular
    .module('90Tech.zlUpload')
    .directive('zlRetryButton', zlRetryButton);

    function zlRetryButton($q,$timeout,zlUploadService){    
      return {
        restrict: 'E',
        template: "<button id='zlRetryButton' ng-click='uploadRetry();'>retry</button>",    
        link: function ($scope, element, attrs) {
          // by default, hide cancel button

          // cancel upload button listener
          $scope.uploadRetry = function() {
            $timeout(function(){
                    $scope.fileData.cancel = true;
                    $scope.$apply();
            });

            zlUploadService.uploadFile($scope.fileData.file,$scope.fileData.request)
              .then(function(done) {
                  $timeout(function(){
                    $scope.fileData.progressdirective.remove();
                  });
                }, function(error) {
                    console.log(error);
                },  function(progress) {
                  // need to use timeout to ensure digest probs & then $apply() the var update to the view
                  $timeout(function(){
                    $scope.fileData.progress = progress;
                    $scope.$apply();
                  });
                });
          }
        }
      };
    }

})();