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

    zlUploadFile.$inject = ["zlUploadService"];
    zlProgressBar.$inject = ["$q", "zlUploadService"];
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
                        zlUploadService.upload(e.dataTransfer.files);
                    }
                });
            }
        };
    };

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
                        zlUploadService.upload(e);
                    }
                }); //change
            }
        };
    };

    angular.module('90Tech.zlUpload').directive('zlProgressBar', zlProgressBar);

    function zlProgressBar($q, zlUploadService) {

        return {
            restrict: 'E',
            template: "<div class='progress-bar'>" + "<div class='progress-bar-bar'></div>" + "</div>",

            link: function link($scope, element, attrs) {
                /*         var progress = zlUploadService.getProgressStatus();
                         function updateProgress(progress) {
                            document.getElementsByClassName('progress-bar-bar')[0].style.width = progress+"%";
                         }
                         $scope.$watch(progress, updateProgress(progress));*/

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

    /**
     * @ngdoc service
     * @name 90Tech.zlUpload:zlUploadService
     * @description
     * # zlUploadService
     * Upload service
     *
    */
    zlUploadService.$inject = ["$http", "$q", "$rootScope"];
    angular.module('90Tech.zlUpload').service('zlUploadService', zlUploadService);

    function zlUploadService($http, $q, $rootScope) {
        var vm = this;
        var url = '';
        // Array File Management TODO
        var ArrayFiles = [];

        // Preview mode | Delete ?
        function readFile(file) {
            /* var deferred = $q.defer();
             var read = new FileReader()
                 read.onload = function(e) {
                     deferred.resolve(e.target.result);
                 }
                 read.onerror = function(e) {
                     deferred.reject(e);
                 }
               read.result(file);
             return deferred.promise;*/
            return file;
        };

        /**
         * @ngdoc service
         * @name zlUploadService#uploadFile
         * @methodOf 90Tech.zlUpload:zlUploadService
         * @param {File} The file to upload
         * @description Upload File method
        */
        function uploadFile(files) {

            var data = new FormData(),
                xhr = new XMLHttpRequest();
            data.append("files", files);
            /*
                                $http.post(vm.url,data,{
                                    withCredentials: true,
                                    headers: {
                                        // custom header while waiting AngularJs to make $xhrFactory service (soon)
                                        __XHR__: function() {
                                            return function(xhr) {
                                                xhr.upload.addEventListener("progress", function(event) {
                                                    setProgressStatus((event.loaded/event.total) * 100);
                                                    vm.progressStatus = (event.loaded/event.total) * 100;
                                                    $rootScope.$apply();
                                                });
                                            };
                                        },
                                    },
                                    transformRequest: angular.identity
                                }).success(function() {
                                    console.log("Uploaded");
                                }).error(function() {
                                    console.log("Error");
                                });*/
            xhr.onloadstart = function () {
                console.log('Factory: upload started: ');
            };

            // When the request has failed.
            xhr.onerror = function (e) {};

            // Send to server, where we can then access it with $_FILES['file].
            xhr.open('POST', vm.url);
            xhr.send(data);
        };

        /**
         * @ngdoc service
         * @name zlUploadService#upload
         * @methodOf 90Tech.zlUpload:zlUploadService
         * @param {Filelist} The Filelist that will be upload
         * @description Manipulate Filelist to prepare for upload
        */
        function upload(e) {

            var slice = Array.prototype.slice;
            /*  Wait all files to be read then do stuff 
              1 - convert Filelist object to an array of file with call( [File][File][File])
              2 - then call the readFile method of the zlUpload service 
              for each element of converted array with map([zlUploadService.uploadFile(File)][zlUploadService.uploadFile(File)]) 
            */
            $q.all(slice.call(e).map(uploadFile)).then(function () {});
        }

        function addFile() {};

        function deleteFile() {};

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
        function getUrl() {
            return vm.url;
        };

        _.assign(vm, {
            upload: upload,
            setUrl: setUrl
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
