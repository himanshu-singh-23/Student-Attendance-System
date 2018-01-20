var users=require('./user'),
	express=require('express'),
	{update}=require('./updateFunc'),
	router=express.Router({mergeParams:true});

router.get("/",function(req,res)
{
	users.find({role:'inactive'},function(error,users)
	{
		if(error) console.log(error);
		else res.render('attendance',{users:users}); 
	});
});

router.post('/save',function(req,res){
	var User=req.body.user;
	update(User,function(f){
		if (f) {res.redirect('/studentDetails');}
		else res.redirect('back');
	});
});

module.exports=router;