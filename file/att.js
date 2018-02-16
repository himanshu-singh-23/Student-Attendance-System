var tags=$('#tags'),
    button=$('button[name=show]'),
    profileImage=$('input[name=fd]'),
    coverImage=$('input[name=coverImg]'),
    reply=$('.reply'),
    span=$('#val'),
    x="#",
    y="#comment",
    z="#short",
    w="#reply",
    span="#span",
    span1="#span1",
    textarea=$('textarea'),
    comment=$('button[name=Comments]'),
    replys=$('button[name=Replys]')
    like=$('button[name=Like]'),
    content="#content",
    contentre="#recontent",
    edit=$('button[name=edit]');
	  tag=$('#tag');

// console.log(reply); 

$('profileForm #pincode').on('change',function(e)
{
  console.log('hello');
  $.ajax({
    url:'http://postalpincode.in/api/pincode/'+$(this).val(),
    type:'GET'
  }).done(function(result)
  {
    console.log(result);
  })
  .fail(function(error)
  {
    console.log(error);
  });
})
function Reply()
{
  reply=$('.reply');
  // console.log(reply);
  replys=$('button[name=Replys]') 
}
//  .log(profileImage);
coverImage.on('change',function(e)
{
  var form_data = new FormData();                
  form_data.append("file",$(this).prop("files")[0]);   
  $.ajax({
    url:'/coverImg',
    type:'POST',
    contentType:false,
    processData: false,
    data:form_data
  })
  .done(function(result){
    $('#coverimage1').prop('src',result);
  })
  .fail(function(err)
  {
    swal("Oops", "We couldn't connect to the server!", "error");
  });  
});

profileImage.on('change',function(e)
{
  var form_data = new FormData();                
  form_data.append("file",$(this).prop("files")[0]);   
  $.ajax({
    url:'/profileImg',
    type:'POST',
    contentType:false,
    processData: false,
    data:form_data
  })
  .done(function(result){
    $('#profileimage1').prop('src',result);
  })
  .fail(function(err)
  {
    swal("Oops", "We couldn't connect to the server!", "error");
  });  
});

edit.on('click',function(e)
{
  e.preventDefault();
  e.stopImmediatePropagation();
  if($(this).val()!='postEdit')
    $(`#${$(this).val()}`).toggleClass('disp');
  else
   $(`#${$(this).val()}`).toggleClass('disp cards');
  // console.log('selected');
});

reply.on('click',function(e)
{
  // console.log('hello');
  var x=$(this).attr('name');
  w+=x;
  $(w).toggleClass('disp');
  w='#reply';
  e.preventDefault();
  e.stopImmediatePropagation();
});

replys.on('click',function(e){
  var x=$(this).val();
  contentre+=x;
  // console.log($(contentre).val());
  var Data={Content:$(contentre).val()};
  e.preventDefault();
  e.stopImmediatePropagation();
  $.ajax({
    url:`\\comment\\${x}\\reply`,
    type:"POST",
    contentType:'application/json',
    data:JSON.stringify(Data)
  })
  .done(function(result){
    $(contentre).val('');
    var div=document.getElementById(`replys${x}`);
    div.innerHTML=result;
    contentre="#recontent";
  })
  .fail(function(err){
    contentre="#recontent";
    swal("Oops", "We couldn't connect to the server!", "error");
  });
});


like.on('click',function(e)
{
    var x=$(this);
    var a=document.getElementById(`likes${x.val()}`);
    x.toggleClass('basic');
    if (x.html()=='<i class="thumbs up icon"></i> Like'){
      a.innerHTML=parseInt(a.innerHTML)+1;
      x.html('<i class="thumbs up icon"></i> Liked');
    }
    else {
      x.html('<i class="thumbs up icon"></i> Like');
      a.innerHTML=max(0,parseInt(a.innerHTML)-1);
    }
  $.ajax({
    url:`\\post\\${x.val()}\\like`,
    type:"POST",
    contentType:'application/json',
  })
  .fail(function(err){
    swal("Oops", "We couldn't connect to the server!", "error");
  });
  e.preventDefault();
  e.stopImmediatePropagation();
});

comment.on('click',function(e)
{
  var x=$(this).val();
  content+=x;
  // console.log($(content).val());
  var Data={Content:$(content).val()};
  e.preventDefault();
  e.stopImmediatePropagation();
  $.ajax({
    url:`\\post\\${$(this).val()}\\comment`,
    type:"POST",
    contentType:'application/json',
    data:JSON.stringify(Data)
  })
  .done(function(result){
    $(content).val('');
    var div=document.getElementById(`div${x}`);
    div.innerHTML=result;
    content="#content";
    Reply();
  })
  .fail(function(err){
    content="#content";
    swal("Oops", "We couldn't connect to the server!", "error");
  });
});

button.on('click',function(e)
{
  $(this).toggleClass('below');
  x+=$(this).val();
  y+=$(this).val();
  z+=$(this).val();
  span+=$(this).val();
  span1+=$(this).val();
  $(x).toggleClass('disp');
  $(y).toggleClass('disp');
  $(z).toggleClass('disp');
  $(span1).toggleClass('disp');
  $(span).toggleClass('disp');
  x='#';
  y='#comment';
  z='#short';
  span="#span",
  span1="#span1",
  e.stopPropagation();
});


tag.on('change',function (e) 
{ 
	tags.val(tags.val()+" "+tag.val().toLowerCase().replace(/ /g,'+'));
	e.stopPropagation();
});


textarea.on('change',function(){
$(this).val($(this).val().replace(/\n/g, '<br>'));
});

function Delete(postId,userId) {
    var data={author:userId};
    swal({
      title: "Are you sure?",  
      text: "Are you sure that you want to delete this post?", 
      type: "warning",
      showCancelButton: true,
      cancelButtonText: 'No, keep it',
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#ec6c62"
    }).then(function(result){
      if (result.value) {
          $.ajax({
            url: "/post/"+postId+"/remove",
            type: "DELETE",
            contentType:'application/json',
            data:JSON.stringify(data)
          })
          .done(function(data) {
            swal("Deleted!", "Your file was successfully deleted!", "success")
            .then(function()
              { 
                window.location=data;
              });
          })
          .fail(function(error) {
            swal("Oops", "We couldn't connect to the server!", "error");
          });
      }
      else
      {
          swal('Cancelled','Your imaginary file is safe :)','error')  ;
      }
    });
}
function Update(postId,userId) {
  var blog = $('#updateForm').serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  blog.content=CKEDITOR.instances.content.getData();
  var data={author:userId,blog:blog};
  $.ajax({
    url: "/post/"+postId+"/update",
    type: "PUT",
    contentType:'application/json',
    data:JSON.stringify(data)
  })
  .done(function(data){
    swal("Updated!", "Your file was successfully Updated!", "success")
    .then(function(){
      window.location="/"+data+"/post";
    });
  })
  .fail(function(error) {
    console.log(error);
    swal("Oops","We couldn't connect to the server!", "error");
  });
}

function UpdateImage(postId)
{
  var form_data = new FormData();                
  form_data.append("file",$('input[type=file]').prop("files")[0]);   
  $.ajax({
    url:"/post/"+postId+"/Image",
    type:'POST',
    contentType:false,
    processData: false,
    data:form_data
  })
  .done(function(result){
    $('input[name=imgUri]').val('');
   swal("Uploaded", "Your Image Updated!", "success");
  })
  .fail(function(err)
  {
    swal("Oops", "We couldn't connect to the server!", "error");
  });
}

function showLikes(likedby)
{
  console.log('yes');
  var likes="";
  likedby.forEach(function(user)
  { 
    likes+=`<a href="/${user.username}">${user.name}</a>`
  });
  swal({
  title: 'Likes',
  type: 'info',
  html:likes,
  showCloseButton: true,
  showCancelButton: false,
  focusConfirm: false,
})
}