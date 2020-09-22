
// main fuction done by jQuery (1st function)
$(document).ready(function() {
    var currentDate = moment().format('dddd, L');

    //clicking-on-the-search-button function (2nd function)
    $("#searchBtn").on("click", function(event) {
        // stopPropagation(). Tried to use this instead of preventDefault(), but it did not work
       
        event.preventDefault();
        var currentCity = $("#currentCityInput").val();    
        
        //Array   
        cCityDisplay(currentCity);
        fCityDisplay(currentCity);
        mainButton(currentCity);
    
        //pushing the value (city) to store
        currentCityHistory.push(currentCity);
        storeButtons()

        //storing the value
        var currentCityName = $("#currentCityInput").val();
        storeInput(currentCityName);
    
        //Clearing the search bar after browsing the results of the research
        $("#cityInput").val("");
    });
  
    //Rendering history buttons when the search button is clicked (3rd function)
    function mainButton(currentCity){
        var clickableButton = $("<button>");
        clickableButton.addClass("cityButtons btn btn-block");
        clickableButton.attr("data-name", currentCity);
        clickableButton.text(currentCity);
        //prepend the city name into the div
        $("#history").prepend(clickableButton);
       
    }
    
    
    //display the selected city's current weather info
    function cCityDisplay(currentCityName){
        var api = "1c705d6d9650683e7124ea49c8cc5e78";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ currentCityName +"&appid=" + api;
      
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            var icon = response.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
            var iconAdd = $("<img>").attr("src", iconurl);
            var temprature = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1);
 
            $(".currentCity").text(response.name +"  ("+currentDate +")")
            $(".currentCity").append(iconAdd); 
            $(".temperature").text("Temperature:  " + temprature + " °F"); 
            $(".humidity").text("Humidity:  "+ response.main.humidity + "%");
            $(".wind-speed").text("Wind speed:  "+ response.wind.speed + "MPH");      
        })
    }

    //function to display the next 5 days weather forecast of the selected city
    function fCityDisplay(currentCityName){
        var api = "1c705d6d9650683e7124ea49c8cc5e78";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ currentCityName +"&appid=" + api;
      
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            //empty out the previous elements
            $("#forecast").empty();
            var index = [3,11,19,27,35];
            for(var i = 0; i < index.length; i++){
                //look at working movie app activity for this
                var createDiv = $("<div class = 'card'>");
                var lineBreak = $("<br>");
  
                var futureTime = moment().add(i+1, 'd').format('L');
                var pTime = $("<h5>").text(futureTime);
                createDiv.append(pTime, lineBreak);
 
                var icon = response.list[index[i]].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                var iconAdd = $("<img>").attr("src", iconurl);
                iconAdd.css("width", "50px");
                createDiv.append(iconAdd, lineBreak);
  
                var temp = ((response.list[index[i]].main.temp - 273.15) * 1.80 + 32).toFixed(2);
                var pTemp = $("<p>").text("Temp: " + temp + " °F");
                createDiv.append(pTemp, lineBreak);
 
                var humidity = response.list[index[i]].main.humidity;
                var pHumid = $("<p>").text("Humidity: " + humidity);
                createDiv.append(pHumid);
               
                $("#forecast").append(createDiv);
            }
           
          
        })
    }

    //function that handles the history buttons event
    $(document).on("click", ".cityButtons", function(event) {
        event.preventDefault();
        var currentCityName = $(this).attr("data-name");
        currentCityHistory.push(currentCityName);
        cCityDisplay(currentCityName);
        fCityDisplay(currentCityName);
    })

//storage
    function storeInput(currentCityName){
        localStorage.setItem("Last city searched", currentCityName);
    }
    cCityDisplay(localStorage.getItem("Last city searched"));
    fCityDisplay(localStorage.getItem("Last city searched"));
  
    var currentCityHistory = JSON.parse(window.localStorage.getItem("history")) || [];

    if(currentCityHistory.length > 0){
        cCityDisplay(currentCityHistory[currentCityHistory.length - 1])
    }

    for(var i = 0; i < currentCityHistory.length; i++){
        mainButton(currentCityHistory[i]);
    }

    function storeButtons(){
        localStorage.setItem("history", JSON.stringify(currentCityHistory));
    }

  
    //when city history button is click, run through displayInfo function and print the info
 })
