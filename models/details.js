var users=require('./user'),
	express=require('express'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	{member}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get('/',[isLoggedIn,admin],function(req,res) {
	users.find({role:'inactive'}).sort("name").populate('status').exec(function(error,users)
	{
		if(error) res.redirect('/markAttendance');
		else res.render('details',{users:users});
	});
});

router.get('/my/:id',[isLoggedIn,member],function(req,res) {
	users.findById(req.params.id).populate('status').sort([["date",-1]]).exec(function(error,user)
	{
		if(error) res.redirect('/');
		else res.render('myDetails',{user:user});
	});
});


module.exports=router;