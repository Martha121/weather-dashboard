var arrSearchHistory = [];

// Gets the search history when this file is loaded
getSearchHistory();

function getWeatherByCity(city){
    var apiKey = "id=524901&appid=8d033d7f143f0e2af2920c11bc814694";
    var apiWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&"+apiKey;
    // return fetch(apiWeatherUrl)
    fetch(apiWeatherUrl)
    .then(function(response){
        //request was successful
        if (response.ok){
            response.json()
            .then (function(data) {
                setSearchHistory(city);
                var apiOnecallUrl = "http://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&"+apiKey;
                fetch(apiOnecallUrl)
                .then(function(response){
                    //request was successful
                    if (response.ok){
                        response.json().then (function(onecallData) {
                            displayCityWeather(data, onecallData);
                        });
                    }
                    else{
                        // if not successful, redirect to homepage
                        console.log("Could not get onecall");
                        document.location.replace("./index.html");
                    }
                });
            });
        }
        else{
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};


var displayCityWeather=function(data, allData){
    var cityDataEl = document.getElementById("city-data");  
    console.log(data);
    console.log(allData);
    cityDataEl.innerHTML="";
    var cityName=document.createElement("p");
    var iconImg = document.createElement("img");
    var cityTemp=document.createElement("p");
    var cityHum=document.createElement("p");
    var cityWind=document.createElement("p");
    var cityUVIndex=document.createElement("p");
    cityName.textContent=data.name;
    iconImg.src = "http://openweathermap.org/img/wn/"+ data.weather[0].icon +".png";
    cityName.appendChild(iconImg);
    cityTemp.textContent="Temperature: "+data.main.temp+" ⁰F";
    cityHum.textContent="Humidity: "+data.main.humidity+"%";
    cityWind.textContent="Wind Speed: "+data.wind.speed+" MPH";
    cityUVIndex.textContent="UV Index: "+allData.daily[0].uvi;
    cityDataEl.appendChild(cityName);
    cityDataEl.appendChild(cityTemp);
    cityDataEl.appendChild(cityHum);
    cityDataEl.appendChild(cityWind);
    cityDataEl.appendChild(cityUVIndex);
}

function searchBttnClicked(){
    var cityName = document.getElementById("city-input").value;
    //console.log(cityName);
    getWeatherByCity(cityName);
}

function setSearchHistory(cityName){
    arrSearchHistory.push(cityName);
    window.localStorage.setItem("search_history", JSON.stringify(arrSearchHistory));
}

function getSearchHistory(){
    var arrToLoad;
    if( arrToLoad = JSON.parse(window.localStorage.getItem("search_history"))){
        arrSearchHistory = arrToLoad;
    }
    console.log(arrSearchHistory);
}