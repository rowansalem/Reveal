///<reference path="angular.min.js"/>
var myApp = angular
                .module("myModule", [])
                .controller("myController", function ($scope){
    var employee = {
        firstName: "David",
        lastName: "Hastings",
       oCourse: "Online",
        rCourse: "Classroom"
    };
    $scope.employee = employee;
});
