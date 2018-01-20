function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect('/');
}
function admin(req,res,next)
{
	if(req.user.role=="active")
	{
		return next();
	}
	else
	{
		res.redirect('/');
	}
}

module.exports={isLoggedIn,admin};