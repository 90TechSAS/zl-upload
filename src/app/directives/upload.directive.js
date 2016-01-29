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
                    var uploadMethod = element[0].hasAttribute('dragndrop') ? '<zl-upload-drag-and-drop></zl-upload-drag-and-drop>' : '<zl-upload-file></zl-upload-file>';
                    return uploadMethod;
                },
                link : function(scope, element, attrs, ngModel) {
                    // Set url to upload
                    zlUploadService.setUrl(attrs.to);

                } // link
            }; // return
         };

    zlUploadDragAndDrop.$inject = ['zlUploadService'];

    angular
        .module('90Tech.zlUpload')
        .directive('zlUploadDragAndDrop', zlUploadDragAndDrop);
        function zlUploadDragAndDrop(zlUploadService){    
            return {
                restrict: 'E',
                replace: true,
                template: function(element){
                    var autosubmit = element.parent()[0].hasAttribute('autosubmit') ? '' : '<button class="submit-file">Upload</button>';
                    var htmlText = '<div class="div-file-container drop-div"><p>Drag your files here to upload</p> '+autosubmit+'<zl-progress-bar></zl-progress-bar></div>';
                    return htmlText;
                },
                link: function(scope, element, attrs) {
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
                        if(element.parent()[0].hasAttribute('multiple')){
                                console.log('multiple upload');
                        }else{

                        }

                        if (e){
                        // start upload upload->UploadFile
                        zlUploadService.upload(e.dataTransfer.files);
                        }

                    });
                }
            };
        };

    angular
        .module('90Tech.zlUpload')
        .directive('zlUploadFile', zlUploadFile);
        function zlUploadFile(zlUploadService){    
            return {
                restrict: 'E',
                replace: true,
                template: function(element){
                    var multiple = element.parent()[0].hasAttribute('multiple') ? 'multiple' : '';
                    var autosubmit = element.parent()[0].hasAttribute('autosubmit') ? '' : '<button class="submit-file">Upload</button>';
                    var htmlText = '<div class="div-file-container"><p><input type="file" accept="*" '+multiple+'/></p>'+autosubmit+'<zl-progress-bar></zl-progress-bar></div>';
                    return htmlText;
                },
                link: function(scope, element, attrs) {


                    // on change event listener
                    element.bind('change', function() {
                        var e = element.find('input')[0].files;
                        
                        if (e){
                        // start upload upload->UploadFile
                        zlUploadService.upload(e);
                        }
                    
                    }); //change

                }
            };
        };



    angular
        .module('90Tech.zlUpload')
        .directive('zlProgressBar', zlProgressBar);

        function zlProgressBar($q,zlUploadService){    

            return {
              restrict: 'E',
              template: "<div class='progress-bar'>"+
                          "<div class='progress-bar-bar'></div>"+
                        "</div>",    

              link: function ($scope, element, attrs) {
       /*         var progress = zlUploadService.getProgressStatus();
                function updateProgress(progress) {
                   document.getElementsByClassName('progress-bar-bar')[0].style.width = progress+"%";
                }
                $scope.$watch(progress, updateProgress(progress));*/
            
              }
            };  
        };

})();