const api = {
    key: "d675ec33f5abf21f0f93d4af4fb99093",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

const cidadeEstado = document.querySelector(".cidade-estado");
const dataAtual = document.querySelector(".data");
const horario = document.querySelector(".container-horario span");
const infoComplementar = document.querySelector(".info-complementar");
const infoMetereologico = document.querySelector(".info-metereologico");
const latLong = document.querySelector(".long-lat");
const local = document.querySelector("#local");
const main = document.querySelector(".main");
const temperatura = document.querySelector(".temperatura");
const semanaDia = document.querySelector(".diaSemana");

let div = document.createElement("div");
let date = new Date();

document.addEventListener("keydown", function(e){
    if(e.keyCode === 13)
        dadosMetereologicos();
});

window.addEventListener('load', () => {
    localStorage.clear();

    if(date.getHours() > 5 && date.getHours() <= 12)
        main.style.background = 'url("https://images.unsplash.com/photo-1603299515818-82b7e687a789?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80") no-repeat'
    else if(date.getHours() > 12 && date.getHours() <= 18)
        main.style.background = 'url("https://images.pexels.com/photos/161963/chicago-illinois-skyline-skyscrapers-161963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat';
    else
        main.style.background = 'url("https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat'

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('navegador não suporta geolozalicação');
    }
    function setPosition(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordenadas(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }

})

function coordenadas(latitude, longetitude){
    fetch(`${api.base}weather?lat=${latitude}&lon=${longetitude}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        addInfos(data);
        addInfosMetereologicos(data, data.weather[0].main);
    })
}

function dadosMetereologicos(){

    fetch(`${api.base}weather?q=${local.value}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)

    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        addInfos(data);
        addInfosMetereologicos(data, data.weather[0].main);
    })
}

function addInfosDate(){
    horario.innerHTML = "";
    var diaSemana = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado", "Domingo"];
    let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro","Outubro", "Novembro", "Dezembro"];

    semanaDia.innerHTML = `${diaSemana[date.getDay()-1]}`;
    dataAtual.innerHTML = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
    
    if(date.getHours() == 0)
        horario.innerHTML += "0" + date.getHours() + ":";
    else
        horario.innerHTML += date.getHours() + ":";

    if(date.getMinutes() < 9)
        horario.innerHTML += "0" + date.getMinutes();
    else
        horario.innerHTML += date.getMinutes();
}

function addInfos(data){
    div.innerHTML = "";

    cidadeEstado.innerHTML = `${data.name}, ${data.sys.country}`;
    latLong.innerHTML = `${data.coord.lat}, ${data.coord.lon}`;
    temperatura.innerHTML = `${Math.round(data.main.temp)}°`;

    addInfosDate()
    div.setAttribute("class", "container-tempo centralizar");

    DescricaoTempo(div, data.weather[0].description, data.weather[0].main);

    local.value = '';
    local.focus();
}

function DescricaoTempo(div, descricao, tempo){
    div.innerHTML = "<h2 class='tempoD'>" + descricao + "</h2>";

    if(tempo == "Clear")
    {
        main.style.background = 'url("https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat'
        div.innerHTML += "<i class='ph-sun-bold'></i>";
    }

    else if(tempo == "Clouds")
    {
        if(descricao == "nublado")
        {
            main.style.background = 'url("https://images.pexels.com/photos/414659/pexels-photo-414659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat'
            div.innerHTML += '<i class="ph-cloud-fog-bold"></i>';
        }
        else
        {
            main.style.background = 'url("https://images.pexels.com/photos/46160/field-clouds-sky-earth-46160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat'
            div.innerHTML += '<i class="ph-cloud-bold"></i>';
        }
    }

    else if(tempo == "Rain")
    {
        main.style.background = 'url("https://images.unsplash.com/photo-1558409057-bbe679023136?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1037&q=80") no-repeat'
        div.innerHTML += '<i class="ph-cloud-rain-bold"></i>'
    }

    else if(tempo == "Snow")
    {
        main.style.background = 'url("https://images.pexels.com/photos/730256/pexels-photo-730256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat'
        div.innerHTML += '<i class="ph-snowflake-bold"></i>'
    }
        
    infoComplementar.appendChild(div);
}



function addInfosMetereologicos(data, tempo){
    let visibilidade = data.visibility;
    infoMetereologico.innerHTML = "";

    for (let index = 0; index < 3; index++)
        visibilidade = visibilidade / 10;  

    let dados = `<h2>Detalhes Metereologico</h2>
                 <ul>
                    <li>Direção do Vento: ${data.wind.deg}°</li>
                    <li>Nebulosidade: ${data.clouds.all}%</li>
                    <li>Pressão Atmosferica: ${data.main.pressure}</li>
                    <li>Temperatura Max: ${data.main.temp_max}° - Min: ${data.main.temp_min}°</li>
                    <li>Temperatura a percepção humana: ${data.main.feels_like}°
                    <li>Umidade: ${data.main.humidity}%</li>
                    <li>Velocidade do Vento: ${data.wind.speed}km/h</li>
                    <li>Visibilidade: ${visibilidade}km</li>`
    if(tempo == "Rain")
    {
        if(data.rain["1h"])
            dados += `  <li>Volume de chuva nas últimas 1 hora: ${data.rain["1h"]}mm
                     </ul>`
        else
            dados += `  <li>Volume de chuva nas últimas 3 hora: ${data.rain["3h"]}mm
                     </ul>`
    }
    else if(tempo == "Snow")
    {
        if(data.snow["1h"])
            dados += `  <li>Volume de neve para últimas 1 hora: ${data.snow["1h"]}mm
                      </ul>`
        else
            dados += `  <li>Volume de neve nas últimas 3 hora: ${data.snow["3h"]}mm
                     </ul>`
    }
    infoMetereologico.innerHTML += dados;
}