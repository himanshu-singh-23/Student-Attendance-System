var db=require('mongoose');

var eduSchema=new db.Schema({
	colname:String,
	date:{type:Date,default:Date.now},
	course:String,
	user:{
		type:db.Schema.Types.ObjectId,
		ref:'user'
	},
	cgpa:String,
	x2name:String,
	x2board:String,
	x2percent:String,
	xname:String,
	xboard:String,
	xpercent:String
});

module.exports=db.model('edu',eduSchema);