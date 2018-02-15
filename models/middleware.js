var blogs=require('./blog');

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
	if(req.user.role=="admin"||req.user.role=="active")
	{
		return next();
	}
	else
	{
		res.redirect('/');
	}
}
function member(req,res,next)
{
	if(req.user.role=="inactive")
	{
		return next();
	}
	else
	{
		res.redirect('/');
	}
}
function owner(req,res,next)
{
	if(req.user.id==req.body.author||req.user.role=='admin')
	{
		return next();
	}
	else
	{
		res.redirect('/');
	}
}
function ownerForGet(req,res,next)
{
	blogs.findById(req.params.id,function(error,blog)
	{
		if(error) res.redirect('/');
		else
		{
			if(req.user.id==blog.author||req.user.role=='admin')
			{
				return next();
			}
			else
			{
				res.redirect('/');
			}
		}
	});
}
module.exports={isLoggedIn,admin,member,owner,ownerForGet};