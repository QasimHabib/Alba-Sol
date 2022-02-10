import React from 'react';
import "./WeatherCard.css";

import sunnyLogo from "../images/sunny.svg";
import foggyLogo from "../images/foggy.svg";
import rainyLogo from "../images/rainy.svg";


const WeatherCard = ({date, info}) => {
    
    let temps = [];
    let sunny = []; let foggy = []; let cloudy = []; let rainy = [];
    info.map((i) => {
        temps.push(parseInt(i.temperature));
        
        if(i.picto.includes("ensoleillé")){
            sunny.push(i.picto);
        }else if(i.picto.includes("voilé")){
            foggy.push(i.picto);
        }else if(i.picto.includes("nuageux")){
            cloudy.push(i.picto);
        }else if(i.picto.includes("faible")){
            rainy.push(i.picto);
        }

    })
    let min = Math.min(...temps);
    let max = Math.max(...temps);

    let lengths = [sunny.length, foggy.length, cloudy.length, rainy.length];

    let index = lengths.indexOf(Math.max(...lengths));

    var day; 

    switch(index) 
    {
        case 0: day = sunnyLogo; break;
        case 1: day = foggyLogo; break;
        case 2: day = foggyLogo; break;
        case 3: day = rainyLogo; break;
    }

    var hour;

    return (
        <div className="weather-card">
            <span className="date">{date}</span>
            <div className="weather-icon-big">
                <img src={day} alt="" style={{width: '100%', height: '100%'}}/>
            </div>


            <div className="temperature">
                <p className="low-high">{min}°C - {max}°C</p>
            </div>
            <div className="hours">
                <div className="hour w-100 header">
                    <div className="weather-icon-small" style={{visibility: 'hidden'}}></div>
                    <span>Heure</span>
                    <span>T°C</span>
                    <span>Vent Moyen</span>
                    <span>Precipitations</span>
                    <span>Humidite</span>
                    <span style={{width: '17%'}}>T°C Sol Surface</span>
                </div>
                {info && info.map((i) => {
                            if(i.picto.includes("ensoleillé")){
                                console.log("sunny")
                                hour = sunnyLogo;
                            }else if(i.picto.includes("voilé")){
                                hour = foggyLogo;
                            }else if(i.picto.includes("nuageux")){
                                hour = foggyLogo;
                            }else if(i.picto.includes("faible")){
                                hour = rainyLogo;
                            }
                           return (
                <div className="hour w-100" key={i.heure}>
                    <div className="weather-icon-small">
                         <img src={hour} alt="i" style={{width: '100%', height: '100%'}}/> 
                    </div>
                    <span>{i.heure}:00</span>
                    <span>{i.temperature}°C</span>
                    <span>{i.vent_moyen}km/h</span>
                    <span>{i.precipitations}mm</span>
                    <span>{i.humidite_relative}%</span>
                    <span>{i.temperature_sol_surface}°C</span>
                </div>
                )})}
            </div>
        </div>
    )
}

export default WeatherCard
