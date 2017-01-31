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
  var days = data.days
  document.useServiceAccountAuth(creds,function(doc){
    document.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = getSheet(info, 'Master');
      sheet.getRows({
        limit: 50
        }, function (err, rows){
          console.log("Rows length" + rows.length)
          for (var i = 0; i < rows.length; i++) {
            row = rows[i]
            console.log(row.name, name)
            if (row.name == name){
              row.leaves = row.leaves? parseInt(row.leaves) + parseInt(days) : parseInt(days)
              if (leaveType == 'Annual Leave'){
                row.annual = row.annual ? parseInt(row.annual) + parseInt(days) : parseInt(days)
              }else{
                row.sick = row.sick ? parseInt(row.sick) + parseInt(days) : parseInt(days)
              }
              if (cover == 'Yes'){
                row.cover = row.cover ? parseInt(row.cover) + parseInt(days) : parseInt(days)
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

function getBankHolidays(callback){
 document.useServiceAccountAuth(creds,function(doc){
        document.getInfo(function(err, info){
            sheet = getSheet(info, 'Bank holidays'); //info.worksheets[0];
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
    getBankHolidays: getBankHolidays
}
