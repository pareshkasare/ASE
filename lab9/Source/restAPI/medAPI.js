/**
 * Created by Ved on 3/18/2017.
 */
var express = require('express');
var app = express();
var request = require('request');
app.get('/medAPI', function (req, res) {
    var result={
        'meds': []
    };

    var name = req.query.name;
    var brand = req.query.brand;
    console.log("found this on url: ", name);
    console.log("found this on url: ", brand);
    if(name) {
        request('https://dailymed.nlm.nih.gov/dailymed/services/v2/rxcuis.json?rxString=' + name, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }

            //Check for right status code
            if (response.statusCode !== 200) {
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            //All is good. Print the body
            body = JSON.parse(body);
            var med_data = body.data;
            for (var i = 0; i < med_data.length; i++) {
                result.meds.push({
                    'name': med_data[i].rxstring,
                    'rxcui': med_data[i].rxcui
                });
            }
            res.contentType('application/json');
            res.write(JSON.stringify(result));
            res.end();
        });
        console.log(result);
    }
    else if(brand){
        request('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=' + brand, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }

            //Check for right status code
            if (response.statusCode !== 200) {
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            //All is good. Print the body
            body = JSON.parse(body);
            var med_data = body.data;
            for (var i = 0; i < med_data.length; i++) {
                result.meds.push({
                    'name': med_data[i].title,
                    'setid': med_data[i].setid
                });
            }
            res.contentType('application/json');
            res.write(JSON.stringify(result));
            res.end();
        });

    }
    else {
        res.contentType('application/json');
        res.write('["Error":"No valid Parameter passed in API call"]');
        res.end();
    }

});

var server = app.listen(9090, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});