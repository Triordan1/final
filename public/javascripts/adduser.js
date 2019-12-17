let isValid = function(){
    var result = true;
    var username = $("#username").val();
    var fullname = $("#fullname").val();
    var password = $("#password").val();
    var opassword = $("#opassword").val();
    if (fullname === ""){
        result = false;
        $("#result").html("Name required");
    }else if(username === ""){
        result = false;
        $("#result").html("Username required");
    }else if (password == ""){
        result = false;
        $("#result").html("Password required");
    }else if (password !== opassword){
        result = false;
        $("#result").html("Passwords don't match");
    }
    if (result){
        $("#result").hide();
    }
    return result;
}
$(document).ready(function () {
    $("#result").addClass("text-danger");
    console.log("test");
    $("#submit").on("click",function () {

        if (isValid()) {
            $.ajax({
                type: "POST",
                url: "/users/new",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    username: $("#username").val(),
                    fullname: $("#fullname").val(),
                    password: $("#password").val()
                }),
                success: function (data, status) {
                    console.log(data);
                    console.log(data.success);
                    if (data.success) {
                        console.log(data);
                        $("#result").html("Account created successfully");
                        $("#result").removeClass("text-danger");
                        $("#result").addClass("text-success");
                        $("#result").show();
                    } else {
                        console.log(data.message);
                        $("#result").html(data.message);
                        $("#result").show();
                    }
                }
            });
        }
    });
});