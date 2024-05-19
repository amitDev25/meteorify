const apikey = "d78fda6fd8107f61d9c9cc1e03511825";


        document.querySelector(".searchIcon").addEventListener("click", (e) => {
            let cityName = document.getElementById("searchCity").value
            console.log(cityName)

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;

            fetch(url).then((res) => {
                if (!res.ok) {
                    alert("Enter Valid City Name");
                }
                return res.json();
            }).then((data) => {
                // console.log(data);             

                weatherReport(data);

            })


            document.getElementById("searchCity").value = '';


        })


        window.addEventListener("load", getCurrentLocation())
        // document.querySelector(".currentLocationBtn").addEventListener("click", getCurrentLocation())


        function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let lon = position.coords.longitude;
                    let lat = position.coords.latitude;
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;




                    fetch(url).then((res) => {
                        return res.json();
                    }).then((data) => {
                        // console.log(data);                        
                        weatherReport(data);

                    })
                })
            }

        }


        function weatherReport(data) {

            var urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

            fetch(urlcast).then((res) => {
                return res.json();
            }).then((forecast) => {
                console.log(forecast);

                console.log(forecast.city);

                let timeZone = data.timezone


                airQuality(data)
                hourlyForecast(forecast, timeZone)
                dailyForecast(forecast, timeZone)


                let currentLoc = `${data.name}, ${data.sys.country}`
                document.getElementById("currentLoc").innerText = currentLoc
                console.log(data.name, data.sys.country);


                let currentTemperature = Math.floor(data.main.temp - 273)
                console.log(Math.round(data.main.temp - 273));
                document.getElementById("currentTemperature").innerText = `${currentTemperature}° C`



                let clouds = data.weather[0].description
                console.log(data.weather[0].description)
                document.getElementById("clouds").innerText = `${clouds}`



                let icon1 = data.weather[0].icon;
                let iconurl = `https://openweathermap.org/img/wn/${icon1}@2x.png`;
                document.getElementById("currentWeatherIcon").src = iconurl

                let allMonths = ["Januay", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

                let allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]





                let nowDate = new Date();
                let cityDate = new Date(nowDate.getTime() + timeZone * 1000);

                console.log(cityDate)
                let day = allDays[cityDate.getUTCDay()];
                let dateNum = cityDate.getUTCDate();
                let month = allMonths[cityDate.getUTCMonth()]


                document.getElementById("currentDate").innerText = `${day} ${dateNum}, ${month}`



                let nowHour = cityDate.getUTCHours();
                console.log(nowHour)
                let nowMinutes = cityDate.getUTCMinutes();
                console.log(nowMinutes)
                let nowampm = nowHour >= 12 ? 'PM' : 'AM';
                nowHour = nowHour % 12 || 12;
                nowMinutes = nowMinutes < 10 ? '0' + nowMinutes : nowMinutes;
                document.getElementById("now").innerText = `${nowHour}:${nowMinutes} ${nowampm}`


                let sunrise = data.sys.sunrise
                let sunriseTime = unixToLocalTime(sunrise, timeZone)
                // console.log(sunriseTime)
                document.getElementById("sunrise").innerText = sunriseTime

                let sunset = data.sys.sunset
                let sunsetTime = unixToLocalTime(sunset, timeZone)
                // console.log(sunsetTime)
                document.getElementById("sunset").innerText = sunsetTime

                let humidity = data.main.humidity
                document.getElementById("humidity").innerText = `${humidity}%`

                let pressure = data.main.pressure
                document.getElementById("pressure").innerText = `${pressure} hPa`

                let visibility = data.visibility
                document.getElementById("visibility").innerText = `${Math.round(visibility / 1000)} km`

                let feelsTemperature = Math.floor(data.main.feels_like - 273)
                document.getElementById("feelslike").innerText = `${feelsTemperature}° C`



            })

        }




        function unixToLocalTime(unixTime, timezone) {


            const localDate = new Date((unixTime + timezone) * 1000);
            // console.log(date)   

            let localHours = localDate.getUTCHours();
            let localMinutes = localDate.getUTCMinutes();


            let ampm = localHours >= 12 ? 'PM' : 'AM';
            localHours = localHours % 12 || 12;
            localMinutes = localMinutes < 10 ? '0' + localMinutes : localMinutes;



            const formattedTime = `${localHours}:${localMinutes} ${ampm}`;

            return formattedTime;
        }

        function airQuality(airdata) {
            let lon = airdata.coord.lon;
            let lat = airdata.coord.lat;
            const airurl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(airurl).then((res) => {
                return res.json();
            }).then((airQualitydata) => {
                console.log(airQualitydata);

                let pm25 = airQualitydata.list[0].components.pm2_5
                // console.log(pm25)
                document.getElementById("PM25").innerText = pm25;

                let so2 = airQualitydata.list[0].components.so2
                // console.log(so2)
                document.getElementById("SO2").innerText = so2;

                let no2 = airQualitydata.list[0].components.no2
                // console.log(no2)
                document.getElementById("NO2").innerText = no2;

                let o3 = airQualitydata.list[0].components.o3
                // console.log(o3)
                document.getElementById("O3").innerText = o3;

                allQualityIndexes = ["Good", "Fair", "Moderate", "Poor", "Very Poor"]
                allIndexColor = ["#36c915", "#84ff68", "#e9ef4b", "#eba04f", "#ff1616"]
                let qualityindex = airQualitydata.list[0].main.aqi

                // console.log(qualityindex)
                document.querySelector(".airQuality").innerText = allQualityIndexes[qualityindex - 1]
                document.querySelector(".airQuality").style.backgroundColor = allIndexColor[qualityindex - 1]





            })

        }




        function hourlyForecast(forecast, timeZoneOffset) {
            document.querySelector('.hourlyForecast').innerHTML = '';


            for (let i = 0; i < 8; i++) {
                let date = new Date((forecast.list[i].dt + timeZoneOffset) * 1000);

                // Format the time string
                let hours = date.getUTCHours();
                let minutes = date.getUTCMinutes();
                // console.log(minutes)

                // Convert hours to 12-hour format and add AM/PM
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12; // Convert 0 to 12 for midnight
                minutes = minutes < 10 ? '0' + minutes : minutes; // Zero pad minutes


                let formattedTime = `${hours}:${minutes} ${ampm}`;
                // console.log(formattedTime)


                formattedTime = formattedTime.replace(':30', ':00');
                // console.log(formattedTime)


                let hourIcon = forecast.list[i].weather[0].icon;
                let hourIconURL = `https://openweathermap.org/img/wn/${hourIcon}@2x.png`;

                let temp = Math.round(forecast.list[i].main.temp - 273);

                document.querySelector('.hourlyForecast').innerHTML += `
            <div class="hourlyData">
                <span class="hourTime">${formattedTime}</span>
                <span class="hourlyIcon"><img src="${hourIconURL}" alt="weather icon"></span>
                <span class="hourlyTemp">${temp}° C</span>
            </div>
        `;
            }
        }



        function dailyForecast(forecast, timeZoneOffset) {
            document.querySelector('.dailyForecast').innerHTML = ''
            for (let i = 7; i < forecast.list.length; i += 8) {
                console.log(forecast.list[i]);

                // let day = new Date(forecast.list[i].dt * 1000).toLocaleString(undefined, 'Asia/Kolkata');
                // console.log(day)
                let dayDate = new Date((forecast.list[i].dt + timeZoneOffset) * 1000).toLocaleDateString('en-US', {
                    // timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: 'short'
                });
                // console.log(dayDate);

                let dayName = new Date((forecast.list[i].dt + timeZoneOffset) * 1000).toLocaleDateString('en-US', {
                    // timeZone: 'Asia/Kolkata',
                    weekday: 'short'
                });
                // console.log(dayName);



                dailytemp = Math.round((forecast.list[i].main.temp - 273));
                // console.log(dailytemp)

                let dailyIcon = forecast.list[i].weather[0].icon
                let dailyIconURL = `https://openweathermap.org/img/wn/${dailyIcon}@2x.png`




                document.querySelector('.dailyForecast').innerHTML += `<div class="dailyData">
                    <span class="dailyDate">${dayDate}</span> <span class="dailyDay">${dayName}</span> <span
                        class="dailyIcon"><img src="${dailyIconURL}"
                            alt="broken clouds"></span> <span class="dailyTemp">${dailytemp}° C</span>

                </div>`



            }
        }



