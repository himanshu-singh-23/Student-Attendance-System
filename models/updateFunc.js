var users=require('./user'),
	attend=require('./status'),
	   edu=require('./edu');

function update(User,callback)
{
	 User.status.forEach(function(status) {
			users.findById(status.split('-')[1],function(error,user)
			{
				if(error) callback(false);
				else
				{
					attend.create({state:status.split('-')[0],user:user._id},function(error,state)
					{
						if (error) {callback(false);}
						else
						{
							user.status.push(state._id);
							user.save(function(error,user)
							{
								if (error) callback(false);
							});
						}
					});				
				}
			});	
	});
	callback(true);
}

function compareEdu(eduId,Edudetail,callback)
{
	edu.findById(eduId,function(error,edudetail)
	{
		if (error) {callback(false)}
		else 
		{
			if (edudetail.colname==Edudetail.colname&&edudetail.course==Edudetail.course&&edudetail.cgpa==Edudetail.cgpa&&edudetail.x2percent==Edudetail.x2percent&&edudetail.x2board==Edudetail.x2board&&edudetail.x2name==Edudetail.x2name&&edudetail.xname==Edudetail.xname&&edudetail.xboard==Edudetail.xboard&&edudetail.xpercent==Edudetail.xpercent) {
				callback(true)
			}
			else
			{
				callback(false);
			}
		}
	});
}

module.exports={update,compareEdu};