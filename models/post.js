var express=require('express'),
	blogs=require('./blog'),
	users=require('./user'),
	comments=require('./comments'),
	replys=require('./reply'),
	edu=require('./edu'),
	comments=require('./comments'),
	replys=require('./reply'),
	fs=require('fs'),
	{isLoggedIn}=require('./middleware'),
	{owner}=require('./middleware'),
	{ownerForGet}=require('./middleware'),
	{deleteComments}=require('./deleteFunctions'),
	{deleteReplies}=require('./deleteFunctions'),
	{removeFromAuthor}=require('./deleteFunctions'),
	fse=require('fs-extra'),
	Datauri = require('datauri'),
	{compareEdu}=require('./updateFunc'),
	multer = require('multer'),
	upload=multer({ dest: 'temp/uploads/'}),
	remove='/temp/uploads/*',
	image=null,
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
var tags='Mathematics,Physics,Chemistry,Programming ,C Programming,Data structures,Civil Engineering,Mechanics,Engineering Drawing,Mechanical Engineering,Electrical,Electronics,Environmental Studies,Graph Theory,Combinatorics,Algorithms,UNIX & Shell Programming,Microprocessors,Computer Organization,Electronic Circuits,Logic,Discrete Mathematics,OOPS,Software Engineering,Systems Software,Operating Systems,Database Management System,DBMS,Computer Networks,Automata,Databases,noSql,Management and Entrepreneurship,Unix,Compiler Design,Computer Graphics,Embedded,Web Programming ,Computer Architecture,Java,Python,Multimedia Computing,Data Warehousing ,Data Mining,Neural Networks,Software Architectures,Pattern Recognition,C# Programming,.Net,Image Processing,Game Theory,Artificial Intelligence,Fuzzy LogicMultimedia Computing,Data Warehousing and Data Mining,Neural Networks,Internet Of things,Cloud Computing,Competitive Programming,Codechef,Hackerrank,Hacherearth,Codeforces';
router.get('/',function(req,res)
{

	blogs.find({}).populate('author')
				  .populate({
					path:'comments',
					populate:{path:'author'}
				  }).populate({
				  	path:'comments',
				 	populate:{path:'replys',
				 			  populate:{path:'author'}}
				  }).sort([['date',-1]]).exec(function(error,blogs)
				{
					if (error) {console.log(error)}
					else {
						res.render('home',{blogs:blogs,quote:quotes[Math.floor(Math.random() * 2)]});
				}});
});

router.get('/newPost',isLoggedIn,function(req,res)
{
	res.render('addBlog',{tags:tags.split(',').sort()});
});

router.post('/post/:id/like',isLoggedIn,function(req,res)
{
	blogs.findById(req.params.id,function(error,blog)
	{
		if(!error)
		{
			const index=blog.likedby.indexOf(req.user._id);
			if(index>-1)
			{
				console.log(blog.likedby);
				blog.likes=max(0,blog.likes-1);
    			blog.likedby.splice(index, 1);
				blog.save(function(error,blog)
				{
					if(!error)
					{
						res.send(blog.likes.toString());
					}
					else console.log(error);
				});	
			}
			else
			{
				blog.likes+=1;
				blog.likedby.push(req.user._id);
				blog.save(function(error,blog)
				{
					if(!error)
						res.send(blog.likes.toString());
					else console.log(error);
				});	

			}	
		}
		else console.log(error);
	});
});

router.delete('/post/:id/remove',[isLoggedIn,owner],function(req,res)
{
	blogs.findById(req.params.id).populate({path:'comments',populate:{path:'replys'}}).populate('author').exec(function(error,blog)
	{
		if (error) {res.status("500");res.end();}
		else {
			deleteComments(blog.comments,function(f)
			{
				if(f)
				{
					console.log(blog.id,blog.author.id);
					removeFromAuthor(blog.id,blog.author.id);
					blogs.findByIdAndRemove(req.params.id,function(error,blog)
					{
						if (error) {console.log(error);}
						else res.status(200).send("/");
					})
				}
				else res.status(500).send();
			});
		}
	});
});

router.get('/post/:id/update',[isLoggedIn,ownerForGet],function(req,res)
{
	blogs.findById(req.params.id,function(error,blog)
	{
		if (error) {res.status("500");res.end();}
		else res.render('update',{blog:blog,tags:tags.split(',').sort()});
	});
});
router.put('/post/:id/update',[isLoggedIn,owner],function(req,res)
{
	if(image)
	{
		var type='.';
		type+=image.originalname.split('.')[1];
		datauri.format(type,fs.readFileSync(image.path));
		remove=image.path;
		req.body.blog.imgUri=datauri.content;
		image=null;
		fse.remove(remove);
		blogs.findByIdAndUpdate(req.params.id,req.body.blog,function(error,blog)
		{
			if (error) {res.status("500");res.end();}
			else res.status("200").end(req.params.id);
		});
	}
	else if(!(req.body.blog.imgUri))
	{
		blogs.findById(req.params.id,function(error,blog)
		{
			req.body.blog.imgUri=blog.imgUri;
			blogs.findByIdAndUpdate(req.params.id,req.body.blog,function(error,blog)
			{
				if (error) {res.status("500");res.end();}
				else res.status("200").end(req.params.id);
			});
		});
	}
	else
	{
		blogs.findByIdAndUpdate(req.params.id,req.body.blog,function(error,blog)
		{
			if (error) {res.status("500");res.end();}
			else res.status("200").end(req.params.id);
		});
	}
});
router.post('/comment/:id/reply',isLoggedIn,function(req,res)
{
	replys.create({
		content:req.body.Content,
		author:req.user._id
	},function(error,reply)
	{
		comments.findById(req.params.id,function(error,comment)
		{
			comment.replys.push(reply._id);
			comment.save(function(error,comment)
			{
				if (!error) {
					comments.findById(req.params.id).populate({
														path:'replys',
														populate:{path:'author'}
													}).sort('date').exec(function(error,comment)
													{
														res.render('reply',{comment:comment});
													});
				}
				else
				{
					console.log(error);
				}
			});
		});
	});
});

router.post('/post/:id/comment',isLoggedIn,function(req,res)
{
	// console.log("hello",req.params.id,req.body);
	comments.create({
		author:req.user._id,
		post:req.params.id,
		content:req.body.Content,
	},function(error,comment)
	{
		if(error) req.send('false');
		else
		{
			blogs.findById(req.params.id,function(error,blog)
			{
				if (error) {res.send('false');}
				else {
					blog.comments.push(comment._id);
					blog.save(function(error,blog)
					{
						if (error) {console.log(error)}
						else 
						{
							blogs.findById(req.params.id).populate('author')
														 .populate({
														 	path:'comments',
														 	populate:{path:'author'}})
														 .populate({
														  	path:'comments',
														 	populate:{path:'replys',
														 			  populate:{path:'author'}}
														  }).sort('date').exec(function(error,blog)
																			{
																				if (error) {console.log(error)}
																				else res.render('comment',{blog:blog});
																			});
						}
					});
				}
			});
		}
	});
});


router.post('/newPost',[isLoggedIn,upload.any()],function(req,res)
{
	a=new blogs(req.body.blog);
	a.author=req.user._id;
	if(req.files.length)
	{
		var type='.';
			type+=req.files[0].originalname.split('.')[1];
		datauri.format(type,fs.readFileSync(req.files[0].path));
		a.imgUri=datauri.content;
		remove=req.files[0].path;
	}
	a.save(function(error,post)
	{
		if(error) console.log(error)
		else {
			fse.remove(remove, function(err) {
				if (err) return console.error(err)
				else 
					{
						req.user.blogs.push(post.id);
						req.user.save();
						res.redirect('/');
					}
			});
		}
	});
});

function Save(user,res)
{
	user.save(function(error,user)
	{
		if(error) console.log(error);
		else 
		{
			console.log(user);
			res.redirect(`/${user.username}`);
		}
	});
}
router.get('/leaderboard',function(req,res)
{
	res.render('leaderboard');
});

router.get('/:username',function(req,res)
{
	users.findOne({username:req.params.username}).populate('edu').populate('blogs').exec(function(error,user)
	{
		if (error) {res.redirect('back');}
		else {
			res.render('profile',{User:user});
		}
	});
});
router.put('/:id',isLoggedIn,function(req,res)
{
	// console.log(req.body);
	req.body.Education.user=req.params.id;
	users.findByIdAndUpdate(req.params.id,req.body.user,function(error,user)
	{
		if(error) console.log(error);
		else
		{
			if(user.edu)
			{
				compareEdu(user.edu,req.body.Education,function(f)
				{
					if(!f)
					{
						edu.findOneAndUpdate({user:user.id},req.body.Education,function(error,edu)
						{
							if(error)console.log(error);
							else {
								user.edu=edu.id;
								Save(user,res);
							}
						});
					}
					else
					{
						res.redirect(`/${user.username}`)
					}
				});
			}
			else
			{
				edu.create(req.body.Education,function(error,edu)
				{
					if (error) {console.log(error);}
					else {
						user.edu=edu.id;
						Save(user,res);
					}
				});
			}
		}
	});
});

router.post('/profileImg',[isLoggedIn,upload.any()],function(req,res)
{
	users.findById(req.user.id,function(error,user)
	{
		if (error) {res.status("500");res.end();}
		else {
				var type='.';
				type+=req.files[0].originalname.split('.')[1];
				datauri.format(type,fs.readFileSync(req.files[0].path));
				user.profileImg=datauri.content;
				remove=req.files[0].path;
				user.save(function(error,user)
				{
					if(error) console.log(error)
					else {
						fse.remove(remove, function(err) {
							if (err) return console.error(err)
							else 
								{
									res.status('200');
									res.send(user.profileImg);
								}
						});
					}
				});
			}
	})
});
router.post('/coverImg',[isLoggedIn,upload.any()],function(req,res)
{
	users.findById(req.user.id,function(error,user)
	{
		if (error) {res.status("500");res.end();}
		else {
				var type='.';
				type+=req.files[0].originalname.split('.')[1];
				datauri.format(type,fs.readFileSync(req.files[0].path));
				user.coverImg=datauri.content;
				remove=req.files[0].path;
				user.save(function(error,user)
				{
					if(error) console.log(error)
					else {
						fse.remove(remove, function(err) {
							if (err) return console.error(err)
							else 
								{
									res.status('200');
									res.send(user.coverImg);
								}
						});
					}
				});
			}
	});
});

router.get('/:id/post',function(req,res)
{
	blogs.findById(req.params.id).populate('author')
								 .populate({
								 	path:'comments',
								 	populate:{path:'author'}})
								 .populate({
								  	path:'comments',
								 	populate:{path:'replys',
								 			  populate:{path:'author'}}
								  }).sort('date').exec(function(error,blog)
	{
		res.status("200").render('post',{blog:blog});
	});
});

router.post('/post/:id/Image',[isLoggedIn,ownerForGet,upload.any()],function(req,res)
{
	image=req.files[0];
	res.status('200').send();
});
module.exports=router;