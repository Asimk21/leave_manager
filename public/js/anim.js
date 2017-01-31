$('#dt1,#dt3').datetimepicker({
  format: 'YYYY/MM/DD',ignoreReadonly : true
});

function getBusinessDatesCount(startDate, endDate, dates) {
  var count = 0;
  var curDate = startDate;
  while (curDate <= endDate) {

    var dayOfWeek = curDate.getDay();
    var newDate = curDate.getFullYear()+"/"+curDate.getMonth()+1+"/"+curDate.getDate();
    if(!((dayOfWeek == 6) || (dayOfWeek == 0) || dates.includes(newDate)))
    {
       count++;
   }
    curDate.setDate(curDate.getDate() + 1);
}
return count;
}

$("#button_id").click(function(){
// do something when button is clicked
var from_date = document.getElementById("dt2").value.toString();
var to_date = document.getElementById("dt4").value.toString();
var d1 = new Date(from_date);
var d2 = new Date(to_date);
$.ajax({
       type: 'GET',
       url: 'bankHolidays',
       success: function(dates) {
         var count = getBusinessDatesCount(d1, d2, dates);
         document.getElementById("dt5").value = count;
      }
  });
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
          	document.getElementById("empName").value=empName;
         }

     });
});


// $("#submit_leave").click(function () {
//     employeeID = document.getElementById("mid").value;
//     duration = "5"; //document.getElementById("");
//     leave_type = document.getElementById("leave").value;
//
//     $.ajax({
//       type: 'POST',
//       data: {"mid": employeeID, "duration": duration, "leave_type": leave_type },
//       url: 'myaction',
//       success: function(msg){
// 		window.location = msg;
// 	  }
//
//   });
// });
