/**
 * Created by Ved on 2/1/2017.
 */
var app = angular.module("app", []);
app.controller("googlemapoutput", function ($scope) {

    var map;
    var mapOptions;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    $scope.initialize = function () {
        var pos = new google.maps.LatLng(39.033807, -94.576290);
        var mapOptions = {
            zoom: 10,
            center: pos
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    };
    $scope.calcRoute = function () {
        var end = document.getElementById('Source').value;
        var start = document.getElementById('Destination').value;

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                console.log(status);
            }

        });
    };

    google.maps.event.addDomListener(window, 'load', $scope.initialize);

});
app.controller("TodoController", function($scope,$window) {

    //window.localStorage.removeItem('udata');
    $scope.saved = localStorage.getItem('udata');

    var accessData = window.localStorage['udata'];
    //window.alert($scope.saved+accessData);
    $scope.checklogin = function () {
        $scope.saved = localStorage.getItem('udata');
        if (localStorage.getItem('udata') === null) {
            window.alert("NO User data found on localstorage!");
        }
        else
        {
            $scope.users = JSON.parse($scope.saved);
            console.log($scope.saved);
            console.log($scope.users);
            window.alert($scope.users);
            window.alert($scope.saved);
            var i=0;
            angular.forEach($scope.saved, function(user){
                i++;
                window.alert(user);
                window.alert(user.username+":"+user.password+"   i: "+i);
               if((user.username === $scope.username) && (user.password === $scope.password))
                {
                    $window.location.href = '../Front_end/home.html';
                }
            });

            //window.alert("User data is not found on localstorage!");
        }
    };

    $scope.register = function () {
        $scope.saved = localStorage.getItem('udata');
        var accessData = window.localStorage['udata'];
        window.alert("in register "+$scope.saved+accessData+$scope.username+$scope.password);

        if (localStorage.getItem('udata') === null) {

            $scope.udata = "[{\"username\":\""+$scope.username+"\",\"password\":\""+$scope.password+"\"}]";
            localStorage.setItem('udata', JSON.stringify($scope.udata));
            window.localStorage['udata'] = angular.toJson($scope.udata);
            $window.location.href = '../Front_end/login.html';
        }
        else
        {
            $scope.udata = JSON.parse($scope.saved);
            $scope.udata1 = "{\"username\":\""+$scope.username+"\",\"password\":\""+$scope.password+"\"}";
            $scope.udata.push($scope.udata1);
            window.alert("data to write: " + udata);
            localStorage.setItem('udata', JSON.stringify($scope.udata));
            //window.localStorage['udata'] = angular.toJson($scope.udata);
            $window.location.href = '../Front_end/login.html';
        }
    };

});

app.controller("googlemapoutput", function ($scope) {

    var map;
    var mapOptions;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    $scope.initialize = function () {
        var pos = new google.maps.LatLng(39.033807, -94.576290);
        var mapOptions = {
            zoom: 10,
            center: pos
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    };
    $scope.calcRoute = function () {
        var start = document.getElementById('Source').value;
        var end = document.getElementById('Destination').value;

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                console.log(status);
            }

        });
    };

    google.maps.event.addDomListener(window, 'load', $scope.initialize);

});

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, model) {
            scope.location = new google.maps.places.Autocomplete(element[0]);

            google.maps.event.addListener(scope.location, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

app.controller('weatherctrl', function($scope, $http) {

    $scope.getWeather = function() {
        $http.get('https://api.wunderground.com/api/36b799dc821d5836/conditions/q/MO/Kansas%20City.json').success(function(data) {
            console.log(data);
            temp = data.current_observation.temp_f;
            icon = data.current_observation.icon_url;
            weather = data.current_observation.weather;
            console.log(temp);
            $scope.settext = "Currently " + temp + " F and " + weather + "";
            $scope.currentweather = {
                html: "Currently " + temp + " &deg; F and " + weather + ""
            }
            $scope.currentIcon = {
                html: "<img src='" + icon + "'/>"
            }

        })
    }

});