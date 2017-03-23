function makeCheckboxes(data){
  data.forEach(function(dat, i){
    console.log(dat)
    str = dat.name + '-' + dat.type + '-' +  dat.from+ '-' + dat.to + '-' + dat.days
    document.getElementById("Leaves").innerHTML = document.getElementById("Leaves").innerHTML + ` <label><input class="position" type="checkbox" name="leave" value="${i}"> ${str}<br></label>`
  })
}


$('document').ready(function () {
  console.log( "document loaded" );

  $.getJSON('leave.json', function (data){
    console.log(data)
    makeCheckboxes(data)
  })
})
