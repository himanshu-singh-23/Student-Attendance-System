var users=require('./user'),
	express=require('express'),
	router=express.Router({mergeParams:true});

router.get('/',function(req,res)
{
	res.render('add');
});

router.post('/',function(req,res)
{
	var user=req.body.user;
	user.fname=user.fname.toLowerCase();
	user.lname=user.lname.toLowerCase();
	user.email=user.email.toLowerCase();
	users.create(user,function(error,user)
	{
		if (error)console.log(error);
		else res.redirect('/markAttendance');
	});
});
module.exports=router;
