let requestUrl = 'https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json'

fetch(requestUrl)
    .then(function(response){
        return response.json();
    })

    .then(function(data){
        console.log(data);
    })