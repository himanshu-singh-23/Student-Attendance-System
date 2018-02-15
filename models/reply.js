var db=require('mongoose');

var replySchema=new db.Schema({
	date:{type:Date,default:Date.now},
	content:String,
	author:{
		type:db.Schema.Types.ObjectId,
		ref:'user'
	}
});

module.exports=db.model('reply',replySchema);