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

data = { name: "Rupam",
         mid : "M1012919",
         type: "Annual Leave",
         days : `January:1 February:1 `,
         from: "01/28/2017",
         to: "29/01/2017",
         dates: ["01/28/2017", "01/28/2017", "01/28/2017", "01/28/2017", "01/28/2017"]
       }

api.addRange(data)
