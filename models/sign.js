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
	user.email=user.email.toLowerCase();
	users.register(user,user.password,function(error,user)
	{
		if(error)console.log(error);
		else res.redirect('/sign/in');
	});
});

router.get('/out',function(req,res)
{
	req.logout();
	res.redirect("/");
});
module.exports=router;