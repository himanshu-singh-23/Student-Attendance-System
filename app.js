var express=require('express'),
	body=require('body-parser'),
	users=require('./models/user'),
	blogs=require('./models/blog'),
	db=require('mongoose'),
	fs=require('fs'),
	session=require('express-session'),
	passport=require('passport'),
	LocalStrategy=require('passport-local'),
	redis=require('redis'),
	app=express();


app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('file'));
db.connect('mongodb://localhost/image');
// db.connect('mongodb://localhost/cypher');
db.connect('mongodb://devil:devil123@ds261527.mlab.com:61527/cypher');	

// if (process.env.REDISTOGO_URL) {
//     var rtg   = require("url").parse(process.env.REDISTOGO_URL);
// 	var redis = require("redis").createClient(rtg.port, rtg.hostname);

// 	redis.auth(rtg.auth.split(":")[1]);
// } else {
//     var redis = require("redis").createClient();
// }

app.use(session({
    secret:"Cypher attendance System.!",
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
	res.locals.user=req.user;
	next();
});

app.get('/',function(req,res)
{
	res.render('home');
});



var attendanceRoute=require('./models/attendance'),
	newRoute=require('./models/addstudent'),
	signRoute=require('./models/sign'),
	detailRoute=require('./models/details');

app.use('/markAttendance',attendanceRoute);
app.use('/addStudents',newRoute);
app.use('/studentDetails',detailRoute);
app.use('/sign',signRoute);


app.post('/img',function(req,res)
{
	a=new blogs();
	a.img.data = fs.readFileSync(req.body.file1);
	a.img.contentType = 'image/png';
	a.save(function(error,image)
	{
		console.log(error,image);
	});
	res.redirect('/');
});

app.get('*',function(req,res)
{
	res.redirect('/');
});

const port=process.env.PORT||3000;

app.listen(port,function() 
{
	console.log("Server Started!!");
});