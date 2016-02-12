/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive
 */

(function() {

'use strict';


  zlUpload.$inject = ['$compile','$timeout','zlUploadService'];

  /* drag & drop upload file directive */
  angular
    .module('90Tech.zlUpload')
    .directive('zlUpload', zlUpload);

    function zlUpload($compile,$timeout,zlUploadService){
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          zlfDragndrop : '@',
          zlfAutosubmit : '@',
          zlfMaxFiles : '@',
          zlfMaxSizeMb : '@',
          zlfAccept : '@',
          updateUploadView : '@',
          zlfCustomSubContainer : '@'
        },
        template : `<div class="zlf-container"><div class="zlf-sub-container {{zlfDragndrop}} {{zlfCustomSubContainer}}">\
                    <span class="zlf-cloud-icon" ng-class="{'done' : updateUploadView.done.inview,'uploading' : updateUploadView.uploading.inview }" ng-show="!updateUploadView.starting.inview"></span>\
                    <zlf-file-input-el ng-show="updateUploadView.starting.inview"></zlf-file-input-el><svg ng-show="updateUploadView.uploading.inview" height="80px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet">
  <path stroke="#616161" id="outline" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"
        d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
  <path id="outline-bg" opacity="0.09" fill="none" stroke="#ededed" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"
        d="				M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
				</svg>{{uploadListenerText}}</div>\
                    <zl-submit-container ng-show="updateUploadView.ready.inview"></zl-submit-container>\
                    <div class="zlf-items-container" ng-show="updateUploadView.uploading.inview">\
                    </div><zl-progress-average ng-show="updateUploadView.uploading.inview"></zl-progress-average>\
                    </div>`,
        link: function($scope, element, attrs,controller) {

          /********************************************
          *           DOM MANAGEMENT & PARAMS         *
          ********************************************/

          var dropdiv = angular.element(document.querySelector('.div-file-container'));
          var inputfile = '';
          var multiple = '';
          var accept = '';
          var zlFileInputText = '';

          $scope.updateUploadView =
          {
            starting:{
              inview:false,
              uploadtext: ''
            },
            ready:{
              inview:false,
              uploadtext: `files selected`
            },
            uploading:{
              inview:false,
              uploadtext: ``
            },
            done:{
              inview:false,
              class:'success',
              uploadtext: `Every files are uploaded`
            },
            error:{
              inview:false,
              class:'error',
              uploadtext: ``
            }
          };

          // callback updating the view
          $scope.updateInView = function (state){
            angular.forEach($scope.updateUploadView, function(element, key) {

                  // allow to hide others views that aren't needed & show the message
                  if (element == state) {
                    _.defer(function(){
                      element.inview = true;
                      $scope.uploadListenerText = state.uploadtext;
                      $scope.zlfCustomSubContainer = '';
                      $scope.$apply();
                    });
                  }else{
                    _.defer(function(){
                      element.inview = false;
                      $scope.$apply();
                    });
                  }
            });
          }

          // callback updating the view + custom message
          $scope.updateInViewCustom = function (state,msg){
            angular.forEach($scope.updateUploadView, function(element, key) {
                  // allow to hide others views that aren't needed & show the message
                  if (element == state) {
                    console.log(state);

                    _.defer(function(){
                      element.inview = true;
                      $scope.uploadListenerText = msg;
                      $scope.zlfCustomSubContainer = state.class;
                      $timeout(function(){
                        $scope.progressAverage = 0;
                        zlUploadService.startingInview($scope.updateUploadView.starting,$scope.zlfDragndrop,$scope.updateInView);
                      },1500)
                      $scope.$apply();
                    });
                  }else{
                    _.defer(function(){
                      element.inview = false;
                      $scope.$apply();
                    });
                  }
            });
          }

          $scope.uploadToast = {};
          $scope.progressAverage = 0;
          $scope.showProgressAverage = false;



          $scope.setUploadToast = function(type,msg){
            _.defer(function(){
              $scope.uploadToast.inview = true;
              $scope.uploadToast.msg = msg;
              $scope.uploadToast.type = type;
              $timeout(function(){
                $scope.uploadToast.inview = false;
              },2000)
              $scope.$apply();
            });
          }

          if(attrs.zlfDragndrop!=undefined){
            attrs.zlfDragndrop = 'drop-div';
          }
          if(attrs.zlfAccept==undefined){
            accept = '*';
          }else{
            accept = $scope.zlfAccept;
          }

          if(attrs.zlfAutosubmit==undefined){
            var zlfAutosubmit = $compile('<zl-submit-button></zl-submit-button>')($scope);
            element.find('zl-submit-container').append(zlfAutosubmit);
          }

          if(attrs.zlfMaxFiles==undefined){
            $scope.zlfMaxFiles = 1;
            zlFileInputText = 'UPLOAD FILE';
          }else{
            multiple = 'multiple';
            zlFileInputText = 'UPLOAD FILES';
          }

          element.find('zlf-file-input-el').append($compile(`<input class="zlf-file-input" id="file" type="file" accept="${accept}" ${multiple}/><label for="file"><strong><span class="zlf-cloud-icon"></span>${zlFileInputText}</strong></label>`)($scope));

          // method called to update the view on the state starting
          zlUploadService.startingInview($scope.updateUploadView.starting,attrs.zlfDragndrop,$scope.updateInView);

          // set file url
          zlUploadService.setUrl(attrs.to);


          /*************************************
          *           FILE UPLOAD BIND         *
          **************************************/

          // file input bind -> upload procedure starting
          element.bind('change', function() {
            // set files
            var files = element.find('input')[0].files;

            callServiceUpload(files);

          });

          // drag and drop bind -> upload procedure starting
          if(!$scope.zlfDragndrop) {
            element.on('dragover', function(e) {
              e.preventDefault();
              e.stopPropagation();

            });
            element.on('dragenter', function(e) {
              e.preventDefault();
              e.stopPropagation();
              dropdiv.addClass('dragover');
            });
            element.on('dragleave', function(e) {
              e.preventDefault();
              e.stopPropagation();
              dropdiv.removeClass('dragover');
            });

            element.on('drop', function(e) {
              e.preventDefault();
              e.stopPropagation();
              dropdiv.removeClass('dragover');

              var files = e.dataTransfer.files;

              // boolean to check if user is dropping more than 1 file
              var dropMultipleFiles = files.length > 1;

              // check if the upload is already in progress or not
              if($scope.updateUploadView.starting.inview===true || $scope.updateUploadView.ready.inview===true){
                // check if there is more than 1 file
                if(dropMultipleFiles){
                    callServiceUpload(files);
                }else{
                    callServiceUpload(files);
                }
              }


            });

          }
          function extensionTest(file){
            var extensionIsSet = attrs.zlfAccept!=undefined && attrs.zlfAccept!='*';
            if(extensionIsSet){
              var acceptRegex = $scope.zlfAccept.split(',').join('|');
              var regex = new RegExp  ("([a-zA-Z0-9\s_\\.\-:])+(" + acceptRegex + ")$");
              if (!regex.test(file.name.toLowerCase())) {
                zlUploadService.errorInview($scope.updateUploadView.error,`Extensions allowed : ${$scope.zlfAccept} only.`,$scope.updateInViewCustom);
                return true;
              }else{
                return false;
              }
            }else{
              return false;
            }
          }

          // call the upload service
          function callServiceUpload(filesGetter){

            var ExceedLimit = [];

            if (filesGetter.length > $scope.zlfMaxFiles) {
              zlUploadService.errorInview($scope.updateUploadView.error,`Cannot upload ${filesGetter.length} files, maximum is ${$scope.zlfMaxFiles}`,$scope.updateInViewCustom);
              return;
            }
            for (var i = 0; i < $scope.zlfMaxFiles; i++) {
                if (i >= filesGetter.length) break;
                var file = filesGetter[i];
                if (file.size > $scope.zlfMaxSizeMb * 1048576) {
                    ExceedLimit.push(file);
                }
                if(extensionTest(filesGetter[i])){
                  return;
                }
            }

            if (ExceedLimit.length > 0) {
              zlUploadService.errorInview($scope.updateUploadView.error,`Files are larger than the specified max (${$scope.zlfMaxSizeMb}MB)`,$scope.updateInViewCustom);
              return;
            }

            // set files
            zlUploadService.setFiles(filesGetter);

            // show submit button if zlfAutosubmit is not set else start uploading
            if(attrs.zlfAutosubmit==undefined){
              zlUploadService.readyInview($scope.updateUploadView.ready,$scope.updateInView);
            }else{
              zlUploadService.uploadingInview($scope.updateUploadView.uploading,$scope,$scope.updateInView);
            }
          }
        }

      };
    }

  /* progressbar cancel button directive. Parent : zlCancelRetry */
  angular
    .module('90Tech.zlUpload')
    .directive('zlSubmitButton', zlSubmitButton);

    function zlSubmitButton($q,zlUploadService){
      return {
        restrict: 'E',
        template: '<button class="zlf-file-submit" ng-click="clickToSubmit();">Upload</button>',
        link: function ($scope, element, attrs) {
          $scope.clickToSubmit = function() {
            zlUploadService.uploadingInview($scope.updateUploadView.uploading,$scope,$scope.updateInView);
          }

        }
      };
    }

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular
    .module('90Tech.zlUpload')
    .directive('zlProgressBar', zlProgressBar);

    function zlProgressBar($compile,$q,zlUploadService){
      return {
        restrict: 'EA',
        scope: {
            fileData:'='
        },
        template: function(){
          var htmlText = `<div><div class="zlf-file-item" filetype="{{fileData.file.name.split('.').pop()}}"><span class="file-corner"></span></div>\
                          <div class='zlf-content-item'>{{fileData.file.name| limitTo : 20}}<div class='progress-state'>\
           {{fileData.progress.uploaded}}/{{fileData.size}} ({{fileData.progress.upspeed}}/sec)</div></div><zl-cancel-retry class="zlf-item-btn-container" id='zl-cancel-retry-{{fileData.id}}'></zl-cancel-retry>`;
          return htmlText;
        },
        link: function ($scope, element, attrs) {
          $scope.$watch(
            function(){ return $scope.fileData.progress; }
            ,
            function (newValue) {
              if (angular.equals(newValue.percentCompleted, 100)) {
              var btn = angular.element(document.querySelector('#zl-cancel-retry-'+$scope.fileData.id));
              var e =$compile(`<button class='zlf-btn-upload zlf-btn-success' ng-disabled='true'></button>`)($scope);
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
          },
          true);
        }
      };
    }

  /* progressbar directive. Parent : zlUploadFile/zlUploadDragAndDrop */
  angular
    .module('90Tech.zlUpload')
    .directive('zlProgressAverage', zlProgressAverage);

    function zlProgressAverage($timeout,zlUploadService){
      return {
        restrict: 'EA',
        template: "<div class='zlf-progress-average'><div style='width:{{progressAverage}}%;' class='zlf-progress-bar'></div></div>",
        link: function ($scope, element, attrs) {
          $scope.progressAverage = 0;
          $scope.showProgressAverage = false;

          $scope.$watch(
            function(){ return zlUploadService.getAverageProgress(); }
            ,
            function (newValue) {
                  _.defer(function(){
                    if (angular.equals(newValue, 100) && !angular.equals(newValue, 0)){
                      zlUploadService.doneInview($scope.updateUploadView.done,$scope.updateInViewCustom);
                      $timeout(function(){
                        $scope.progressAverage = 0;
                        zlUploadService.startingInview($scope.updateUploadView.starting,$scope.zlfDragndrop,$scope.updateInView);
                      },1500)
                    }else{
                      $scope.progressAverage = newValue;
                    }
                    $scope.$apply();
                  });
            },
            true);
        }
      };
    }

  /* progressbar buttons directive. Parent : zlProgressBar */
  angular
    .module('90Tech.zlUpload')
    .directive('zlCancelRetry', zlCancelRetry);

    function zlCancelRetry($q,$compile,zlUploadService){
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

              _.defer(function(){
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

    function zlCancelButton($q,zlUploadService){
      return {
        restrict: 'E',
        template: "<button class='zlf-btn-upload zlf-btn-cancel' ng-click='uploadCancel();'></button>",
        link: function ($scope, element, attrs) {

          // cancel upload button listener
          $scope.uploadCancel = function() {
            zlUploadService.uploadCancel($scope.fileData.request);
            _.defer(function(){
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

    function zlRetryButton($q,zlUploadService){
      return {
        restrict: 'E',
        template: "<button class='zlf-btn-upload zlf-btn-retry' ng-click='uploadRetry();'></button>",
        link: function ($scope, element, attrs) {
          // by default, hide cancel button

          // cancel upload button listener
          $scope.uploadRetry = function() {
            _.defer(function(){
                    $scope.fileData.cancel = true;
                    $scope.$apply();
            });
            var key = $scope.fileData.id-1;

            zlUploadService.emitUploadFile($scope.fileData.file,key);
          }
        }
      };
    }

})();
