var mm = new Date().getMonth()+1;
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var datesArray

function getCurrentDate(){
  var d = new Date()
  var dd = d.getDate();
  var mm = d.getMonth()+1;
  var yyyy = d.getFullYear();
  return(mm+'/'+dd+'/'+yyyy)
}


function getBusinessDatesCount(startDate, endDate, dates) {
   var count = 0;
   var curDate = startDate;
   datesArray=new Array();
   var monthData={};
   var firstMonth=startDate.toLocaleString("en-us", { month: "long" });
   while (curDate <= endDate) {
       var dayOfWeek = curDate.getDay();
       var newDate = curDate.toISOString().slice(0,10).replace(/-/g,"/");
       if(!((dayOfWeek == 6) || (dayOfWeek == 0) || dates.includes(newDate)))
       {
           if(firstMonth.valueOf() == curDate.toLocaleString("en-us", { month: "long" }).valueOf())
           {
              datesArray.push(curDate.getMonth()+1+'/'+curDate.getDate()+'/'+curDate.getFullYear())
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

$(function() {
  console.log( "document loaded" );
  var date = getCurrentDate()
  document.getElementById('fDate').value = date
  document.getElementById('tDate').value = date
  document.getElementById('duration').value = months[mm]+': 1'
  $.ajax({
          type: 'GET',
          url: 'adminDetails',
          success: function(details) {
            $('#mid').append(getOptions(details["mid"].sort()));
          }
  });


  var getOptions = function(data){
    var option = '';
    for (var i=0; i< data.length; i++){
      if(!(data[i] == "")){
        option += '<option value="'+ data[i] + '">' + data[i] + '</option>';
      }
    }
    return option;
  }
});

$("#mid").change(function () {
    var employeeID = $("#mid option:selected").text();
    var empName

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

$('#fromDate,#toDate').datetimepicker({
   locale: 'en-GB',format: 'MM/DD/YYYY',ignoreReadonly : true
});

$("#toDate").change(function () {
  // document.getElementById('duration').value = "Hello"
  e.preventDefault();
  var from_date = document.getElementById("fDate").value.toString();
  var to_date = document.getElementById("tDate").value.toString();
  var d1 = new Date(from_date);
  var d2 = new Date(to_date);
  $.ajax({
       type: 'GET',
       url: 'bankHolidays',
       success: function(dates) {
         var holidayStr = getBusinessDatesCount(d1, d2, dates);
         document.getElementById("duration").value = holidayStr;
      }
  });
});

// $("#toDate").datetimepicker({
//   onSelect: function(dateText) {
//     display("Selected date: " + dateText + "; input's current value: " + this.value);
//   }
// });

// $("#longLeave").click(function(e){
//     $(".myData").toggle();
//     e.preventDefault();
//   });

$("#sickLeave").click(function(){
  var name = document.getElementById("empName").value
  var mid = document.getElementById("mid").value

  if (mid == 'Select MID'){
    alert("Please select a valid MID")
    return false
  }

  var currentDate = getCurrentDate()
  var leaveData = { name: document.getElementById("empName").value,
               mid : document.getElementById("mid").value,
               type: "Sick Leave",
               days : document.getElementById('duration').value,
               from: document.getElementById('fDate').value,
               to: document.getElementById('tDate').value,
               dates: datesArray.join(',')
             }
      $.ajax({
       type: 'POST',
       url: 'myaction',
       data: leaveData,
       success: function() {
         console.log("Done adding data")
      }
  });
});

$("#annualLeave").click(function(){
  var name = document.getElementById("empName").value
  var mid = document.getElementById("mid").value

  if (mid == 'Select MID'){
    alert("Please select a valid MID")
    return false
  }

  var currentDate = getCurrentDate()
  var leaveData = { name: document.getElementById("empName").value,
               mid : document.getElementById("mid").value,
               type: "Annual Leave",
               days : document.getElementById('duration').value,
               from: document.getElementById('fDate').value,
               to: document.getElementById('tDate').value,
               dates: datesArray.join(',')
             }
      $.ajax({
       type: 'POST',
       url: 'myaction',
       data: leaveData,
       success: function() {
        console.log("Done adding data")
      }
  });
});

$("#calculate").click(function(e){
  e.preventDefault();
  var from_date = document.getElementById("fDate").value.toString();
  var to_date = document.getElementById("tDate").value.toString();
  var d1 = new Date(from_date);
  var d2 = new Date(to_date);
  $.ajax({
       type: 'GET',
       url: 'bankHolidays',
       success: function(dates) {
         var holidayStr = getBusinessDatesCount(d1, d2, dates);
         document.getElementById("duration").value = holidayStr;
      }
  });
});
