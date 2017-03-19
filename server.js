var express = require('express');
var engine = require('consolidate');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

var store = new MongoStore({ 
         url: 'mongodb://qwer9701:raj970123@ds113000.mlab.com:13000/sessionstore',
         //ttl: 14 * 24 * 60 * 60, // = 14 days. Default
         touchAfter: 24 * 3600 // time period in seconds
      });

app.use(session({
  secret: "srty5e6@!*kjr48474%^^&hjvx&%^$*($%",
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {   
    maxAge: 1000 * 60 * 60 * 24 * 7  // 1 week
    //maxAge: 1000 * 60 * 60 * 24 * 7 // expire session in 15 min or 900 seconds 
    }          
}));

app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var url = 'mongodb://raj9701:raj970123@ds155727.mlab.com:55727/contactlists';
//mongodb://raj9701:raj970123@ds155727.mlab.com:55727/contactlists
MongoClient.connect(url, function(err, db) {
  if (err) 
  	throw err;
  console.log("Connected to Database");

  //Userlist CRUD Requests Are Done Bellow
   app.get('/contactlists',function(req,res){
     console.log("i get GET request")    
     db.collection('users').find().toArray(function(err,docs){
        console.log(docs);    
        //assert.equal(1, docs);     
        console.log(JSON.stringify(docs));
        res.json(docs);
     });
 });
 
   app.post('/contactlist',function(req,res){
     console.log(req.body)  
    db.collection('users').insertOne(req.body,function(err,docs){
    //console.log(docs);
    res.json(docs);
   });
 });
   
   app.delete('/contactlist/:id',function(req,res){
      var id = req.params.id;
      console.log(id);
      db.collection('users').deleteOne({_id: ObjectID(id)},function(err,docs){      	
      	res.json(docs);
      })
 });

   app.get('/contactlist/:id',function(req,res){
 	var id = req.params.id;
 	console.log(id);
 	db.collection('users').findOne({_id: ObjectID(id)},function(err,docs){
             console.log(docs);
             res.send(docs);
     	});
 	});

   app.put('/contactlist/:id',function(req,res){
 	var id = req.params.id;
 	console.log(req.body.name); 
     console.log(id);	
 	db.collection('users').updateOne(
     {_id:ObjectID(id)},
     {$set: {name: req.body.name,email:req.body.email,number:req.body.number}}, 
     {upsert: true        
      },function(err,docs){
            //console.log(docs);
            res.json(docs);                        
 	   });
 	});
  //Userlist CRUD Requests End Here

//check user
app.get('/check',function(req,res){
    if(req.session.user){  
      console.log(req.session.user);         
      //res.json(req.session.user);
      res.send(req.session.user);
    }else{
       console.log("no session");
      res.json("no");    
    }           
 });
 //check user end

//register user
app.post('/register',function(req,res){
     //console.log(req.body)  
    db.collection('register').insertOne(req.body,function(err,docs){
    //  console.log(docs);           
     //res.send(JSON.stringify(docs)); 
     res.json(docs);   
    });
 });
 //register user end
 
//Login user start
app.post('/loginuser', function(req,res){
   //console.log(req.body);  
    db.collection('register').findOne({email: req.body.email, password:req.body.password},function(err,docs){           
              req.session.user = docs;
              console.log(docs); 
              //console.log(req.session.user);                                        
              res.json(docs);
              //res.send(JSON.stringify(docs));
      });  
});
//Login user start




//Logout user start
app.post('/logout', function(req,res){
  console.log("i received th e logout request");
  if(req.session.user){
    //$row="hello";
    //console.log($row);
      req.session.destroy();            
      res.json("yes");
    }
});
//Logout user start





});

app.listen("4000");
console.log("App listening on Port 4000");
/*app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.get('/About', function (req, res)
{
    res.render('dashboard');    
});
*/