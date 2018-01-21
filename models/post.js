var express=require('express'),
	blogs=require('./blog'),
	fs=require('fs'),
	fse=require('fs-extra'),
	Datauri = require('datauri'),
	multer = require('multer'),
	upload=multer({ dest: '/uploads/'}),
	router=express.Router({mergeParams:true});
	datauri = new Datauri();

var quotes=[{
	quote:'Success is not final; failure is not fatal: It is the courage to continue that counts',
	author:'Winston S. Churchill'
},
{
	quote:'It is better to fail in originality than to succeed in imitation',
	author:'Herman Melville'	
}];

router.get('/',function(req,res)
{

	blogs.find({},function(error,blogs)
	{
		if (error) {console.log(error)}
		else res.render('home',{blogs:blogs,quote:quotes[Math.floor(Math.random() * 2)]});
	});
})
router.post('/newPost',upload.any(),function(req,res)
{
	a=new blogs(req.body.blog);
	if(req.files.length)
	{
		var type='.';
			type+=req.files[0].originalname.split('.')[1];
		a.img.data = fs.readFileSync(req.files[0].path);
		a.img.contentType = 'image/png';
		datauri.format(type,a.img.data);
		a.imgUri=datauri.content;
	}
	a.save(function(error,image)
	{
		if(error) console.log(error)
		else {
			fse.remove('/uploads/*', function(err) {
				if (err) return console.error(err)
				else res.redirect('/');
			});
		}
	});
});
router.get('/newPost',function(req,res)
{
	res.render('addBlog');
});

module.exports=router;