<script>
        var modal = document.getElementById("modal");
        var button = document.getElementById("button");
        var span = document.getElementsByClassName("close")[0];
        var modal2 = document.getElementById("modal2");
        var span2 = document.getElementsByClassName("close2")[0];
        $(document).ready(function() {
            $('#logIn').html("Logged in as: " + "{{loggedIn}}");

            $.ajax({
                type: "POST",
                url: "/getAppointments",
                dataType: "json",
                contentType: "application/json",
        
                success: function(result, status) {
                    console.log(result);
                    console.log(result.success);
                    if (result.response) {
                        console.log(result);
                    } else {
                        console.log(result.message);
                    }
                    console.log("result is this: ", result);
                    for (let i = 0; i < result.retrievedReviews.length; i++) {
                            let date = result.retrievedReviews[i].Date.substring(0, 10);
                            let start = result.retrievedReviews[i].Start.substring(0, 5);
                            let end = result.retrievedReviews[i].End.substring(0, 5);
                            $("#main").append(`
                            <div id="slot${i}" class='d-flex mb-3 justify-content-between' >
                                span class="flex-container" >
                                <div>
                                <span class="font-weight-bold">Date: </span><span${date}</span>
                                </div>
                                <div>
                                <span class="font-weight-bold">Start Time: </span><span>${start}</span>
                                </div>
                                <div>
                                <span class="font-weight-bold">End Time: </span><span>${end}</span>
                                </div>
                                </span>
                                <span>
                                    <button type='button' id="${"dbutton" + i}" class="btn btn-info" value="${result.retrievedTimeSlots[i].timeSlotId}" >Delete Time Slot</button>
                                </span>
                            </div>
                                <hr>`);
                            $(`#dbutton${i}`).click(function () {
                                modalFunc(`${result.retrievedReviews[i].scheduleId}`);
                            });
                        }
                    }
                
            });
            var tempId;
            function modalFunc(deleted){
                modal2.style.display = "block";
                tempId = deleted;
                 
            }
            $('#confirmDelete').on("click", function() {
                 deleteReview(tempId);
             });
            function deleteReview(id) {
                
                
                $.ajax({
                    url: "/deleteAppointment",
                    method: "POST",
                    data: {
                        reviewid: id
                    }
                    ,
                    success: function(result, status) {
                        console.log(result);
                        if (result.successful) {
                        }
                        else {
                            $("#errorMessage").html(result.message).css("color", 'red');
                        }
                        location.reload();
                    }
                }); //ajax
            }
            button.onclick = function() {
                modal.style.display = "block";
            };
            span.onclick = function() {
                modal.style.display = "none";
            };
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
            span2.onclick = function() {
                modal2.style.display = "none";
            };
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal2.style.display = "none";
                }
            };
            $("#logout").on("click", logout);
            function logout() {
                $.ajax({
                    url: "/signOut",
                    method: "GET",
                    success: function(result, status) {
                        console.log(result);
                        
                        if (result.successful) {
                            window.location.href = "/";
                        }
                        else {
                            $("#errorMessage").html(result.message).css("color", 'red');
                        }
                    }
                }); //ajax
            }
             $('#confirmTime').on("click", function() {
                    $.ajax({
                        url: "/addAppointment",
                        method: "POST",
                        data: {
                            date: $('#date').val(),
                            start: String($('#start').val()),
                            endTime: String($('#end').val())
                        },
                                                   success: function(result, status) {
                                console.log(result);
                                if (result.successful) {
                                }
                                else {
                                    $("#errorMessage").html(result.message).css("color", 'red');
                                }
                            }
                        }); //ajax
                        location.reload();
                    });
            });
    </script>