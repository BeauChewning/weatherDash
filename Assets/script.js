var searchHistory = [];
var week = [];
var apiKey = "1fd3b11ac6f6c5e01a3deb52a56bc8d5";
var rootURL = "https://api.openweathermap.org";
var searchForm = document.querySelector("#search-form");
var searchInput = document.querySelector("#search");
var currentDay = document.querySelector("#kyle");
var currentTemp = document.querySelector("#temp");
var currentHumidity = document.querySelector("#humid");
var currentUvi = document.querySelector("#UV");
var currentWind = document.querySelector("#wind");
var forecastWeather = $("#forecast");
var searchHistoryContainer = document.querySelector("#history");


var currentDay2 = document.querySelector("#kyle2")
var currentTemp2 = document.querySelector("#temp2")
var currentWind2 = document.querySelector("#wind2")
var currentHumidity2 = document.querySelector("#humid2")

searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"))
if (searchHistory === null) {
    searchHistory = [];
}
searchHistory.forEach(element => {
    let newPelement = document.createElement("p")
    newPelement.dataset.city = element
    newPelement.textContent = element;
    searchHistoryContainer.append(newPelement);

});
searchHistoryContainer.addEventListener("click", itemSelected)
function itemSelected(event) {
    console.log(event.target.dataset.city)
    let clickCity = event.target.dataset.city
    cityWeather(clickCity)
}

function cityWeather(city) {
        var coodinatesURL = rootURL + "/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;
        console.log(city);
        searchHistory.push(city)
        localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory))
        searchHistoryContainer.innerHTML = "";
        //searchHistoryContainer.textContent = searchHistory
        searchHistory.forEach(element => {
            let newPelement = document.createElement("p")
            newPelement.dataset.city = element
            newPelement.textContent = element;
            searchHistoryContainer.append(newPelement);

        });

        fetch(coodinatesURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log(data[0].lat, data[0].lon)
                getWeather(data[0].lat, data[0].lon)
                coodinatesURL = rootURL + "/data/2.5/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&exclude=hourly,daily&appid=" + apiKey;
                fetch(coodinatesURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data)
                        var fTemp = (data.current.temp - 273.15) * (9 / 5) + 32;
                        currentTemp.innerHTML = "Current Temp: " + fTemp.toFixed(2) + " F";
                        var windS = (data.current.wind_speed);
                        currentWind.innerHTML = "Current Wind Speed: " + windS + " MPH";
                        var humditY = (data.current.humidity);
                        currentHumidity.innerHTML = "Current Humidity: " + humditY;
                        var UV = (data.current.uvi);
                        currentUvi.innerHTML = "Current UV Index: " + UV;
                        var DT = moment().format("MM[/]DD[/]YYYY");
                        currentDay.innerHTML = city + "\n" + DT;

                        if(UV < 3){
                            currentUvi.style.backgroundColor = "green"
                        }else {
                            currentUvi.style.backgroundColor = "red"
                        }
                    })


                fetch(rootURL + "/data/2.5/forecast?q=" + city + "&appid=" + apiKey).then(function (response) {
                    return response.json();
                })
                    .then(function (data) {
                        console.log(data);
                        week = [];

                        for (var i = 0; i < 5; i++) {
                            var day = {
                                dayNum: i,
                                temp: ((data.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(2),
                                wind: data.list[i].wind.speed,
                                icon: data.list[i].weather[0].icon,
                                humidity: data.list[i].main.humidity
                            }
                            week.push(day);
                            forecastWeather.children().eq(i).empty();
                        }
                        for (var i = 0; i < 5; i++) {
                            console.log("printingDaysHere")
                            var icon = week[i].icon;
                            var date = $('<h5></h5>').text(moment().add(i + 1, 'days'));
                            var status = $('<h5></h5>').html("<img src='http://openweathermap.org/img/wn/"+icon+"@2x.png'></img>");
                            var temp = $('<h5></h5>').text(week[i].temp + " F");
                            var wind = $('<h5></h5>').text(week[i].wind + " MPH");
                            var humidText = $('<h5></h5>').text(week[i].humidity + " humidity");
                            forecastWeather.children().eq(i).append(date, status, temp, wind, humidText);
                        }
                    })

            });
    }


function getLatLong(event) {
    event.preventDefault();
    console.log(event);
    var city = search.value.trim();
    cityWeather(city)
   
}
function getWeather(lat, lon) {
    console.log("inside getWeather() function")
    console.log(lat, lon)

}
searchForm.addEventListener("submit", getLatLong);
