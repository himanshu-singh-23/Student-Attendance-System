var users=require('./user'),
	attend=require('./status');


function update(User,callback)
{
	var Status=User.status;
	var i=0;
	 User.username.forEach(function(username) {
			users.findOne({username:username},function(error,user)
			{
				if(error) callback(false);
				else
				{
					attend.create({state:Status[i++]},function(error,state)
					{
						if (error) {console.log(error);}
						else
						{
							user.status.push(state._id);
							user.save(function(error,user)
							{
								if (error) callback(false);
							});
						}
					})				
				}
			});	
	});
	callback(true);
}

module.exports={update};