
import CommonDirective from './src/app/directives/common.directive';
import CommonController from './src/app/controllers/common.controller';


var module = angular
    .module('90Tech.zlUpload', ['ui.router'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    });
