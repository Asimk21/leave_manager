api = require ('./googleSheetApi')

api.updateCell("Rupam", 2, (bool) => {
    console.log(bool)
} )
