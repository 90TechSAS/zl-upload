/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive 
 */

'use strict';

(function () {

    'use strict';

    angular.module('90Tech.zlUpload').directive('zlUpload', zlUpload);

    zlUpload.$inject = ['$q', 'zlUploadService'];

    function zlUpload($q, zlUploadService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<input file-input="files" type="file" accept="*" multiple />',
            link: function link(scope, element, attrs, ngModel) {
                var slice = Array.prototype.slice;
                var url = attrs.to;

                // stop if nothing
                //if (!ngModel) return;

                // on change event listener
                element.bind('change', function () {

                    var e = element[0].files;
                    if (!e) return;
                    /*  Wait all files to be read then do stuff 
                      1 - convert Filelist object to an array of file with call( [File][File][File])
                      2 - then call the readFile method of the zlUpload service 
                      for each element of converted array with map([zlUploadService.readFile(File)][zlUploadService.readFile(File)]) 
                    */
                    if (e) {
                        $q.all(slice.call(e).map(zlUploadService.uploadFile)).then(function () {});

                        return false;
                    }
                }); //change
            } // link
        }; // return
    };

    angular.module('90Tech.zlUpload').directive('zlUploadDragAndDrop', zlUploadDragAndDrop);
    function zlUploadDragAndDrop($http, $q, zlUploadService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="asset-upload">Drag here to upload</div>',
            link: function link(scope, element, attrs) {
                var slice = Array.prototype.slice;
                zlUploadService.setUrl(attrs.to);
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

                    /*  Wait all files to be read then do stuff 
                      1 - convert Filelist object to an array of file with call( [File][File][File])
                      2 - then call the readFile method of the zlUpload service 
                      for each element of converted array with map([zlUploadService.readFile(File)][zlUploadService.readFile(File)]) 
                    */
                    if (e.dataTransfer) {
                        $q.all(slice.call(e.dataTransfer.files).map(zlUploadService.uploadFile)).then(function () {});

                        return false;
                    }
                });
            }
        };
    };

    angular.module('90Tech.zlUpload').directive('zlProgressBar', zlProgressBar);

    function zlProgressBar($q) {

        return {
            restrict: 'E',
            scope: {
                curVal: '@'
            },
            template: "<div class='progress-bar'>" + "<div class='progress-bar-bar'></div>" + "</div>",

            link: function link($scope, element, attrs) {

                function updateProgress() {
                    var progress = 0;
                    if ($scope.curVal) {
                        progress = Math.min($scope.curVal, 100);
                    }
                    document.getElementsByClassName('progress-bar-bar')[0].style.width = progress + "%";
                }
                $scope.$watch('curVal', updateProgress);
            }
        };
    };
})();