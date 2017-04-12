var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    // Sends this header with any AJAX request
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // Send this header only in post requests. Specifies you are sending a JSON object
    $http.defaults.headers.post['dataType'] = 'json'
});
/*myapp.config(function($routeProvider)
{
    $routeProvider

    // route for the home page
        .when('/showusers', {
            templateUrl : 'Source/showusers.html',
            controller  : 'Mongotablecontroller'
        });
});*/
myapp.controller('MongoRestController',function($scope,$http,$window){
    console.log("rest called:");

    $scope.formDataerror = "";
    $scope.insertData = function(){

        var validform = false;
        if($scope.formData.password === $scope.formData.cpassword){
            validform = true;
        }
        else
        {
            $scope.formDataerror = "Please check form again!! passwords not matching";
            validform = false;
        }
        console.log(validform);
        if(validform) {
            console.log(JSON.stringify($scope.formData));
            console.log($scope.formData.lname);
            console.log($scope.formData.fname);
            console.log($scope.formData.email);
            console.log($scope.formData.password);
            console.log($scope.formData.cpassword);
            var dataParams = {
                'fname': $scope.fname,
                'lname': $scope.lname,
                'email': $scope.email,
                'pw': $scope.pw
            };
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var req = $http.post('http://127.0.0.1:8081/register', $scope.formData);
            req.success(function (data, status, headers, config) {

                console.log(data);
                if(data === "Success"){
                    $window.location.href = "login.html";
                }else if(data === "DBINSERT failure"){
                    alert("registration Failed, DB error!!!");
                }
                else{
                    alert("registration Failed, User already exists!!!");
                }

                //$window.location.href = "showusers.html";

            });
            req.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
        }

    };
});
myapp.controller('MongologinController',function($scope,$http,$window){
    $scope.formDataerror = "";
    $scope.insertData = function(){

    console.log($scope.formData.email);
    console.log($scope.formData.password);

    var dataParams = {

        'email': $scope.email,
        'pw': $scope.pw
    };
    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }
    console.log("sending req");
    var req = $http.post('http://127.0.0.1:8081/login', $scope.formData);

        req.success(function (data, status, headers, config) {
            console.log("found success");
            console.log(data);

            if(data === "success"){

                console.log("found the user");
                $window.location.href = "showusers.html";
            }
            else{
                $scope.formDataerror = "Login failed!!! try registering?";
            }
        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });


    };
});
myapp.controller('MongotableController',function($scope,$http,$window){
    console.log("Controller called");

    $scope.removeUser = function(userid,email){


        var dataParams = {

            'id': userid
        };
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        console.log("sending req");
        var req = $http.post('http://127.0.0.1:8081/removeuser', {"id":userid});

        req.success(function (data, status, headers, config) {
            console.log("found success");
            console.log(data);

            if(data === "Success"){
                function findAndRemove(array, property, value) {
                    array.forEach(function(result, index) {
                        if(result[property] === value) {
                            //Remove from array
                            array.splice(index, 1);
                        }
                    });
                }

                findAndRemove($scope.users,'email', email);


            }
            else{
                $scope.formDataerror = "Login failed!!! try registering?";
            }
        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });


    };

    $scope.updateUser = function(id,fname,lname,email,pwd){

        console.log("inside update");
            console.log(lname);
            console.log(id);
            console.log(fname);
            console.log(email);
            console.log(pwd);
        var dataParams = {
            'id':id,
            'fname': fname,
            'lname': lname,
            'email': email,
            'pw': pwd
        };
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var req = $http.post('http://127.0.0.1:8081/updateUser', dataParams);
            req.success(function (data, status, headers, config) {

                console.log(data);
                if(data === "Success"){

                }else if(data === "DBINSERT failure"){
                    alert("registration Failed, DB error!!!");
                }
                else{
                    alert("registration Failed, User already exists!!!");
                }

                //$window.location.href = "showusers.html";

            });
            req.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });


    };


        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        console.log("sending req");
        var req = $http.post('http://127.0.0.1:8081/table');

        req.success(function (data, status, headers, config) {
            console.log("found success");
            console.log(data);

            if (data) {

                $scope.users = data;
            }
            else {
                $scope.formDataerror = "Login failed!!! try registering?";
            }
        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });

});