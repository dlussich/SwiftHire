var express = require('express');
var router = express.Router({caseSensitive: true, strict:true});
var fetch = require('node-fetch');
var ObjectId = require('mongodb').ObjectID;
const Rx = require('@reactivex/rxjs');

/**
 * User Collection {
	_id:
	name: string,
	avatar: url,
	comments: [
		{content: string, date: date, rate:number, jobId: string, jobOwner: userId},
		{},
	]
}

 ========= Rest API List
 RestAPI ------ user/:userId ----- Get  ----- Show user's profile.
 RestAPI ------ job/:jobId/candidate/:candiateId ----  See candidate's profile info.

 */

/**
 * Load some testing data
 */
router.get('/init', function(req, res, next) {
    let obj1 = {
        "_id": "1",
        "name": "dara",
        "password": "123456",
        "avatar": "http://localhost:4000/images/user3.png",
        "comments": [
            {"jobId": "1", "rate": 5, "content": 'you did a good job.', "date":'July 12, 2017'},
            {"jobId": "2", "rate": 2, "content": 'you need to improve.', "date":'June 13, 2017'}
        ]};
    let obj2 = {
        "_id": "2",
        "name": "samuel",
        "password": "123456",
        "avatar": "http://localhost:4000/images/user1.png",
        "comments": [
            {"jobId": "1", "rate": 5, "content": 'you did a good job.', "date":'July 12, 2017'},
            {"jobId": "2", "rate": 2, "content": 'you need to improve.', "date":'June 13, 2017'}
        ]};
    let obj3 = {
        "_id": "3",
        "name": "diego",
        "password": "123456",
        "avatar": "http://localhost:4000/images/user2.png",
        "comments": [
            {"jobId": "1", "rate": 5, "content": 'you did a good job.', "date":'July 12, 2017'},
            {"jobId": "2", "rate": 2, "content": 'you need to improve.', "date":'June 13, 2017'}
        ]};

    req.users.insertMany([obj1, obj2, obj3], function(err, insertData){
        if (err) next(err);
        res.send("Insert Success");
    });
})


/*
* GET users listing.
*/
router.get('/', function(req, res, next) {
    req.users.find({}).toArray((err, docArray) => {
         if (err) next(err);
         console.log(docArray);
         res.json(docArray);
     });
})

/**
 * Get user detail info
 */
router.get('/:userId', function(req, res, next) {
    let query = {_id: ObjectId(req.params['userId'])};
    //console.log("Samuel Test 777777 userId = " + req.params['userId']);
    req.users.find(query).toArray(function(err, docArray){
        if (err) next(err);
        console.log("Samuel Test userId doc = " + docArray);
        if (docArray && docArray.length > 0) {
            res.json(docArray[0]);
        }
        res.status(200);
    });
});

/**
 * Add one comment for one worker/candidate
 */
router.post('/', function (req, res, next) {
    var obj = {
        content: req.body.content,
        date: req.body.date,
        rate: req.body.rate,
        jobId: req.body.jobId,
        jobOwner: req.body.jobOwnerName
    };

    let owner = req.body.jobOwnerId;
    let query = {_id: ObjectId(owner)};
    let operate = {$push: { comments: obj } };
    req.users.update(query, operate, function (err, data) {
        if (err) next(err);
        //console.log(data);
        res.json({status:"success"});
    });
});

/**
 * Upsert one user
 */
router.post('/upsert', function (req, res, next) {
    let obj = {
        "_id":ObjectId(req.body._id),
        "name":req.body.name,
        "avatar":req.body.avatar,
        "password":"",
        "comments":[]
    }

    //console.log("samuel add one  _id = " + req.body._id);
    let query = {_id: ObjectId(req.body._id)};
    if (req.users.find(query).count() > 0) {
        let operate = {$set: {name: req.body.name, avatar: req.body.avatar} };
        req.users.update(query, operate, function (err, data) {
            if (err) next(err);
            //console.log("=========== add one comment ");
            console.log(data);
            res.json({status:"success"});
        });
    } else {
        req.users.insert(obj, function (err, data) {
            if (err) next(err);
            //console.log(data);
            res.json({status:"success"});
        });
    }

});
module.exports = router;

