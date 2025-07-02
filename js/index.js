//9a623cfa09f64ecea86205445252006
//https://api.weatherapi.com/v1/forecast.json?key=9a623cfa09f64ecea86205445252006&q=alexandria&days=3
//varibals
const baseURL =`https://api.weatherapi.com/v1`;
const endPoint=`/forecast.json`
const apiKey =`9a623cfa09f64ecea86205445252006`
const rowData=document.querySelector('#container');
const search =document.querySelector('input');


let weatherData={};

const getDateDetails = (x)=> {
const date = new Date(x);
let weekDay =date.toLocaleDateString('en-us',{
    weekday:'long'
});
let day =date.toLocaleDateString('en-us',{
day:'numeric'
});
let month =date.toLocaleDateString('en-us',{
    month:'long'
});
return{weekDay,day,month};
}

const dispalyWeather=(array)=>{
    let cartona=``;
for (let i = 0; i < array.length ; i++) {
    getDateDetails(array[i].date);
    const {weekDay,day,month} =getDateDetails(array[i].date);
  
    
   cartona += `
  <div class="col-md-6 col-lg-4">
    <div class="card text-white shadow-lg" style="background-color: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px;">
      <div class="d-flex justify-content-between align-items-center fs-5 mb-2">
        <p class="mb-0">${weekDay}</p>
        <p class="mb-0">${day} ${month}</p>
      </div>
      <div>
        ${i === 0 ? `<p class="text-start fs-5 mb-3">${weatherData.location.name}</p>` : ``}
        <div class="d-flex flex-column justify-content-center align-items-center">
          ${i === 0 ? `
            <p class="display-3 fw-bold">${weatherData.current.temp_c} &deg;C</p>
            <img src="https:${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}" class="mb-2" width="64">
          ` : `
            <img src="https:${weatherData.forecast.forecastday[i].day.condition.icon}" alt="${weatherData.forecast.forecastday[i].day.condition.text}" class="mb-2" width="64">
            <p class="mb-1">Max: ${weatherData.forecast.forecastday[i].day.maxtemp_c}°C</p>
            <p class="mb-2">Min: ${weatherData.forecast.forecastday[i].day.mintemp_c}°C</p>
          `}
        </div>
        <p class="text-center fs-5 mt-3">
          ${i === 0 ? weatherData.current.condition.text : weatherData.forecast.forecastday[i].day.condition.text}
        </p>
      </div>
      ${i === 0 ? `
        <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-2 fs-6">
          <span><i class="fa-solid fa-umbrella"></i> ${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
          <span><i class="fa-solid fa-wind"></i> ${weatherData.current.wind_kph} KM/H</span>
          <span><i class="fa-solid fa-compass"></i> ${weatherData.current.wind_dir}</span>
        </div>
      ` : ""}
    </div>
  </div>
`;


   
    
}
 rowData.innerHTML=cartona;
}

const getWeatherData = async (city='cairo') => {
    if(city.length===0) getWeatherData();
    if(city.length<3) return ;
    try {
        let response = await fetch(`${baseURL}${endPoint}?key=${apiKey}&q=${city}&days=3`);
        if (response.ok === false) {
            switch (response.status) {
                case 400: {
                    throw new Error(` ${await response.text()}`);
 

                }
                case 500:{
                    throw new Error(" Error?")
                }
                default :{
                    throw new Error("could not fetch data!")
                } } }

        let data = await response.json();


       
        weatherData = data;
        // console.log(data);
        
        
        dispalyWeather(weatherData.forecast.forecastday)
        
} catch (error) {
}
}
getWeatherData();




search.addEventListener('input', (e)=> {
 getWeatherData(e.target.value);
});
window.navigator.geolocation.getCurrentPosition((success)=>{

getWeatherData(`${success.coords.latitude},${success.coords.longitude}`);

},(reject)=>{
    getWeatherData();


})