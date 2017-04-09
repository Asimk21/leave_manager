function makeCheckboxes(data){
  data.forEach(function(dat, i){
    str = dat.name + '-' + dat.type + '-' +  dat.from+ '-' + dat.to
    document.getElementById("Leaves").innerHTML = document.getElementById("Leaves").innerHTML + ` <label><input class="position" id="index_${i}" type="checkbox" name="leave" value="${i}"> ${str}<br></label>`
  })
}


$('document').ready(function () {
  $.getJSON('leave.json', function (data){
    makeCheckboxes(getUnapprovedLeaves(data))
  })
})

$("#leaveNoCover").click(function(){
  $.getJSON('leave.json', function (data){
    unapprovedLeaves = getUnapprovedLeaves(data)
    approvedLeaveIndex = []
    leavesToUpdate = []
    for(i=0; i<unapprovedLeaves.length; i++){
      if(document.getElementById("index_"+i).checked){
         unapprovedLeaves[i]["cover"] = false
         unapprovedLeaves[i]["status"] = "approved"
         leavesToUpdate.push(unapprovedLeaves[i])
      }
    }
    data = {"leavesToUpdate": leavesToUpdate}
    
    $.ajax({
       type: 'POST',
       url:  'approval',
       dataType: 'json',
       data: data, 
       success: function(){
          console.log("Leaves Updated")
       }
    });
  })
});

$("#leaveCover").click(function(){
  $.getJSON('leave.json', function (data){
    unapprovedLeaves = getUnapprovedLeaves(data)
    approvedLeaveIndex = []
    leavesToUpdate = []
    for(i=0; i<unapprovedLeaves.length; i++){
      if(document.getElementById("index_"+i).checked){
         unapprovedLeaves[i]["cover"] = true
         unapprovedLeaves[i]["status"] = "approved"
         leavesToUpdate.push(unapprovedLeaves[i])
      }
    }
    data = {"leavesToUpdate": leavesToUpdate}
    
    $.ajax({
       type: 'POST',
       url:  'approval',
       dataType: 'json',
       data: data, 
       success: function(){
          console.log("Leaves Updated")
       }
    });
  })
});

$("#reject").click(function(){
  $.getJSON('leave.json', function (data){
    unapprovedLeaves = getUnapprovedLeaves(data)
    approvedLeaveIndex = []
    leavesToUpdate = []
    for(i=0; i<unapprovedLeaves.length; i++){
      if(document.getElementById("index_"+i).checked){
         unapprovedLeaves[i]["status"] = "rejected"
         leavesToUpdate.push(unapprovedLeaves[i])
      }
    }
    data = {"leavesToUpdate": leavesToUpdate}
    
    $.ajax({
       type: 'POST',
       url:  'approval',
       dataType: 'json',
       data: data, 
       success: function(){
          console.log("Leaves Updated")
       }
    });
  })
});

function getUnapprovedLeaves(data){
  unapprovedLeaves = []
  for(i=0; i<data.length; i++){
     key = Object.keys(data[i])
     leaves = data[i][key]["leaves"]
     for(k=0; k<leaves.length; k++){
        if(leaves[k]["status"] == "unapproved"){
            unapprovedLeaves.push(
                { 
                  "mid":      key[0],
                  "name":     data[i][key]["name"],
                  "type":     leaves[k]["type"],
                  "from":     leaves[k]["from"],
                  "to":       leaves[k]["to"],
                  "dates":    leaves[k]["dates"],
                  "days":     leaves[k]["days"],
                  "rangeType": "LongRange" 
                }
            )
        }
     } 
  }
  return unapprovedLeaves
}
