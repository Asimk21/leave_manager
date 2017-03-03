var d = new Date()
var dd = d.getDate();
var mm = d.getMonth()+1;
var yyyy = d.getFullYear();
var months = ["January", "February"]

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

$.ajax({
       type: 'GET',
       url: 'bankHolidays',
       success: function(dates) {
         var holidayStr = getBusinessDatesCount(d1, d2, dates);
         document.getElementById("dt5").value = holidayStr;
      }
  });
});

$("#sick").click(function(){
  var leaveData = { empName: document.getElementById("??").value,
               mid : document.getElementById("??").value,
               leaveType: document.getElementById("??").value,
               cover: "sick",
               days = `${months[mm]}: 1`
             }
      $.ajax({
       type: 'GET',
       url: 'myaction',
       data: leaveData,
       success: function() {
//console.log
      }
  });
});

$("#annual").click(function(){
  var leaveData = { empName: document.getElementById("??").value,
               mid : document.getElementById("??").value,
               leaveType: document.getElementById("??").value,
               cover: document.getElementById("??").value,
               days = `${months[mm]}: 1`
             }
      $.ajax({
       type: 'GET',
       url: 'myaction',
       data: leaveData,
       success: function() {
//console.log
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
          	console.log("done")
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
