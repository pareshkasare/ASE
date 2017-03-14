angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout,$state,$ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
        $scope.loginData = {};
        $scope.regData = {};

  // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

      // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal2 = modal;
        });

  // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };
  // Triggered in the login modal to close it
        $scope.closeregister = function () {
            $scope.modal2.hide();
        };

  // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };
// Open the login modal
        $scope.register = function () {
            $scope.modal2.show();
        };
  // Perform the login action when the user submits the login form
        $scope.doregister = function () {
            console.log('Doing register');
            console.log($scope.regData.username);
            if(!$scope.regData.username){
                $ionicPopup.alert({
                 title: 'Registration Alert :(',
                 template: 'Username is empty.'
               });
            }else if(!($scope.regData.password === $scope.regData.password2) ||(!$scope.regData.password || !$scope.regData.password2)){
                                $ionicPopup.alert({
                 title: 'Registration Alert :(',
                 template: 'Passwords do not match.'
               });
               
            }else if(!$scope.regData.Fname){
                $ionicPopup.alert({
                 title: 'Registration Alert :(',
                 template: 'First name is empty.'
               });
                
            }else if (!$scope.regData.Lname){
                    $ionicPopup.alert({
                 title: 'Registration Alert :(',
                 template: 'Last name is empty.'
               });
                
            }else {
               
                $scope.modal2.hide();
                $scope.login();
                $ionicPopup.alert({ title: 'Registration Success :)',
                 template: 'Please proceed with login.'
               });
            }
                
        }
  // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
            if(!$scope.loginData.username){
                $ionicPopup.alert({
                 title: 'Login Alert :(',
                 template: 'Username is empty.'
               });
                
            }else if(!$scope.loginData.password){
                $ionicPopup.alert({
                 title: 'Login Alert :(',
                 template: 'Password is empty!!!'
               });
                
            }
            else if($scope.loginData.username == "admin" && $scope.loginData.password == "admin"){
                $state.go('app.home');
            }
      
            $timeout(function () {
                $scope.closeLogin();
                $scope.closeregister();
            }, 1000);
        };
    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    
    })
    .controller('get_vision_response', function ($scope, $http,audio) {
        $scope.getvision_response = function(){
            console.log("watson called 1: " + $scope.url);

            var url = $scope.url;
            if (url != null && url!= "")
            {
                var http_handler = $http.get("https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classify" +
                    "?api_key=0e29dd99923d25a4e1f4314e28b0c6b20695f905" +
                    "&url=" + url +
                    "&classifier_ids=default&version=2016-05-20");
            }
            http_handler.success(function (data) {
                $scope.text_to_read = "IBM Watson determines that image contains  ";
                if (data != null && data.images[0] != null){
                    //&& data.images.classifiers != undefined && data.images.classifiers != null) {

                    for (var i = 0; i < data.images[0].classifiers[0].classes.length; i++) {
                        $scope.text_to_read = $scope.text_to_read  + ",";
                        var score = data.images[0].classifiers[0].classes[i].score;
                        var search_string = data.images[0].classifiers[0].classes[i].class;
                        var search_string1 = search_string.toLowerCase();
                        var article;
                        if(score >= 0.45 && (search_string1.startsWith("a") ||search_string1.startsWith("e")
                            || search_string1.startsWith("i") || search_string1.startsWith("o")
                            || search_string1.startsWith("u"))) {
                            article = " an ";
                        }
                        else {
                            article = " a ";
                        }

                        if(score >= 0.95 && score < 1.00 )
                        {
                            $scope.text_to_read = $scope.text_to_read  + " quite confidently"
                                + article + data.images[0].classifiers[0].classes[i].class;
                        }
                        else if (data.images[0].classifiers[0].classes[i].score >= 0.85 && data.images[0].classifiers[0].classes[i].score < 0.95){

                            $scope.text_to_read = $scope.text_to_read  + " possibly"
                                +article+ data.images[0].classifiers[0].classes[i].class;

                        }
                        else if (data.images[0].classifiers[0].classes[i].score >= 0.45 && data.images[0].classifiers[0].classes[i].score < 0.85){

                            $scope.text_to_read = $scope.text_to_read  + " may be"
                                +article+ data.images[0].classifiers[0].classes[i].class;
                        }

                    }
                }
                console.log("Data fetch success : " + $scope.text_to_read);
                $scope.string_text = $scope.text_to_read;
                $scope.myVar = url;
                var http_handler2 = $http.get("https://watson-api-explorer.mybluemix.net/text-to-speech/api/v1/synthesize?accept=audio%2Fogg%3Bcodecs%3Dopus&voice=en-US_AllisonVoice" +
                    "&text="+$scope.text_to_read);
                http_handler2.success(function (data){
                    console.log("here");
                    audio.play("https://watson-api-explorer.mybluemix.net/text-to-speech/api/v1/synthesize?accept=audio%2Fogg%3Bcodecs%3Dopus&voice=en-US_AllisonVoice" +
                        "&text="+$scope.text_to_read);

                })

            })
            http_handler.error(function (data) {
                alert("Unsuccessful REST call, please try again!!!");
            });



        };
    })
    .factory('audio',function ($document) {
    var audioElement = $document[0].createElement('audio');
    return {
        audioElement: audioElement,

        play: function(filename) {
            audioElement.src = filename;
            audioElement.play();
        }
     }
});