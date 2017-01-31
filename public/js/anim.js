$('#dt1,#dt3').datetimepicker({
locale: 'en-GB',format: 'DD/MM/YYYY',ignoreReadonly : true
});

//fetch dates
$("#button_id").click(function(){
// do something when button is clicked
var from_date = document.getElementById("dt2").value;
var to_date = document.getElementById("dt4").value;

var a = moment(from_date, 'DD/MM/YYYY');
var b = moment(to_date, 'DD/MM/YYYY');
var days = b.diff(a, 'days');

alert(days);
});


$("#mid").change(function () {
    var employeeID= $("#mid option:selected").text();
    var empName = "";

    $.ajax({
          type: 'GET',
          data: {"mid": employeeID },
          url: 'mindDetails',
          success: function(mDetails) {
          	empName = mDetails[0].name
          	$("#name").text("Hello " +empName + "!!!");
         }

     });
});


$("#submit_leave").click(function () {
    employeeID = document.getElementById("mid").value;
    duration = "5"; //document.getElementById("");
    leave_type = document.getElementById("leave").value;

    $.ajax({
      type: 'POST',
      data: {"mid": employeeID, "duration": duration, "leave_type": leave_type },
      url: 'myaction',
      success: function(msg){
		window.location = msg;
	  }

     });
});
