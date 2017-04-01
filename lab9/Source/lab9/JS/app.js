/**
 * Created by Ved on 3/18/2017.
 */
var app = angular.module('myApp', []);
app.controller('myController', function($scope,$http,$sce) {
    $scope.brands=[];
    $scope.callAPI = function() {
        medName = $scope.medName;
        console.log("medname:",medName);
        var handler = $http.get("http://localhost:9090/medAPI?name="+medName);
        handler.success(function (data) {
            $scope.brands=null;
            $scope.showIframe = false;
            $scope.brands=[];
            if (data) {
                var body = data;
                var meds = body.meds;
                for (var i = 0; i < meds.length; i++) {
                    $scope.brands.push({
                        'name': meds[i].name,
                        'rxcui': meds[i].rxcui
                    });
                }
                $scope.print = toString(data);
                console.log("fine", data);
            }

        })
        handler.error(function (data) {
            alert("There was some error processing your request. Please try after some time." + data);
        });
    };
    $scope.loadPDF = function(){
        console.log("change");
        if($scope.selectedBrand) {
            if($scope.selectedBrand.name){

                var setid;
                var handler = $http.get("http://localhost:9090/medAPI?brand="+$scope.selectedBrand.rxcui);
                handler.success(function (data) {
                    if (data) {
                        var body = data;
                        var meds = body.meds;
                        for (var i = 0; i < 1; i++) {

                            setid = meds[i].setid;
                            console.log("setid",setid);
                        }
                        console.log("setid:",setid);
                        var newurl="https://docs.google.com/viewer?url=https://dailymed.nlm.nih.gov/dailymed/downloadpdffile.cfm?setId="+setid+"&embedded=true";
                        //$scope.pdf = '';
                        console.log("newurl: ",newurl);
                        $scope.pdfURL = $sce.trustAsResourceUrl(newurl);
                        console.log($scope.url);
                        console.log($scope.pdfURL);
                        $scope.showIframe = true;
                        $scope.print = toString(data);
                        console.log("fine", data);
                    }

                });
                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time." + data);
                });

            }
        }
    };

});