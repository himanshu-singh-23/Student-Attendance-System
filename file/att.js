$('#file1').on('mouseleave',function(event) {
var tmppath = URL.createObjectURL(event.target.files[0]);
	console.log(tmppath);
    $("img").fadeIn("fast").attr('src',tmppath);       
});