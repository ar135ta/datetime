/**
 * my model
 */
var model = {
    lat: 0,        // (int) latitude
    lon: 0,        // (int) longitude
    weather: '',   // (str) one word weather condition
    temp: 0,       // (int) temperature
    tempUnit: 'C', // (str) unit of measurement
    name: '',      // (str) name of location
    dt: 0,         // (int) current timestamp

    conditions: {
        Clear: {
            img: 'https://i.postimg.cc/sXs1pM9d/me.png',
            icon: 'CLEAR_DAY',
        },
        Clouds: {
            img: 'https://i.postimg.cc/sXs1pM9d/me.png',
            icon: 'CLOUDY',
        },
        Drizzle: {
            img: 'https://i.postimg.cc/sXs1pM9d/me.png',
            icon: 'RAIN',
        },
        Rain: {
            img: 'https://i.postimg.cc/sXs1pM9d/me.png',
            icon: 'RAIN',
        },
        Snow: {
            img: 'https://i.postimg.cc/sXs1pM9d/me.png',
            icon: 'SNOW',
        },
        Thunderstorm: {
            img: 'https://i.postimg.cc/sXs1pM9d/me.png',
            icon: 'CLOUDY',
        },
    },
}

/**
 * my controller
 */
var weather = {

    init: function(){
        view.cacheDOM();
        view.bindEvents();
        this.setCoordinates();
    },

    /**
     * sets the coordinates from the geolocation data
     */
    setCoordinates: function(lat, lon){
        if (navigator.geolocation) {
            var self = this;
            navigator.geolocation.getCurrentPosition(function(pos) {
                model.lat = pos.coords.latitude;
                model.lon = pos.coords.longitude;
                self.getWeatherData();
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },

    /**
     * gets the data from the weather API using our coordinates
     */
    getWeatherData: function(){
        var url = 'https://fcc-weather-api.glitch.me/api/current?lat=' + model.lat + '&lon=' + model.lon;
        $.ajax({
            url: url,
            async: false,
            success: function(data){
                // setting the model data
                model.weather = data.weather[0].main;
                model.temp    = data.main.temp;
                model.name    = data.name;
                model.dt      = data.dt;
            },
        });
        view.render(); // once set we can render the view
    },

    /**
     * gets the right weather condition
     */
    determineWeather: function(){
        return model.conditions[model.weather];
    },
}

/**
 *
 */
var view = {

    /**
     *
     */
    cacheDOM: function(){
        this.$weatherImg = $('#weatherImg');
        this.$townName   = $('#townName');
        this.$lat        = $('#lat');
        this.$lon        = $('#lon');
        this.$time       = $('#time');
        this.$temp       = $('#temp');
        this.$tempUnit   = $('#tempUnit');

        this.$fahrenheit = $('#fahrenheit');
        this.$celsius    = $('#celsius');
    },

    /**
     *
     */
    bindEvents: function(){
        this.$fahrenheit.on('click', this.convertToF.bind(this));
        this.$celsius   .on('click', this.convertToC.bind(this));
    },

    /**
     *
     */
    convertToF: function(){
        if (model.tempUnit !== 'F') {
            model.temp     = Number(model.temp * 1.8 + 32).toFixed(1);
            model.tempUnit = 'F';
            this.$celsius.removeClass('toggled');
            this.$fahrenheit.addClass('toggled');
            view.render()
        }
    },

    /**
     *
     */
    convertToC: function(){
        if (model.tempUnit !== 'C') {
            model.temp     = Number((model.temp - 32) * (5 / 9)).toFixed(1);
            model.tempUnit = 'C';
            this.$fahrenheit.removeClass('toggled');
            this.$celsius.addClass('toggled');
            view.render();
        }
    },

    /**
     *
     */
    render: function(){
        var data = weather.determineWeather();
        // show image
        this.$weatherImg.attr('src', data.img);
        // show town
        this.$townName.text(model.name);
        // show coordinates
        this.$lat.text(model.lat);
        this.$lon.text(model.lon);
        // show icon
        var icons = new Skycons({"color": "#0096FF"});
        icons.set("icon", Skycons[data.icon]);
        icons.play();
        // show temperature
        this.$temp.text(model.temp);
        this.$tempUnit.text(model.tempUnit);
        // show time
        this.$time.text(moment().format("h:mm a"));
    },
}

weather.init()