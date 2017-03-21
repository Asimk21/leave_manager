var a = [{
           name: "Rupam",
           mid : "M1012919",
           type: "Annual Leave",
           days : `January:1 `,
           from: "01/28/2017",
           to: "01/28/2017",
           dates: ["01/28/2017"]
         },
         {
           name: "Rohit",
           mid : "M1012945",
           type: "Annual Leave",
           days : `March:1 `,
           from: "01/28/2017",
           to: "01/28/2017",
           dates: ["01/28/2017"]
         },
         {
           name: "Asim",
           mid : "M1012923",
           type: "Annual Leave",
           days : `February:1 `,
           from: "01/28/2017",
           to: "01/28/2017",
           dates: ["01/28/2017"]
         }]

function makeCheckboxes(data){
  data.forEach(function(dat, i){
    console.log(dat)
    str = dat.name + '-' + dat.type + '-' +  dat.from + '-' + dat.to + '-' + dat.days
    document.getElementById("Leaves").innerHTML = document.getElementById("Leaves").innerHTML + ` <input type="checkbox" name="leave" value="${i}"> ${str}<br>`
  })
}

$(function() {
  console.log( "document loaded" );
   makeCheckboxes(a)
  });
