var GoogleSpreadsheet = require('google-spreadsheet')
var creds = require('./creds.json');
var creds_json = {
      client_email: creds.client_email,
      private_key: creds.private_key
    }
// spreadsheet key is the long id in the sheets URL
var document = new GoogleSpreadsheet(<spreadsheet-id>)
var sheet

function updateCell(name, leaves){
  document.useServiceAccountAuth(creds,function(doc){
    document.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      sheet.getRows({
        limit: 50
        }, function (err, rows){
          console.log("Rows length" + rows.length)
          if (rows.length == 0){
            sheet.addRow({
              name: name,
              leave: leaves
            }, () => {
              console.log("Added Row")
            })
          }
          for (var i = 0; i < rows.length; i++) {
            row = rows[i]
            if (row.name == name){
              row.leave = parseInt(rows[i].leave) + parseInt(leaves)
              row.save(()=>{
                console.log("updated")
              })
              i = rows.length
            } else if (row.name == ''){
              row.name = name
              row.leave = leaves
              row.save(()=>{
                console.log("Added entry")
              })
              i = rows.length
            } else if (i == rows.length - 1){
              sheet.addRow({
                name: name,
                leave: leaves
              }, () => {
                console.log("Added Row")
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
            sheet = getSheet(info, "sheetName"); //info.worksheets[0];
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
            sheet = getSheet(info, "sheetName"); //info.worksheets[0];
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


function getSheet(info, sheetName){
  return info.worksheets[0];
}

module.exports = {
    updateCell: updateCell,
    getAdminSheetRows: getAdminSheetRows,
    getAdminSheetRowsByMid: getAdminSheetRowsByMid
}
