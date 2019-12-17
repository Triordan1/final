let isValid = function(){
    let result = true;
    $("#result").addClass("text-danger");
    if ($("#username").val() === ""){
        result = false;
        $("#result").html("Username required");
    }else if ($("#password").val() === ""){
        result = false;
        $("#result").html("Password required");
    }
    if(result){
        $("#result").removeClass("text-danger");
        $("#result").html("");
    }
    return result;
}
$(document).ready(function() {

    //event listener
    $("#login").on('click', login);

    function login() {
        console.log($("#password").val());
        if (isValid()) {
            $.ajax({
                type: "POST",
                url: "/login",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "username": $("#username").val(),
                    "password": $("#password").val(),
                }),
                success: function (data, status) {
                    console.log("got data back", data);
                    if (data.error) {
                        $("#result").html(data.error).css('color', 'red');
                    } else {
                        console.log(window.location.href);
                        window.location.href = "/users";
                    }
                },
                error: function (xhr, status, error) {
                    error = eval("(" + xhr.responseText + ")");
                    console.error(error);
                },
                complete: function (data, status) { //optional, used for debugging purposes
                    console.log(status);
                }
            });
        }
    }
});