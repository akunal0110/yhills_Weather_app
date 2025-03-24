const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details'); 
const moreInfo = document.querySelector('.more-info');
const error404 = document.querySelector('.not-found');
const input = document.querySelector('.search-box input');

const fetchWeather = () => {
    const APIKey = 'c592bdef5e907675053ab89cb7f7dc46';
    const city = input.value.trim();

    if (city === '') {
        alert('Please enter a city name.');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '520px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                moreInfo.classList.remove('active');
                error404.classList.add('active');
                return;
            }

            container.style.height = '630px';
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            moreInfo.classList.add('active');
            error404.classList.remove('active');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            const visibility = document.querySelector('.more-info .visibility');
            const pressure = document.querySelector('.more-info .pressure');

            if (!image || !temperature || !description || !humidity || !wind || !visibility || !pressure) {
                console.error('Some elements are missing in the DOM.');
                return;
            }

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Mist':
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    console.warn(`No image found for: ${json.weather[0].main}`);
                    image.src = 'images/default.png';
                    break;
            }

            temperature.textContent = `${json.main.temp}°C`;
            description.textContent = `${json.weather[0].description}`;
            humidity.textContent = `${json.main.humidity}%`;
            wind.textContent = `${json.wind.speed} km/h`;
            visibility.textContent = `Visibility: ${json.visibility / 1000} km`;
            pressure.textContent = `Pressure: ${json.main.pressure} hPa`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        });
};

if (search) {
    search.addEventListener('click', fetchWeather);
}

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});
