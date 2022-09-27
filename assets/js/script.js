let apiKey = "9f5a9921cd73711ba79db2276c17c5e3";

let inputCity = $('#input-city');
let submitCity = $('#tags');
let inputCountry = $('#input-country');

let currentCity = $('#current-name');
let currentIcon = $('#current-icon');
let currentTemp = $('#current-temp');
let currentWind = $('#current-wind');
let currentHumid = $('#current-humid');
let currentUVindex = $('#current-uvindex');

let storedButtons = [];

function getCurrentWeather(city, country) {
    let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+', '+country+'&appid='+apiKey+'&units=metric';

    fetch(requestUrl)
        .then(function(response){
            if (response.status != 200) {
                alert("Request entered is not valid")

                return;
            } else {
                createNewButton(city, country);
            }
            
            return response.json();
        }) 
        .then(function(data) {
            console.log(data)



            let cIcon = data['weather'][0].icon;
            let iconUrl = "http://openweathermap.org/img/w/" +cIcon+ ".png";
            let currentDate = moment().format("M/D/YYYY");

            currentCity.text(data.name+', '+data.sys.country+ ' ' + currentDate);
            $('#cicon').attr('src',iconUrl);
            document.getElementById('current-icon').style.display = 'block';
            currentTemp.text("Temperature: "+data['main'].temp+' °C');
            currentWind.text('Wind: '+data['wind'].speed+' km/h');
            currentHumid.text('Humidity: '+data['main'].humidity+'%');

        })

    }

function getFiveDayForecast(city, country) {

    let requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+city+', '+country+'&appid='+apiKey+'&units=metric';

    fetch(requestUrl)
        .then(function(response){
            if (response.status != 200) {
                alert("Request entered is not valid")

                return;
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data)

            let threeHourData = data.list;
            let dailyWeather = [];

             // Split the data into 5 separate days (every 8 entries of the list)
            for (let i = 0; i < threeHourData.length; i += 8){
                dailyWeather.push(threeHourData.slice(i, i + 8));
            }
            console.log(dailyWeather);

            for (let i = 0; i < dailyWeather.length; i++) {
                let avgTempDay = 0;
                let avgWindSpeed = 0;
                let avgHumid = 0;
                for (let j = 0; j < 8; j++) {
                    avgTempDay = avgTempDay + parseInt(dailyWeather[i][j].main.temp)
                    avgWindSpeed = avgWindSpeed + parseInt(dailyWeather[i][j].wind.speed);
                    avgHumid = avgHumid + parseInt(dailyWeather[i][j].main.humidity);
                }

                let dIcon = dailyWeather[i][6].weather[0].icon;
                let diconUrl = "http://openweathermap.org/img/w/" +dIcon+ ".png";

                let date = $('#'+i.toString()+'a');

                let iconIMG = $('#icon'+i.toString());
                let dayTemp = $('#'+i.toString()+'c');
                let dayWind = $('#'+i.toString()+'d');
                let dayHumid = $('#'+i.toString()+'e');

                date.text(moment().add(i+1,'d').format("M/D/YYYY"));
                iconIMG.attr('src',diconUrl);
                document.getElementById('b'+i.toString()).style.display = 'block';
                dayTemp.text("Temp: "+(avgTempDay/8)+' °C');
                dayWind.text("Wind: "+(avgWindSpeed/8)+' km/h');
                dayHumid.text("Humidity: "+(avgHumid/8)+'%');

            }
        })
}

// function geoCoding () {
//     let requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}';
// }

// function giveURL() {

// }

function createNewButton(city, country) {
    let newButton = $('<button>');
    let repeatCount = 0;
    let newButtonValue = (city+', '+country)

    newButton.text(newButtonValue);
    newButton.addClass('btn custom-btn');

    for (let i = 0; i < storedButtons.length; i++) {
        if (newButtonValue.toUpperCase() == storedButtons[i].toUpperCase()) {
            repeatCount++;
        }
    }
    console.log(repeatCount);

    if (repeatCount > 0) {
        return;
    } else{
        
        $('#add-btns').append(newButton);
        storedButtons.push(newButtonValue);
        localStorage.setItem('storedButtons', JSON.stringify(storedButtons));
    }
}

function init() {
    let storedCities = JSON.parse(localStorage.getItem("storedButtons"));

    console.log(storedCities);

    if (storedCities !== null){
        storedButtons = storedCities;
    }

    for (let i = 0; i < storedButtons.length; i++) {
        let newButton = $('<button>');

        newButton.text(storedButtons[i]);
        newButton.addClass('btn custom-btn');
        
        $('#add-btns').append(newButton);
    }

}


submitCity.on('click', function(event) {
    event.preventDefault();

    let city = inputCity.val().trim();

    if (!inputCountry.val()) {
        console.log(true);
        return 0;
    }
    let country = inputCountry.val().trim();

    getCurrentWeather(city, country);
    getFiveDayForecast(city, country);
});

init();




