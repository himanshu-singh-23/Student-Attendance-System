var users=require('./user'),
	express=require('express'),
	router=express.Router({mergeParams:true});

router.get('/',function(req,res) {
	users.find({}).populate('status').exec(function(error,users)
	{
		if(error) res.redirect('/markAttendance');
		else res.render('details',{users:users});
	});
});

module.exports=router;