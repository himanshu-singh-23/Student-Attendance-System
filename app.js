var express=require('express'),
	body=require('body-parser'),
	users=require('./models/user'),
	db=require('mongoose'),
	session=require('express-session'),
	passport=require('passport'),
	LocalStrategy=require('passport-local'),
	app=express();


app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('file'));
// db.connect('mongodb://localhost/cypher');
db.connect('mongodb://devil:devil123@ds261527.mlab.com:61527/cypher');

if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redis = require("redis").createClient(rtg.port, rtg.hostname);

	redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}

app.use(session({
    secret:"Cypher attendance System.!",
    // store: new RedisStore({ client : redis }),
    resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());


app.use(function(req,res,next)
{
	res.locals.formatTitle=require('format-title');
	next();
});

app.get('/',function(req,res)
{
	res.redirect('/markAttendance');
});

var attendanceRoute=require('./models/attendance'),
	newRoute=require('./models/addstudent'),
	detailRoute=require('./models/details');

app.use('/markAttendance',attendanceRoute);
app.use('/addStudents',newRoute);
app.use('/studentDetails',detailRoute);

app.get('*',function(req,res)
{
	res.redirect('/markAttendance');
});

const port=process.env.PORT||3000;

app.listen(port,function() 
{
	console.log("Server Started!!");
});