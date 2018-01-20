var db=require('mongoose');

var statusSchema=new db.Schema({
	state:String,
	date:{type:Date,default:Date.now},
	user:{
		type:db.Schema.Types.ObjectId,
		ref:"user"
	}
});

module.exports=db.model('status',statusSchema);