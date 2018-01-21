var db=require('mongoose'),
	passportLocalMongoose=require('passport-local-mongoose'),
	status=require('./status');

var userSchema=new db.Schema({
	fname:String,
	username:String,
	password:{type:String,default:"123456789a"},
	role:String,
	status:[{
		type:db.Schema.Types.ObjectId,
		ref:"status"
	}],
	contact:String,
	email:String,
	gender:String,
	date:{type:Date,default:Date.now}
});
userSchema.plugin(passportLocalMongoose);
module.exports=db.model('user',userSchema);