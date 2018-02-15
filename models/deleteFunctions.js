var comments=require('./comments'),
	replies=require('./reply'),
	users=require('./user');

function deleteReplies(replies,callback)
{
	console.log(replies);
	replies.forEach(function(reply)
	{
		replys.findByIdAndRemove(reply.id,function(error,reply)
		{
			if (error) {callback(false);}
			else console.log(reply);
		});
	});
	return callback(true);
}
function deleteComments(Comments,callback)
{
	Comments.forEach(function(comment)
	{
		deleteReplies(comment.replys,function(f)
		{
			if(f) comments.findByIdAndRemove(comment.id,function(error,comment)
				{
					if (error) {callback(false);}
					else console.log(comment);
				});
			else callback(false);
		});
	});
	callback(true);
}
function removeFromAuthor(postId,userId) 
{
	users.findById(userId,function(error,user)
	{
		user.blogs.splice(user.blogs.indexOf(postId),1);
	});
}

module.exports={deleteReplies,deleteComments,removeFromAuthor};