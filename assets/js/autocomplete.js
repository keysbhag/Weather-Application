// Gets Data from a seperate JSON to fill autocomplete of all ISO 3166 Codes
let data = []

// Populates and empty array with the 2 character codes and the full name beside it
$.getJSON('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json',function(result){

    $.each(result, function(index, val){
        data.push(val["Code"]+' - '+val["Name"]);
    });
});

console.log(data);

// Uses Jquery autocomplete function to source data from the data array
$("#input-country").autocomplete({
    source: data
  });

