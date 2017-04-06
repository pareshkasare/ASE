var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    // Sends this header with any AJAX request
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // Send this header only in post requests. Specifies you are sending a JSON object
    $http.defaults.headers.post['dataType'] = 'json'
});
myapp.controller('MongoRestController',function($scope,$http,$window){
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
            }
            var req = $http.post('http://127.0.0.1:8081/register', $scope.formData);
            req.success(function (data, status, headers, config) {

                console.log(data);
                $window.location.href = "showusers.html";

            });
            req.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
        }

    };
});