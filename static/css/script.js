const apiKey = 'c5f693d3b31344e6955b103bd5a50789';
const currentWeatherApiUrl = 'https://api.weatherbit.io/v2.0/current';
const forecastApiUrl = 'https://api.weatherbit.io/v2.0/forecast/daily';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const autoDetectButton = document.getElementById('autoDetectButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const forecastInfoElement = document.getElementById('forecastInfo');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchCurrentWeather(location);
        fetchForecast(location);
    }
});

autoDetectButton.addEventListener('click', () => {
    autoDetectLocation();
});

function fetchCurrentWeather(location) {
    const url = `${currentWeatherApiUrl}?key=${apiKey}&city=${location}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.data[0].city_name;
            temperatureElement.textContent = `${data.data[0].temp}°C`;
            descriptionElement.textContent = data.data[0].weather.description;
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });
}

function fetchForecast(location) {
    const url = `${forecastApiUrl}?key=${apiKey}&city=${location}&days=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayForecast(data) {
    forecastInfoElement.innerHTML = '';

    if (data.data) {
        data.data.forEach(item => {
            const date = new Date(item.valid_date);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperature = item.temp.toFixed(1);
            const description = item.weather.description;

            forecastInfoElement.innerHTML += `<div class="forecast-entry">
                                                <p>${day}: ${temperature}°C, ${description}</p>
                                              </div>`;
        });
    }
}

function autoDetectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiUrl = `${currentWeatherApiUrl}?key=${apiKey}&lat=${lat}&lon=${lon}`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        locationInput.value = data.data[0].city_name;
                        fetchCurrentWeather(data.data[0].city_name);
                        fetchForecast(data.data[0].city_name);
                    })
                    .catch(error => {
                        console.error('Error fetching current weather data:', error);
                    });
            },
            error => {
                console.error('Error getting location:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}
