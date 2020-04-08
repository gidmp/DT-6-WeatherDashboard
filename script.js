

$(document).ready(function() {
    var cityHistory = [];
    //when search button is clicked
    $("#search-city-button").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var city = $("#city-input").val().trim();
        // Adding cities from the textbox to array
        cityHistory.push(city);
        //immediately take the value and run it on ajax
        displayCurrentInfo(city);
        displayFutureInfo(city);
        renderButtons();
        //store the value of the last searched city in local storage
        var cityName = $("#city-input").val();
        storeInput(cityName);
        //clear input form after submission
        $("#city-input").val("");
    });
   
    //render city history buttons
    function renderButtons(){
        $("#search-history").empty();
        for (var i = 0; i < cityHistory.length; i++) {
            var createButtons = $("<button>");
            //add class to each buttons
            createButtons.addClass("cityButtons");
            createButtons.attr("data-name", cityHistory[i]);
            createButtons.text(cityHistory[i]);
            //prepend the city name into the div
            $("#search-history").prepend(createButtons);
        }
    }
    function displayCurrentInfo(cityName){
        var api = "96428242b049309d31d51b7cb823fae0";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=" + api;
       
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);
            //write the code to create and append the info on screen
            //add current date with moment JS after the city name
            $(".city").text(response.name);  
            $(".temperature").text("Temperature:  " + response.main.temp + "K");  
            $(".humidity").text("Humidity:  "+ response.main.humidity + "%");
            $(".wind-speed").text("Wind speed:  "+ response.wind.speed + "MPH");
            //Uv-index safety
           
            //get city coordinate
            var lat = response.coord.lat;
            var lon = response.coord.lon;
  
            //function to findout the UV index of city based on its coordinate using closure
            var uvIndex = function(lat, lon){
                var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ api +"&lat="+ lat +"&lon="+ lon;
                $.ajax({
                    url: UVqueryURL,
                    method: "GET"
                    }).then(function(response) {
                        console.log(response)
  
                        var uvValue = response.value;
                        var uvSafety = $("<span>").attr("id", "uvSafety").addClass("badge");
                        uvSafety.text(uvValue);
  
                        if (uvValue <= 2){
                            uvSafety.css("background-color", "lightgreen");
                        }else if (uvValue >=3 && uvValue <=7){
                            uvSafety.css("background-color", "yellow");
                        }else{
                            uvSafety.css("background-color", "red");
                        }
  
                        $(".uv-index").text("UV Index:  " );
                        $(".uv-index").append(uvSafety);
  
                    })
            }
  
            //call uvIndex function using closure
            uvIndex(lat,lon);
           
        })
    }
    function displayFutureInfo(cityName){
        var api = "96428242b049309d31d51b7cb823fae0";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&appid=" + api;
       
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            //empty out the previous elements
            $("#forecast").empty();
            console.log(response);
            var index = [3,11,19,27,35];
 
            for(var i = 0; i < index.length; i++){
                //look at working movie app activity for this
                var createDiv = $("<div class = 'card'>");
                var lineBreak = $("<br>");
 
                var temp = response.list[index[i]].main.temp;
                var pTemp = $("<p>").text("Temp: " + temp);
                createDiv.append(pTemp, lineBreak);
 
                var humidity = response.list[index[i]].main.humidity;
                var pHumid = $("<p>").text("Humidity: " + humidity);
                createDiv.append(pHumid);
 
                
                $("#forecast").append(createDiv);
            }
  
           
           
        })
    }
 
    function storeInput(cityName){
        localStorage.setItem("Last city searched", cityName);
    }
    displayCurrentInfo(localStorage.getItem("Last city searched"));
    displayFutureInfo(localStorage.getItem("Last city searched"));
 
   
 
    //when city history button is click, run through displayInfo function and print the info
    $(document).on("click", ".cityButtons", function(event) {
        console.log("hi");
        event.preventDefault();
        var cityName = $(this).attr("data-name");
        displayCurrentInfo(cityName);
        displayFutureInfo(cityName);
    })
 })
