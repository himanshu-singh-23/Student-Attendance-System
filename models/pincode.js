var express=require('express'),
	{isLoggedIn}=require('./middleware'),
	router=express.Router({mergeParams:true}),
	request=require('request');
	
router.post('	',isLoggedIn,function(req,res){
	console.log(req.body);
	request("http://postalpincode.in/api/pincode/"+req.body.pincode,function(error,response)
	{
		if(JSON.parse(response.body).Status!='Error')
			{
				var stateCountry={
					state:JSON.parse(response.body).PostOffice[0].State,
					country:JSON.parse(response.body).PostOffice[0].Country
				}
				res.status('200').send(stateCountry);
			}
		else 
			console.log('Wrong Pincode!!');
	});

});

module.exports=router;

