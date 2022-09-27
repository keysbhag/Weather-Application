let data = []

$.getJSON('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json',function(result){

    $.each(result, function(index, val){
        data.push(val["Code"]);
    });
});

console.log(data);

$("#input-country").autocomplete({
    source: data
  });

