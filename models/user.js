var db=require('mongoose'),
	passportLocalMongoose=require('passport-local-mongoose'),
	comments=require('./comments'),
	status=require('./status');

var userSchema=new db.Schema({
	name:String,
	username:String,
	password:{type:String,default:"123456789a"},
	role:String,
	profileImg:{type:String,default:"https://chmegg-images-prod.s3.amazonaws.com/avatar/image_fileEOsdIm_d5a893a7.jpeg"},
	// coverImg:{type:String,default:"https://semantic-ui.com/images/wireframe/image.png"},
	status:[{
		type:db.Schema.Types.ObjectId,
		ref:"status"
	}],
	blogs:[{
		type:db.Schema.Types.ObjectId,
		ref:"blog"
	}],
	edu:{
		type:db.Schema.Types.ObjectId,
		ref:'edu'
	},
	about:String,
	contact:String,
	address:String,
	email:String,
	gender:String,
	reg_no:String,
	dob:{type:Date},
	pincode:String,
	relationship:{type:String,default:'single'},
	date:{type:Date,default:Date.now}
});
userSchema.plugin(passportLocalMongoose);
module.exports=db.model('user',userSchema);