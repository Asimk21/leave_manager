var GoogleSpreadsheet = require('google-spreadsheet')
var creds = require('./cred.json');
var _ = require('lodash')
var creds_json = {
    client_email: creds.client_email,
    private_key: creds.private_key
}
// spreadsheet key is the long id in the sheets URL
var document = new GoogleSpreadsheet('')
var sheet

function updateCell(data) {
    var name = data.name
    var mid = data.mid
    var leaveType = data.type
    var days = data.days.split(" ")
    days.pop()
    document.useServiceAccountAuth(creds, function(doc) {
        document.getInfo(function(err, info) {
            console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
            days.forEach((monthData) => {
                var dataArr = monthData.split(":")
                console.log(dataArr)
                sheet = getSheet(info, dataArr[0])
                sheet.getRows({
                    limit: 50
                }, function(err, rows) {
                    console.log("Rows length" + rows.length)
                    for (var i = 0; i < rows.length; i++) {
                        row = rows[i]
                        if (row.name == name) {
                            row.l = row.l ? parseInt(row.l) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                            if (leaveType == 'Sick Leave') {
                                row.sl = row.sl ? parseInt(row.sl) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                            } else {
                                row.sick = row.sick ? parseInt(row.sick) + parseInt(dataArr[1]) : parseInt(dataArr[1])
                            }
                            row.save(() => {
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

function addRange(data) {
    //  type = durationType(data.dates)
    document.useServiceAccountAuth(creds, function(doc) {
        document.getInfo(function(err, info) {
            sheet = getSheet(info, "Test")
            sheet.getRows({
                limit: 50
            }, function(err, rows) {
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i]
                    if (row.name == data.name) {
                        if (data.rangeType == 'ShortRange') {
                            row.shortrange = row.shortrange == '' ? data.dates : row.shortrange + ',' + data.dates
                        } else {
                            row.longrange = row.longrange == '' ? data.dates : row.longrange + ',' + data.dates
                        }
                        row.save(() => {
                            console.log("updated")
                        })
                        i = rows.length
                    }
                }
            })
        })
    })
}

function getAdminSheetRows(callback) {
    document.useServiceAccountAuth(creds, function(doc) {
        document.getInfo(function(err, info) {
            sheet = getSheet(info, 'Master'); //info.worksheets[0];
            sheet.getRows(function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    callback(rows);
                }
            })
        })
    })
}

function getAdminSheetRowsByMid(mid, callback) {
    document.useServiceAccountAuth(creds, function(doc) {
        document.getInfo(function(err, info) {
            sheet = getSheet(info, 'Master'); //info.worksheets[0];
            sheet.getRows(function(err, rows) {
                if (err) {
                    callback("error", null);
                } else {
                    rows.forEach(function(row) {
                        if (row.mid == mid) {
                            callback(null, row);
                        }
                    });
                }
            })
        })
    })
}

function getBankHolidays(callback) {
    document.useServiceAccountAuth(creds, function(doc) {
        document.getInfo(function(err, info) {
            sheet = getSheet(info, 'Master'); //info.worksheets[0];
            sheet.getRows(function(err, rows) {
                if (err) {
                    callback("error", null);
                } else {
                    var holidays = _.map(rows, 'holidays')
                }
                callback(null, holidays)
            })
        })
    })
}


function getSheet(info, sheetName) {
    var index = _.findIndex(info.worksheets, function(sheet) {
        return sheet.title == sheetName
    })
    return info.worksheets[index]
}

module.exports = {
    updateCell: updateCell,
    getAdminSheetRows: getAdminSheetRows,
    getAdminSheetRowsByMid: getAdminSheetRowsByMid,
    getBankHolidays: getBankHolidays,
    addRange: addRange
}
