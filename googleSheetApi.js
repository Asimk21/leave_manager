var GoogleSpreadsheet = require('google-spreadsheet')
var creds = require('./cred.json');
var _ = require('lodash')
var creds_json = {
      client_email: creds.client_email,
      private_key: creds.private_key
    }
// spreadsheet key is the long id in the sheets URL
var document = new GoogleSpreadsheet('1cdgY_bTVFjkxxa7Wq-3HWTa9NmLE9Qebc1Oq4jISkr4')
var sheet

function updateCell(data){
  var name = data.empName
  var mid = data.mid
  var leaveType = data.leaveType
  var cover = data.cover
  var days = data.days.split(" ")
  days.pop()
  document.useServiceAccountAuth(creds,function(doc){
    document.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      days.forEach((monthData) => {
          var dataArr = monthData.split(":")
          sheet = getSheet(info, dataArr[0])
          sheet.getRows({
            limit: 50
            }, function (err, rows){
              console.log("Rows length" + rows.length)
              for (var i = 0; i < rows.length; i++) {
                row = rows[i]
                console.log(row.name, name)
                if (row.name == name){
                  row.leaves = row.leaves? parseInt(row.leaves) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                  if (leaveType == 'Annual Leave'){
                    row.annual = row.annual ? parseInt(row.annual) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                  }else{
                    row.sick = row.sick ? parseInt(row.sick) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                  }
                  if (cover == 'Yes'){
                    row.cover = row.cover ? parseInt(row.cover) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                  }
                  row.save(()=>{
                    console.log("updated")
                  })
                  i = rows.length
                }
              }
          })
      })
    })
  })
}

function getAdminSheetRows(callback){
 document.useServiceAccountAuth(creds,function(doc){
        document.getInfo(function(err, info){
            sheet = getSheet(info, 'Master'); //info.worksheets[0];
            sheet.getRows(function(err, rows) {
                if (err){
                    console.log(err);
                }
                else {
                   callback(rows);
                }
            })
        })
    })
}

function getAdminSheetRowsByMid(mid, callback){
 document.useServiceAccountAuth(creds,function(doc){
        document.getInfo(function(err, info){
            sheet = getSheet(info, 'Master'); //info.worksheets[0];
            sheet.getRows(function(err, rows) {
                if (err){
                    callback("error", null);
                }
                else {
                    rows.forEach(function(row) {
                      if(row.mid == mid){
                       callback(null, row);
                      }
                    });
                }
            })
        })
    })
}

function getSubsetObject(object, callback){
  console.log("Object", object)
  document.useServiceAccountAuth(creds,function(doc){
         document.getInfo(function(err, info){
             sheet = getSheet(info, object.sheetName);
             var result = [] //info.worksheets[0];
             sheet.getRows(function(err, rows) {
               if (err){
                   callback("error", null);
               }else {
                 object.key.forEach((k)=>{
                   console.log("Key", k)
                    result.push(_.map(rows, k))
                 })
                //  var result = _.map(rows, object.key)
               }
               console.log(result)
               callback(null, result)
             })
         })
     })

function getBankHolidays(callback){
 document.useServiceAccountAuth(creds,function(doc){
        document.getInfo(function(err, info){
            sheet = getSheet(info, 'Master'); //info.worksheets[0];
            sheet.getRows(function(err, rows) {
              if (err){
                  callback("error", null);
              }else {
                var holidays = _.map(rows, 'holidays')
              }
              callback(null, holidays)
            })
        })
    })
}


function getSheet(info, sheetName){
  var index =  _.findIndex(info.worksheets, function(sheet){
    return sheet.title == sheetName
  })
  return info.worksheets[index]
}

module.exports = {
    updateCell: updateCell,
    getAdminSheetRows: getAdminSheetRows,
    getAdminSheetRowsByMid: getAdminSheetRowsByMid,
    getSubsetObject: getSubsetObject
}
