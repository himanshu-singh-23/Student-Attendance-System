var signupForm=$('signupForm'),
	data='',
	input=$("#signupForm input"),
	error=$('#showerror');
	// contact=$("input[name=Contact]"),
	// email=$("input[name=Email]");
input.on("change",function(e)
{
	// console.log(e.target.name.toUpperCase());
	if ($(this).val().length>=5){
		error.addClass('hidden');
		$("#"+e.target.name).addClass('loading');
		data={value:$(this).val()};
		$.ajax({
	    url:'/sign/validate/'+e.target.name,
	    type:'POST',
	    contentType:'application/json',
	    data:JSON.stringify(data)
	  })
	  .done(function(result){
	  	$("#"+e.target.name).removeClass('loading');
	    $("#"+e.target.name+" i").removeClass('red remove');
	    $("#"+e.target.name+" i").addClass('green check circle');
	    
	  })
	  .fail(function(err)
	  {
	  	$("#"+e.target.name).removeClass('loading');
	    $("#"+e.target.name+" i").removeClass('green check circle');
	    $("#"+e.target.name+" i").addClass('red remove');
	    error.removeClass('hidden');
	    error.html("User with Same "+e.target.name.toUpperCase()+" Already Present!!");
	  });
	}
	else {

		$("#"+e.target.name+" i").addClass('red remove');
		$("#"+e.target.name).removeClass('loading');
		error.removeClass('hidden');
		error.html(e.target.name.toUpperCase()+" Must be Greater than 5 Characters!!");	
	}
});
// Email.on("change",function()
// {
// 	if ($(this).val().length>5){
// 		$("#Email").addClass('loading');
// 		data={email:$(this).val()};
// 		$.ajax({
// 	    url:'/sign/validateUsername',
// 	    type:'POST',
// 	    contentType:'application/json',
// 	    data:JSON.stringify(data)
// 	  })
// 	  .done(function(result){
// 	  	$("#Email").removeClass('loading');
// 	    $("#Email i").addClass('green check circle');
// 	  })
// 	  .fail(function(err)
// 	  {
// 	  	$("#Email").removeClass('loading');
// 	    $("#Email i").addClass('red remove');
// 	  });
// 	}
// 	else {
// 		$("#Email").removeClass('loading');
		
// 	}
// });

// contact.on("change",function(e)
// {
// 	if ($(this).val().length>5){
// 		$("#Contact").addClass('loading');
// 		data={contact:$(this).val()};
// 		$.ajax({
// 	    url:'/sign/validateUsername',
// 	    type:'POST',
// 	    contentType:'application/json',
// 	    data:JSON.stringify(data)
// 	  })
// 	  .done(function(result){
// 	  	$("#Contact").removeClass('loading');
// 	    $("#Contact i").addClass('green check circle');
// 	  })
// 	  .fail(function(err)
// 	  {
// 	  	$("#Contact").removeClass('loading');
// 	    $("#Contact i").addClass('red remove');
// 	  });
// 	}
// 	else {
// 		$("#Contact").removeClass('loading');
		
// 	}
// });