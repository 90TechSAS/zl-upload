(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _servicesUploadService = require('./services/upload.service');

var _servicesUploadService2 = _interopRequireDefault(_servicesUploadService);

var _directivesUploadDirective = require('./directives/upload.directive');

var _directivesUploadDirective2 = _interopRequireDefault(_directivesUploadDirective);
},{"./directives/upload.directive":2,"./services/upload.service":3}],2:[function(require,module,exports){
/**
 * Created by Renaud ROHLINGER on 22/01/2016.
 * Upload Directive 
 */

'use strict';

(function () {

    'use strict';

    zlUploadDragAndDrop.$inject = ["$http", "$q", "zlUploadService"];
    zlProgressBar.$inject = ["$q"];
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
},{}],3:[function(require,module,exports){
/**
 * Created by Renaud ROHLINGER on 25/01/2016.
 * Upload Service
 */

'use strict';

(function () {
    'use strict';

    zlUploadService.$inject = ["$http", "$q"];
    angular.module('90Tech.zlUpload', []).service('zlUploadService', zlUploadService);

    function zlUploadService($http, $q) {
        var vm = this;
        var url = '';
        //
        function readFile(file) {
            /* var deferred = $q.defer();
             // Html5 object allowing to read asynchronously multiples files 
             var read = new FileReader()
                 read.onload = function(e) {
                     deferred.resolve(e.target.result);
                 }
                 read.onerror = function(e) {
                     deferred.reject(e);
                 }
               // if image = FileReader.readAsDataURL()
             read.result(file);
             return deferred.promise;*/
            return file;
        };

        function uploadFile(files) {

            var data = new FormData();
            data.append("files", files);

            $http.post(vm.url, data, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function () {
                console.log("Uploaded");
            }).error(function () {
                console.log("Error");
            });
        };

        function addFile() {};

        function deleteFile() {};
        function setUrl(url) {
            vm.url = url;
        };
        function getUrl() {
            return vm.url;
        };

        _.assign(vm, {
            uploadFile: uploadFile,
            setUrl: setUrl
        });
    }
})();
},{}]},{},[1]);
