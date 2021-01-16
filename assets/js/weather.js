var arrSearchHistory = [];

// Gets the search history when this file is loaded
getSearchHistory();
//localStorage.clear();
// function to access the city's information based on user's input
function getWeatherByCity(city){
    var apiKey = "id=524901&appid=8d033d7f143f0e2af2920c11bc814694";
    var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&"+apiKey;
    // return fetch(apiWeatherUrl)
    fetch(apiWeatherUrl)
    .then(function(response){
        //request was successful
        if (response.ok){
            response.json()
            .then (function(data) {
                //Create new fetch to obtain data of UV index.
                var apiOnecallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&units=imperial&"+apiKey;
                fetch(apiOnecallUrl)
                .then(function(response){
                    if (response.ok){
                        response.json().then (function(onecallData) {
                            displayCityWeather(data, onecallData);  
                        });
                    }
                    else{
                        // if not successful, redirect to homepage
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

//function to display current City information.
var displayCityWeather=function(data, allData){
    var cityDataEl = document.getElementById("city-data");  
    cityDataEl.innerHTML="";
    var cityName=document.createElement("p");
    var iconImg = document.createElement("img");
    var cityTemp=document.createElement("p");
    var cityHum=document.createElement("p");
    var cityWind=document.createElement("p");
    var cityUVIndex=document.createElement("p");
    var cityUVIndexNumber=document.createElement("span");
    cityName.textContent=data.name;
    iconImg.src = "http://openweathermap.org/img/wn/"+ data.weather[0].icon +".png";
    cityName.appendChild(iconImg);
    cityTemp.textContent="Temperature: "+data.main.temp+" ⁰F";
    cityHum.textContent="Humidity: "+data.main.humidity+"%";
    cityWind.textContent="Wind Speed: "+data.wind.speed+" MPH";
    cityUVIndex.textContent="UV Index: ";
    cityUVIndexNumber.textContent=allData.daily[0].uvi;
    //Compare UV index to color weather conditions.
    var uviNumber = parseFloat(cityUVIndexNumber.textContent);
    switch(true){
        case (uviNumber < 3):
            cityUVIndexNumber.style.background = "lime";
            break;
        case(uviNumber < 5):
        cityUVIndexNumber.style.background = "yellow";
            break;
        case(uviNumber < 7):
        cityUVIndexNumber.style.background = "orange";
            break;
        case(uviNumber < 10):
        cityUVIndexNumber.style.background = "red";
            break;
        default:
            cityUVIndexNumber.style.background = "purple";
        
    }
    
    cityUVIndex.append(cityUVIndexNumber);
    cityDataEl.appendChild(cityName);
    cityDataEl.appendChild(cityTemp);
    cityDataEl.appendChild(cityHum);
    cityDataEl.appendChild(cityWind);
    cityDataEl.appendChild(cityUVIndex);
    displayForecast(allData);
    // Now refresh the search history
    getSearchHistory();
}
// Function to display future forecast
var displayForecast= function(dayForecast){
    document.getElementById("day-forecast").innerHTML="";
    //We create the cards for each day
    for (var i=1; i<=5; i++){
        var dateForecast=new Date(dayForecast.daily[i].dt*1000);
        var iconForecast="http://openweathermap.org/img/wn/"+ dayForecast.daily[i].weather[0].icon +".png";
        var humidityForecast=dayForecast.daily[i].humidity;
        var tempForecast=dayForecast.daily[i].temp.day;

        var card =document.createElement("div");
        card.className="card ml-2 bg-primary text-white";

        var cardBody =document.createElement("div");
        cardBody.className="card-body p-3 forecastBody";

        var cityDate =document.createElement("h4");
        cityDate.className="card-title";
        cityDate.textContent=dateForecast.toLocaleDateString();

        var image =document.createElement ("img");
        image.src= iconForecast;

        var temperature = document.createElement("p");
        temperature.className="card-text forecastTemp";
        temperature.textContent="Temperature: " + tempForecast + " °F";

        var humidity = document.createElement("p");
        humidity.className="card-text forecastHumidity";
        humidity.textContent="Humidity: " + humidityForecast + "%";
        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        document.getElementById("day-forecast").append(card); 

    }

}
//
function searchBttnClicked(){
    var cityName = document.getElementById("city-input").value;
    getWeatherByCity(cityName);  
    //Now update the search history
    setSearchHistory(cityName);   
}

//Display the past search again when a City name is click
function bttnSearchHistoryClick(clickedElement){
    var cityName = clickedElement.path[0].textContent;
    getWeatherByCity(cityName);
}

//Saves City's name in local storage
function setSearchHistory(cityName){
    arrSearchHistory.push(cityName);
    window.localStorage.setItem("search_history", JSON.stringify(arrSearchHistory));
}

//Retrieves and display City's name from local storage
function getSearchHistory(){
    var arrToLoad;
    if( arrToLoad = JSON.parse(window.localStorage.getItem("search_history"))){
        arrSearchHistory = arrToLoad;
    }
    var cityList=document.getElementById("history");
    cityList.innerHTML = "";
    var itemId = 0;
    // The follwoing will be a for loop counting down
    if(arrSearchHistory.length>0){
        var maxIndex = Math.max(arrSearchHistory.length-1,0);
        var minIndex = Math.max(arrSearchHistory.length-11,0);
        for (var i = maxIndex; i >= minIndex; i--) {
            var historyContainer = document.createElement("li");
            historyContainer.className="list-group-item";
            historyContainer.id = "itemId_" + itemId;
            itemId++;
            historyContainer.textContent=arrSearchHistory[i];
            historyContainer.addEventListener("click",bttnSearchHistoryClick);
            cityList.append(historyContainer);
        }  
                
    }
}