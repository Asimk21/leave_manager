var api = require('./googleSheetApi')
var fs=require('fs');
var filePath = "./public/leave.json"

function compareLeaves(l1, l2){
     if(l1['from'] == l2['from']){
       if(l1['to'] == l2['to']){
         if(l1['status'] == l2['status']){
            if(l1['type'] == l2['type']){
              return true
            }else{
              return false
            }
         }else{
            return false
         }
       }else{
          return false
       }   
     }else{
          return false
     }
}

function findIndexOfMid(mid, leaveData){
   for(i=0; i<leaveData.length; i++){
      if(typeof leaveData[i][mid] != "undefined"){
          return i
      }
   }
}

function updateLeave(mid, existingLeave, newLeave){
   leaveData = JSON.parse(getJsonData())
   index = findIndexOfMid(mid, leaveData)
   leaves = leaveData[index][mid]['leaves']
   for(i =0; i<leaves.length; i++){
      if(compareLeaves(leaves[i], existingLeave)){
         leaves[i] = newLeave
         leaveData[index][mid]['leaves'] = leaves
         addedLeaveData = leaveData
         writeData(leaveData)
         return
      }
   }
}


function addLeaves(mid, leave){
  leaveData = [] 
  leaveData = JSON.parse(getJsonData())
  index = findIndexOfMid(mid, leaveData)
  delete leave.name
  delete leave.mid
  leaveData[index][mid]['leaves'].push(leave)
  addedLeaveData = leaveData
  writeData(addedLeaveData)
}

function mindExists(mid){
  leaveData = []
  leaveData = JSON.parse(getJsonData())
  if(leaveData.length == 0){
     return false
  }else {
    for(i=0; i<leaveData.length; i++){
      if(typeof leaveData[i][mid] != "undefined"){
         return true
      }
    }
    return false
  }
}

function addMind(mind){

  mindDetails = {}
  mindDetails[mind["mid"]] = {}
  mindDetails[mind["mid"]]["name"] = mind["name"]
  mindDetails[mind["mid"]]["leaves"] = []
  mindDetails[mind["mid"]]["leaves"][0] = {"from": mind["from"], "to": mind["to"], "dates": mind["dates"], "days": mind["days"], "cover": mind["cover"],"status": mind["status"], "type": mind["type"]}
  leaveData = [] 
  leaveData = JSON.parse(getJsonData())
  leaveData.push(mindDetails)
  writeData(leaveData)
}

function writeData(data){
console.log("Writing Data")
   fs.writeFileSync(filePath, JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('Json saved!');
      return;
   });
}

function getLeavesWithStatus(leaves, status){
  leaveTypeList = []
  for(i = 0; i<leaves.length; i++){
     if(leaves[i]["status"] == status){
        leaveTypeList.push(leaves[i])
     }
  }
  return leaveTypeList
}

function getMindLeavesByStatus(mid, status){
   leaves = getMindLeaves(mid)
   return getLeavesWithStatus(leaves, status) 
}

function getMindLeaves(mid){
   var leaveData = JSON.parse(getJsonData())
   if(typeof leaveData[0][mid] == "undefined"){
     return []
   }
   mindDetails = leaveData[0][mid]
   leaves = mindDetails["leaves"]
   return leaves
}

function getJsonData(){
   var data = fs.readFileSync(filePath);
   var leaveData = JSON.parse(data);
   return data
}

function isLong(data){
//console.log(data)
   if(data["rangeType"] === 'ShortRange'){
     data["cover"] = false
     data["status"] = "unapproved"
     api.updateCell(data)
   }else{
     data["cover"] = false
     data["status"] = "approved" 
   }
   x(data)
} 

function x(data){
  if(!mindExists(data["mid"])){
    // api.addRange(data)
  //   api.updateCell(data)
     addMind(data)
   }else{
   //  api.addRange(data)
    // api.updateCell(data)
     addLeaves(data["mid"], data)
   }
}

function updateLeaves(leaveData){
  data = leaveData["leavesToUpdate"]
  console.log("Data: "+data)
  for(i=0; i<data.length; i++){
    if(data[i]["status"] != "rejected"){
      console.log("xxxxxx" + data[i]["status"])
      api.updateCell(data[i])
    }
    existingLeave = {"from": data[i]["from"], "to": data[i]["to"], "status": "unapproved", "type": data[i]["type"], "dates": data[i]["dates"], "days": data[i]["days"]}
    updatedLeave = {"from": data[i]["from"],"to": data[i]["to"], "cover": data[i]["cover"], "status": data[i]["status"], "type": data[i]["type"], "dates": data[i]["dates"], "days": data[i]["days"]}
    mid = data[i]["mid"]
    updateLeave(mid, existingLeave, updatedLeave)
  }
  return
}

module.exports = {
   isLong: isLong,
   updateLeaves: updateLeaves
}
