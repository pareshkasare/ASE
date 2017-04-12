
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var url = 'mongodb://pskcnc:testpskcnc@ds139360.mlab.com:39360/ase_project';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/register', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        insertDocument(db, req.body,res, function() {


        });
    });
});
app.post('/updateUser', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        updateDocument(db, req.body,res, function() {


        });
    });
});
app.post('/login', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        loginuser(db, req.body,res, function() {
            //res.write("success");
            db.close();
            res.end();
        });
    });
});
app.post('/table', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        getusers(db, res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });
});
app.post('/removeuser', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        removeuser(db, req.body,res, function() {
            res.write("Success");
            //console.log(res);
            db.close();
            res.end();
        });
    });
});
var insertDocument = function(db, data,res, callback) {

    console.log("em:" + data.email);
    var cursor = db.collection('users').find({"email":data.email});
    cursor.each(function(err,doc){
        //assert.equal(err,null);
        console.log("data"+ JSON.stringify(doc));
        if(doc !== null)
        {
            res.write("Failure");
            db.close();
            res.end();
            return false;
        }
        else {
            db.collection('users').insertOne( data, function(err, result) {
                if(err)
                {
                    res.write("DBINSERT failure");
                    db.close();
                    res.end();

                }
                else{
                    res.write("Success");
                    db.close();
                    res.end();
                }

            });
            return false;
        }

    });callback();

    /*db.collection('users').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the users collection.");
        callback();
    });*/
};
var updateDocument = function(db, data,res, callback) {

    console.log("DATA FOR UPDATE::::::" +JSON.stringify(data));
    var ObjectId = require('mongodb').ObjectID;
    db.collection('users').updateOne( {_id:ObjectId(data.id)},{$set:{fname:data.fname,lname:data.lname,email:data.email,password:data.pw}}, function(err, result) {
     if(err)
     {
     res.write("DBUPDATE failure");
     res.end();
     }
     else{
         res.write("Success");
         db.close();
         res.end();
     }
     callback();
     });
};
var loginuser = function(db, data,res, callback) {
    console.log("loggin in user"+data.password);
    var cursor = db.collection('users').find({"email":data.email,"password":data.password});
    cursor.each(function(err,doc){
        assert.equal(err,null);
        console.log("data"+ data);
        if(doc != null)
        {
            res.write("success")
            console.log("User logged:" + doc.email);
            console.log("pwd:"+doc.password);
        }
        else {
            callback();
        }
    });
};
var getusers = function(db, res, callback) {
    //console.log("loggin in user"+data.password);
    //var cursor = db.collection('users').find();

    var stream = db.collection('users').find().stream();
    var out="";
    stream.on('data', function (doc) {

        console.log(JSON.stringify(doc));
        out = out+JSON.stringify(doc)+",";

    });
    stream.on('end', function() {
        out = "["+out.slice(0,-1)+"]";
        res.write(out);

        callback();
    });
};
var removeuser = function(db, data,res, callback) {
    console.log("id passed"+data.id);
    var ObjectId = require('mongodb').ObjectID;

    var cursor = db.collection('users').remove({_id:ObjectId(data.id)});
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            //res.end();
        }
       /* getusers(db, res, function() {
            //res.write("success");
            //console.log(res);
            //db.close();
            //res.end();
        });*/
    });
    callback();
    /*
    cursor.each(function(err,doc){
        assert.equal(err,null);
        console.log("data"+ data);
        if(doc != null)
        {
            res.write("success")
            console.log("User logged:" + doc.email);
            console.log("pwd:"+doc.password);
        }
        else {
            callback();
        }
    });*/

};

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})