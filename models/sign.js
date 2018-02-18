var users=require('./user'),
	express=require('express'),
	passport=require('passport'),
	router=express.Router({mergeParams:true});

router.post('/in', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/sign/in'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/in',function(req,res)
{
	res.render('signin');
});

router.get('/up',function(req,res)
{
	res.render('signup');
});

router.post('/up',function(req,res)
{
	var user=new users(req.body);
	user.name=user.name.toLowerCase();
	user.username=user.username.toLowerCase();
	user.email=user.email.toLowerCase();
	users.register(user,user.password,function(error,user)
	{
		if(error)console.log(error);
		else res.redirect('/sign/in');
	});
});

router.post('/validate/:val',function (req,res){
	users.findOne({$or:[{username:req.body.value.toLowerCase()},{contact:req.body.value},{email:req.body.value.toLowerCase()}]},function (error,user) 
	{
		if(user){res.status(400).send();}
		else {res.status(200).send();}
	});
})

router.get('/out',function(req,res)
{
	req.logout();
	res.redirect("/sign/in");
});
module.exports=router;