var users=require('./user'),
	express=require('express'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get('/',[isLoggedIn,admin],function(req,res)
{
	res.render('add');
});

router.post('/',[isLoggedIn,admin],function(req,res)
{
	users.findOne({username:req.body.username.toLowerCase()},function(error,user)
	{
		if(error) res.redirect('back');
		else
		{
			user.reg_no=req.body.reg_no;
			user.role=req.body.role;
			user.save(function(error,user)
			{
				if(error) res.redirect('back');
				else res.redirect('/studentDetails');
			});
		}
	});
});
module.exports=router;
