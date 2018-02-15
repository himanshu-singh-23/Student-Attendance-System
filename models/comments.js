var db=require('mongoose');

var commentSchema=new db.Schema({
	date:{type:Date,default:Date.now},
	content:String,
	author:{
		type:db.Schema.Types.ObjectId,
		ref:'user'
	},
	post:{
		type:db.Schema.Types.ObjectId,
		ref:'blog'
	},
	replys:[{
		type:db.Schema.Types.ObjectId,
		ref:'reply'
	}]
});


module.exports=db.model('comment',commentSchema);