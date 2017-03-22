var api = require('./googleSheetApi')
var fs=require('fs');

var filePath = "./public/leave.json"

function getLeaves() {
  var data=fs.readFileSync(filePath);
  console.log(JSON.parse(data))
  var leaves = JSON.parse(data);
  return leaves;
}

function saveLeaves(leaves){
   fs.writeFile(filePath, JSON.stringify(leaves), (err) => {
     if (err) throw err;
     console.log('Json saved!');
     return;
   });
}


function addLeaves(leave){
  leaves = getLeaves()
  leaves.push(leave)
  saveLeaves(leaves)
}

function removeLeaves(data){
   //index is an array. This function removes element present on the index
   index = data.leave
   leaves = getLeaves()
   for(var i=0; i < index.length; i++){
     var leave = leaves.splice(index[i] - i,1)[0]
     console.log(leave)
     if (data.action != "Reject") {
        if (data.action === "Cover") {
            leave.cover = true
        }
        api.addRange(leave)
        api.updateCell(leave)
     }
   }
   saveLeaves(leaves)
}

function isLong(data){
  if (data.rangeType === 'ShortRange') {
    data.cover = false
    api.addRange(data)
    api.updateCell(data)
  }else {
    addLeaves(data)
  }
}


module.exports = {
   addLeaves: addLeaves,
   removeLeaves: removeLeaves,
   isLong: isLong
}
