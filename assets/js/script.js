let apiKey = "9f5a9921cd73711ba79db2276c17c5e3"; // Needed as a license to pull data from the open weather data base

// Sets form id's into variables
let inputCity = $('#input-city');
let submitCity = $('#tags');
let inputCountry = $('#input-country');

// Sets current weather id's into variables
let currentCity = $('#current-name');
let currentIcon = $('#current-icon');
let currentTemp = $('#current-temp');
let currentWind = $('#current-wind');
let currentHumid = $('#current-humid');
let currentUVindex = $('#current-uvindex');

// Stores the saved city buttons in an array for easier manipulation in local storage
let storedButtons = [];

// function takes the entered city and country and pulls the current weather data for that city
function getCurrentWeather(city, country) {
    let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+', '+country+'&appid='+apiKey+'&units=metric';

    // fetch sends a request for the data and returns it in json format
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
        // Put the json in an object called data
        .then(function(data) {
            console.log(data)

            // Sets all the values in the respective text containers
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

// function takes the inputted city and country and returns data for 5 days forecast from the current day
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

            // gets the list of 40 arrays, which is 5 days of weather forecasts split into three hour intervals
            let dataList = data.list;
            // gets an empty object ready for the data to be split
            let splitWeather = [];

             // Splits the data into 5 separate days by taking eight, three hour forecast so we can manipulate data to get the average weather for each split 
            for (let i = 0; i < dataList.length; i += 8){
                splitWeather.push(dataList.slice(i, i + 8));
            }
            console.log(splitWeather);

            // Uses for loop logic to create a bucket for Temperature, Wind Speeds, and Humidity, sums all 8 values in them and gets the mean for them.
            for (let i = 0; i < splitWeather.length; i++) {
                let avgTempDay = 0;
                let avgWindSpeed = 0;
                let avgHumid = 0;
                for (let j = 0; j < 8; j++) {
                    avgTempDay = avgTempDay + parseInt(splitWeather[i][j].main.temp)
                    avgWindSpeed = avgWindSpeed + parseInt(splitWeather[i][j].wind.speed);
                    avgHumid = avgHumid + parseInt(splitWeather[i][j].main.humidity);
                }

                // Sets all the context for each of the 5 day forecast cards
                let dIcon = splitWeather[i][1].weather[0].icon;
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

// function geoCoding () {----------------------
//     let requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}';
// }

// function giveURL() {

// }--------------------------

// function creates a new button for searched cities as long as the city hasn't already been made
function createNewButton(city, country) {
    let newButton = $('<button>');// creates a button element
    let repeatCount = 0; // Useful for figuring out if the button has already been created
    let newButtonValue = (city+', '+country) // Sets the value of the button to be manipulated when clicked on again

    // Adds text and classes to button
    newButton.text(newButtonValue);
    newButton.addClass('btn custom-btn');

    // Goes through current stored buttons, if the value entered equals any of the current buttons, we don't create the button
    for (let i = 0; i < storedButtons.length; i++) {
        if (newButtonValue.toUpperCase() == storedButtons[i].toUpperCase()) {
            repeatCount++;
        }
    }

    if (repeatCount > 0) {
        return;
    }
    // else create the button and store it in local storage
    else{
        $('#add-btns').append(newButton);
        storedButtons.push(newButtonValue);
        localStorage.setItem('storedButtons', JSON.stringify(storedButtons));
    }
}

// initializes the stored buttons list so the saved buttons are already popped up on the page
function init() {
    // gets the object JSON of stored buttons and puts it into a variable
    let storedCities = JSON.parse(localStorage.getItem("storedButtons"));

    if (storedCities !== null){ // if the variable is not empty we overwrite the storedButtons object with the one we pulled from local storage
        storedButtons = storedCities;
    }

    // Uses a for loop to create the saved button values
    for (let i = 0; i < storedButtons.length; i++) {
        let newButton = $('<button>');

        newButton.text(storedButtons[i]);
        newButton.addClass('btn custom-btn');
        
        $('#add-btns').append(newButton);
    }

}

// When the search button is clicked it calls the functions needed to populate the current and 5 day forecast
submitCity.on('click', function(event) {
    event.preventDefault();

    let city = inputCity.val().trim();
    // makes sure city and country values are not null
    if (!inputCountry.val() || !inputCity.val()) {
        return 0;
    }
    let initialCountry = inputCountry.val().trim();
    let country = initialCountry.split('-')[0];

    getCurrentWeather(city, country);
    getFiveDayForecast(city, country);

    inputCity.val(' ');
    inputCountry.val(' ');
});

// Used to initialize the page before the user can use the page
init();




