$(document).ready(function() {
   console.log( "document loaded" );
   $.ajax({
          type: 'GET',
          url: 'adminDetails',
          success: function(details) {
            $('#mid').append(getOptions(details["mid"]));
            $('#leave').append(getOptions(details["leave"]));
         }

     });
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