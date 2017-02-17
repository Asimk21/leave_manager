api = require ('./googleSheetApi')

// api.updateCell("Rupam", 2, (bool) => {
//     console.log(bool)
// } )
// var a = { mid: 'M1012913',
//   empName: 'Wos',
//   leaveType: 'Annual Leave',
//   cover: 'cover',
//   days: '5' }
//
// api.updateCell(a)

api.getAdminSheetRows((data) => {
  console.log(data)
})
