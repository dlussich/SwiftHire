/**
 * Created by Samuel on 17/7/2017.
 */
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

/*
*
*
* Job Collection {
* _id:string,
 name: string,
 description: string,
 category:string,
 location: [long, lat],
 duration: number,// duration per hour
 hourFee: number,// hourly fees rate
 preferDate: date,//preferred date
 preferTime: time, // preferred time.
 owner: userId:string,
 candidate: anotherUserId:string,
 available: boolean, // true --- is aviable for all users, false --- when the owner already picked one candidate. or job expired
 waitingList:[
 {the whole user json data},
 {}
 ]
 }

 ==================== Rest API
 Jobs Index  {
 category:string,
 location: [long, lat],
 duration: number,// duration per hour
 hourFee: number,// hourly fees rate
 preferDate: date,//preferred date
 preferTime: time, // preferred time.
 }

 RestAPI ------ jobs/   ------ GET (location parameter)  ----- return all nearby jobs.

 RestAPI ------ jobs/post  ------ Post (form paramters)---- create a job.
 RestAPI ------ jobs/apply ----- POST (jobId, candidateId) ---- Enroll to one job.

 RestAPI ------ jobs/:uerId/post ------ Get -------  Return all jobs I posted
 RestAPI ------ jobs/:uerId/apply ------ Get -------  Return all jobs I applied for.

 RestAPI ------ jobs/:jobId/candidate ----- Get (path parameter:jobId) ----  return all candidate with detail info.
 RestAPI ------ jobs/:jobId/candidate/:candidateId ----  See candidate's profile info.
 RestAPI ------ jobs/choose ----- POST (jobId, candidateId)

*
* */

/**
 * Test: get all jobs.
 */
router.get('/all', function(req, res, next){
    req.jobs.find().toArray(function(err, docArray){
        if (err) next(err);
        res.json(docArray);
    });
});

/**
 * Test: get 10 closest locations.
 */
router.get('/', function(req, res, next){
    let lat= parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    req.jobs.find({"location":{$near:{$geometry:{type:"Point", coordinates:[long, lat]}, $maxDistance:10000}}}).limit(10)
        .toArray(function(err, docArray){
            console.log("Returning" + docArray);
        if (err) next(err);
        res.json(docArray);
    });
});


/**
 * Test: get jobs by minimum fee.
 */
router.get('/fee/:fee', function(req, res, next){
    let fee= parseFloat(req.params['fee']);
    let date= new Date();
    req.jobs.find({'hourFee':{$gte: fee},'preferDate':{$gt:date}})
        .toArray(function(err, docArray){
        console.log("Returning" + docArray);
        if (err) next(err);
        res.json(docArray);
    });
});

/**
 * Test: get jobs by category.
 */
router.get('/category/:category', function(req, res, next){
    let cat= req.params["category"].trim();
    let date=new Date();
    let query={"category": cat,'preferDate':{$gt:date}};
    req.jobs.find(query)
        .toArray(function(err, docArray){
            console.log("Returning" + docArray);
        if (err) next(err);
        res.json(docArray);
    });
});

/**
 *  Return all jobs I posted
 */
router.get('/:userId/post', function(req, res, next) {
    let query = {"owner": req.params['userId']};
    req.jobs.find(query).sort("preferDate", 1).toArray(function(err, docArray){
        if (err) next(err);
        console.log(docArray);
        res.json(docArray);
        res.status(200);
    });
});

/**
 *  Return all jobs I enrolled ---- apply success or still in waitlist
 */
router.get('/:userId/apply', function(req, res, next) {
    let userId = req.params['userId'];
    console.log("Samuel Test get enrolled userId = " + userId);
    let query1 = {"candidate": userId};
    let query2 = {"candidate": null, "waitingList": {$elemMatch:{"_id": ObjectId(userId)}, "$exists": true, $ne: [] }};
    req.jobs.find({$or:[query1, query2]}).sort("preferDate", 1).toArray(function(err, docArray){
        if (err) next(err);

        console.log("Samuel Test get enrolled docArray = " + docArray);
        res.json(docArray);
    });
});

/**
 *  Return all candidates for one job
 */
router.get('/:jobId/candidate', function(req, res, next) {
    let query = {"_id": ObjectId(req.params['jobId'])};
    req.jobs.findOne(query, function(err, doc){
        if (err) next(err);
        res.json(doc);
    });
});

/**
 * Choose candidate for one job
 */
router.post('/choose', function(req, res, next){
    var candidateId = req.body.candidateId;
    var jobId = req.body.jobId;
    //console.log("Samuel Test userId 9999 candidateId = " + candidateId + " , jobId = " + jobId);

    let query = {_id: ObjectId(jobId)};
    let operate = {$set: {waitingList: [], candidate:candidateId.toString() } };
    req.jobs.update(query, operate, function (err, data) {
        if (err) next(err);
        //console.log(data);
        res.json({status: "success"});
    });
});


/**
 * Apply for one job
 */
router.post('/apply', function(req, res, next){
    var candidateId = req.body.candidateId;
    var jobId = req.body.jobId;
    console.log("Samuel Test userId 9999 candidateId = " + candidateId + " , jobId = " + jobId);
    req.users.find({_id: ObjectId(candidateId)}).toArray(function(err, docArray){
        if (err) next(err);
        console.log("Samuel Test userId 9999 doc = " + docArray);
        if (docArray && docArray.length > 0) {
            let candidate = docArray[0];
            let query = {_id: ObjectId(jobId)};
            let operate = {$push: {waitingList: candidate } };
            req.jobs.update(query, operate, function (err, data) {
                if (err) next(err);
                //console.log(data);
                res.json({status: "success"});
            });
        }
    });
});

/**
 * Add one job
 */
router.post('/', function(req, res, next){
    let loc={ type:"Point",
              coordinates:[req.body.long,req.body.lat]};
    let dat=new Date(req.body.preferDate);
    var obj = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        location: loc,
        duration: req.body.duration,
        hourFee: req.body.hourFee,
        preferDate: req.body.preferDate,
        preferTime: req.body.preferTime,
        owner: req.body.owner,
        candidate: null,
        waitingList: []
    };

    req.jobs.insert(obj, function (err, dataInsert) {
        if (err) next(err);
        res.json({"status": "success"});
    })
});

/**
 * Load some testing data
 */
router.get('/init', function(req, res, next) {
    //req.jobs.createIndex({'location:':'2dsphere'}); // run in mongo shell

    let obj1 = {"_id":"1","name":"Wash car","description":"Wash my neigbours Ferrari","category":"Domestic work","location":{"type":"Point", "coordinates":[-91.96811168,41.00800002]},"duration":2,"hourFee":8,"preferDate":new Date("2017-07-22T15:00:00Z"),"preferTime":"3:00 pm","candidate":"","available":"true","waitingList":[],"owner":"1"};
    let obj2 = {"_id":"2","name":"Clean the restroom","description":"Wash my neigbours Ferrari","category":"Physical work","location":{"type":"Point", "coordinates":[-91.96811168,41.00800019]},"duration":2,"hourFee":8,"preferDate":new Date("2017-07-22T15:00:00Z"),"preferTime":"3:00 pm","candidate":"","available":"true","waitingList":[],"owner":"2"};
    let obj3 = {"_id":"3","name":"Wash car","description":"Wash my neigbours Ferrari","category":"Domestic work","location":{"type":"Point", "coordinates":[-91.96811167,41.00800002]},"duration":2,"hourFee":8,"preferDate":new Date("2017-07-22T15:00:00Z"),"preferTime":"3:00 pm","candidate":"","available":"true","waitingList":[],"owner":"3"};
    let obj4 = {"_id":"4","name":"Wash Window","description":"Wash my neigbours Ferrari","category":"Domestic work","location":{"type":"Point", "coordinates":[-91.96811168,41.00800001]},"duration":2,"hourFee":8,"preferDate":new Date("2017-07-22T15:00:00Z"),"preferTime":"3:00 pm","candidate":"","available":"true","waitingList":[],"owner":"3"};

    req.jobs.insertMany([obj1, obj2, obj3, obj4], function(err, insertData){
        if (err) next(err);
        return res.send("Insert Success");
    });
});


module.exports = router;
