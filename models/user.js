var db=require('mongoose'),
	status=require('./status');

var userSchema=new db.Schema({
	fname:String,
	lname:String,
	username:String,
	password:{type:String,default:"123456789a"},
	role:String,
	status:[{
		type:db.Schema.Types.ObjectId,
		ref:"status"
	}],
	contact:String,
	email:String,
	date:{type:Date,default:Date.now}
});

module.exports=db.model('user',userSchema);