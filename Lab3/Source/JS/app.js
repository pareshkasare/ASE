/**
 * Created by Ved on 2/8/2017.
 */
var myApp = angular.module('visual_app', []);
myApp.controller('get_vision_response', function ($scope, $http,audio) {
        $scope.getvision_response = function(){
            console.log("watson called 1: ");

            var url = document.getElementById("url").value;
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
    });
myApp.factory('audio',function ($document) {
    var audioElement = $document[0].createElement('audio');
    return {
        audioElement: audioElement,

        play: function(filename) {
            audioElement.src = filename;
            audioElement.play();
        }
     }
});
