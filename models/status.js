var db=require('mongoose');

var statusSchema=new db.Schema({
	state:String,
	date:{type:Date,default:Date.now}
});

module.exports=db.model('status',statusSchema);