let apiKey = "9f5a9921cd73711ba79db2276c17c5e3";

let inputCity = $('#input-city');
let submitCity = $('#submit-city');

let currentCity = $('#current-name');
let currentIcon = $('#current-icon');
let currentTemp = $('#current-temp');
let currentWind = $('#current-wind');
let currentHumid = $('#current-humid');
let currentUVindex = $('#current-uvindex');

function getCurrentWeather(city) {
    let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+apiKey+'&units=metric';

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

function getFiveDayForecast(city) {

    let requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid='+apiKey+'&units=metric';

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

                let addDay = $('#day'+i.toString());
                let dIcon = dailyWeather[i][4].weather[0].icon;
                let diconUrl = "http://openweathermap.org/img/w/" +dIcon+ ".png";

                let date = $('<h2>');
                let dayIcon = $('<p>');
                let iconIMG = $('<img>');
                let dayTemp = $('<p>');
                let dayWind = $('<p>');
                let dayHumid = $('<p>');

                date.text(moment().add(i+1,'d').format("M/D/YYYY"));

                iconIMG.attr('src',diconUrl);
                dayTemp.text("Temp: "+(avgTempDay/8)+' °C');
                dayWind.text("Wind: "+(avgWindSpeed/8)+' km/h');
                dayHumid.text("Humidity: "+(avgHumid/8)+'%');

                addDay.append(date);
                addDay.append(dayIcon);
                dayIcon.append(iconIMG);
                addDay.append(dayTemp);
                addDay.append(dayWind);
                addDay.append(dayHumid);
            }
        })
}

function geoCoding () {
    let requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}';
}


submitCity.on('click', function() {
    let city = inputCity.val().trim();
    getCurrentWeather(city);
    getFiveDayForecast(city);
});




