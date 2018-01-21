var users=require('./user'),
	express=require('express'),
	{update}=require('./updateFunc'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get("/",[isLoggedIn,admin],function(req,res)
{
	users.find({role:'inactive'},function(error,users)
	{
		if(error) console.log(error);
		else res.render('attendance',{users:users}); 
	});
});

router.post('/save',[isLoggedIn,admin],function(req,res){
	var User=req.body.user;
	update(User,function(f){
		if (f) {res.redirect('/studentDetails');}
		else res.redirect('back');
	});
});

module.exports=router;