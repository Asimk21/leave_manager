$('#dt1,#dt3').datetimepicker({
  format: 'YYYY/MM/DD',ignoreReadonly : true
});

function getBusinessDatesCount(startDate, endDate, dates) {
   var count = 0;
   var curDate = startDate;
   var datesArray=[];
   var monthData={};
   var firstMonth=startDate.toLocaleString("en-us", { month: "long" });
   while (curDate <= endDate) {
       var dayOfWeek = curDate.getDay();
       var newDate = curDate.toISOString().slice(0,10).replace(/-/g,"/");
       if(!((dayOfWeek == 6) || (dayOfWeek == 0) || dates.includes(newDate)))
       {
           if(firstMonth.valueOf() == curDate.toLocaleString("en-us", { month: "long" }).valueOf())
           {
              count++;
              curDate.setDate(curDate.getDate() + 1);
           }
           else
           {
               monthData[firstMonth]=count
               count=0
               firstMonth=curDate.toLocaleString("en-us", { month: "long" })
           }
      }
      else
      {
        curDate.setDate(curDate.getDate() + 1);
      }
   }

   monthData[firstMonth]=count
   var str = ''

   for (var i in monthData){
    str += i +":"+ monthData[i]+" "
  }

  return str
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
         var holidayStr = getBusinessDatesCount(d1, d2, dates);
         document.getElementById("dt5").value = holidayStr;
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
