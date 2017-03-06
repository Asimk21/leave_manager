

$(function() {
  console.log( "document loaded" );

  $.ajax({
          type: 'GET',
          url: 'adminDetails',
          success: function(details) {
            $('#mid').append(getOptions(details["mid"]));
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


$("#longLeave").click(function(e){
    $(".myData").toggle();
    e.preventDefault();
  });

$("#sickLeave").click(function(e){   
    e.preventDefault();
});

$("#annualLeave").click(function(e){   
    e.preventDefault();
});

// $("#calculate").click(function(e){   
//     e.preventDefault();
// });

$("#submit").click(function(e){   
    e.preventDefault();
});

