
const socket = io()
var timeoutId;
var urlpath = window.location.pathname ;
var originName = window.location.origin;
var id = window.location.pathname;
id = id.replace(/\//g, "");
var new_url;
console.log(id);

socket.on("onload_" + urlpath, (data)=>{
    console.log(data)
    $("#textarea1").html(data);
})
socket.on("error_page", ()=>{
    $("#main-body").css("opacity","0");
    $("#login").css("opacity","0");
    $("#error").css("opacity","1");
    $("#error").css("visibility","visible");
})
socket.on("login_" + urlpath, ()=>{
    console.log("client")
    $("#login").css("visibility","visible");
    $("#login").css("opacity","1");
    $("#main-body").css("opacity","0");
})

socket.on("success",()=> {
    $(".pad-top").css("visibility","hidden");
    $(".pad-top").css("opacity","0");
    $("#main-body").css("opacity","1");
})
socket.on("failed",()=>{
    $("#fail-message").html("<p>Password Wrong...Try Again</p>");
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        $("#fail-message").html("<p> </p>");
    }, 5000);
})
$("#textarea1").on('input propertychange',(e) =>{
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {

        // Runs 1 second (1000 ms) after the last change
        senddata($("#textarea1").val());

    }, 1000);
})

function login_btn(){
    const login_psw = $("#login-psw").val();
    socket.emit('login_psw_'+urlpath , login_psw);
}

function senddata(data){
    socket.emit('data_'+urlpath ,data)
}



function save_password(){

        var pattern = /^[a-zA-Z0-9@]*$/;
        // Runs 1 second (1000 ms) after the last change
        const psw =  $(".input-password").val();
        var check;
        if(psw.match(pattern))
        {
            check = true;
        }
        else
        {
            check = false;
        }
        console.log(check);
        if(check==true){
        socket.emit('psw_'+urlpath , psw);
        $("#in-psw").val("");
        $("#password").css("opacity","0");
        response();
        console.log(psw);
        }
        else{
            $("#valid").css("opacity","1");
            $("#valid").html("Not Valid Password");
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                $("#valid").css("opacity","0");
                console.log("Not allowed psw")
            }, 2000);
        }
}

function update_url(){

        new_url =  $(".input-url").val();

        socket.emit('update_url_'+urlpath , new_url);
}
socket.on("Not_saved",()=>{
    $("#response-message").css("opacity","1");
    $("#response-message").css("background-color","rgb(224 30 30)");
    $("#response-message").css("color","#fff");
    $("#response-message").html("<p>This Url Already Registered. </p>")
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        $("#response-message").css("opacity","0");
    }, 2000);
})
socket.on("save_success",()=>{
    window.location.replace(originName+new_url)
})
socket.on('data_'+ urlpath, (data) => {
    $("#textarea1").html(data);
})

function response(){

    $("#response-message").css("opacity","1");
    $("#response-message").css("background-color","#4CAF50");
    $("#response-message").html("<p>Password Saved Sucessfully .</p>")
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        $("#response-message").css("opacity","0");
    }, 2000);
}
document.getElementById("login-psw").addEventListener("keyup", function(e) {
    if (e.code === 'Enter') {
        login_btn();
    }
  });
document.getElementById("url-input").addEventListener("keyup", function(e) {
    if (e.code === 'Enter') {
        update_url();
    }
});
document.getElementById("in-psw").addEventListener("keyup", function(e) {
    if (e.code === 'Enter') {
        save_password();
    }
});

function show_password(){

    $("#password").css("opacity","1")
    $("#password").css("visibility","visible")

}
function show_custom_url(){

    $("#custom-url").css("opacity","1")
    $("#custom-url").css("visibility","visible")
    $(".input-url").val(urlpath);

}
function close_modal(){

    $("#password").css("opacity","0")
    $("#password").css("visibility","hidden")

    $("#custom-url").css("opacity","0")
    $("#custom-url").css("visibility","hidden")

}
socket.on("shared_"+ urlpath , (data) =>{
    $("#textarea1").html(data);
    $(".fl-right").css("opacity","0");
    $(".fl-right").css("visibility","hidden");
    $(".footer-share").css("opacity","0");
    $(".footer-share").css("visibility","hidden");
    document.getElementById("textarea1").readOnly = true;
})
function share_button(){

    var $temp = $("<input>");
    var $url = originName+"/s"+urlpath;

      $("body").append($temp);
      $temp.val($url).select();
      document.execCommand("copy");
      $temp.remove();

    // document.getElementById("textarea1").readOnly = true;
}
