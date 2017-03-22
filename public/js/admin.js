function makeCheckboxes(data){
  data.forEach(function(dat, i){
    console.log(dat)
    str = dat.name + '-' + dat.type + '-' +  dat.from+ '-' + dat.to + '-' + dat.days
    document.getElementById("Leaves").innerHTML = document.getElementById("Leaves").innerHTML + ` <input type="checkbox" name="leave" value="${i}"> ${str}<br>`
  })
}


$('document').ready(function () {
  console.log( "document loaded" );

  $.getJSON('leave.json', function (data){
    console.log(data)
    makeCheckboxes(data)
  })
})
