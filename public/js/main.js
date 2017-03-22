var d = new Date()
var dd = d.getDate();
var mm = d.getMonth()+1;
var yyyy = d.getFullYear();
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var datesArray = new Array()

console.log("dates array 1", datesArray)

function getCurrentDate(){
  return(mm+'/'+dd+'/'+yyyy)
}


var date = getCurrentDate();

function getBusinessDatesCount(startDate, endDate, dates) {
   var count = 0;
   var curDate = startDate;
   datesArray= new Array();
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

  document.getElementById('fDate').value = date
  document.getElementById('tDate').value = date
  document.getElementById('duration').value = months[mm - 1]+':1 '
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

function verify_date(from_date, to_date){
  if (to_date < from_date){
  //  document.getElementById('fDate').value = date
    document.getElementById('tDate').value = date
    document.getElementById('duration').value = months[mm - 1]+':1 '
    alert("To date should be greater than From date");
    return false;
  }
  return true
}

function calculateLeaveDates(from_date, to_date){
  var d1 = new Date(from_date);
  var d2 = new Date(to_date);
  if(!verify_date(d1, d2)){
    return
  }
  $.ajax({
       type: 'GET',
       url: 'bankHolidays',
       success: function(dates) {
         var holidayStr = getBusinessDatesCount(d1, d2, dates);
         document.getElementById("duration").value = holidayStr;
      }
  });
}

function durationType(dates){
  if (dates.length <= 3) {
      return("ShortRange")
  }else {
      return("LongRange")
  }
}

function checksAndCreateData(){
  var name = document.getElementById("empName").value
  var mid = document.getElementById("mid").value

  if (mid == 'Select MID'){
    alert("Please select a valid MID")
    return false
  }

  var from_date = document.getElementById("fDate").value.toString();
  var to_date = document.getElementById("tDate").value.toString();
  var d1 = new Date(from_date);
  var d2 = new Date(to_date);

  if(!verify_date(d1, d2)){
    return
  }

  if (datesArray.length == 0){
    datesArray.push(from_date)
  }

  var type = durationType(datesArray)

  var leaveData = {
               dates: datesArray.join(','),
               name: document.getElementById("empName").value,
               mid : document.getElementById("mid").value,
               days : document.getElementById('duration').value,
               from: document.getElementById("fDate").value,
               to: document.getElementById("tDate").value,
               rangeType: type
             }
  console.log(leaveData)
  return leaveData
}

$('#toDate').on('dp.change', function () {
    var from_date = document.getElementById("fDate").value.toString();
    var to_date = document.getElementById("tDate").value.toString();
    calculateLeaveDates(from_date, to_date)
   }
 );

 $('#fromDate').on('dp.change', function () {
     var from_date = document.getElementById("fDate").value.toString();
     var to_date = document.getElementById("tDate").value.toString();
     var d1 = new Date(from_date);
     var d2 = new Date(to_date);
     if(d1 < new Date())
      calculateLeaveDates(from_date, to_date)
    }
  );

$("#sickLeave").click(function(){
    var leaveData = checksAndCreateData()
    if(leaveData){
      leaveData["type"] = "Sick Leave"
      console.log(leaveData)
      $.ajax({
       type: 'POST',
       url: 'myaction',
       data: leaveData,
       success: function() {
         console.log("Done adding data")
      }
    });
    }

});

$("#annualLeave").click(function(){
    var leaveData = checksAndCreateData()
    if(leaveData){
      leaveData["type"] = "Annual Leave"
      $.ajax({
      type: 'POST',
      url: 'myaction',
      data: leaveData,
      success: function() {
        console.log("Done adding data")
      }
    });
    }

});
