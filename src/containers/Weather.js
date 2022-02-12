import React, { Component } from 'react';
import './Weather.css';
import Auxiliary from '../hoc/Auxiliary';
import Axios from 'axios';
import { Dropdown } from 'react-bootstrap';

import WeatherCard from '../components/WeatherCard';

//import Select, { createFilter } from "react-select";
//import { FixedSizeList as List } from "react-window";

//import Search from 'react-search';

import { AutoSuggest } from "react-autosuggestions";

import { communes } from './communesData.js';

//import { location1 } from './weather1.js' 

//const height = 35;

class Weather extends Component {

    state = {
        first_name: "",
        last_name: "",
        searchTerm: "",
        weatherData: "",
        communes: [],
        commune: "",
        array: []
    }

    componentDidMount(){
        var loginToken = localStorage.getItem('loginToken');
        if (!loginToken){
            this.props.history.push('/');
        }

        Axios.get("http://192.168.100.232:3001/users").then((response) => {
            //console.log(response.data);
            var users = response.data;
            users.forEach(element => {
                if(element.email === loginToken){
                this.setState({
                    first_name: element.first_name,
                    last_name: element.last_name
                });
                } 
            });
        }); 

        this.setResult();
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.state.commune !== prevState.commune) {

            var self = this;

            var config = {
            method: 'get',
            url: 'https://www.meteo60.fr/previsions/json_wrf/4_dgrr56deg-egv57egervez-ezvszfczzz5/'+this.state.commune,
            headers: { }
            };
    
            Axios(config)
            .then(function (response) {
            var dates = response.data.reduce((r, a) => {
                r[a.jour] = [...r[a.jour] || [], a];
                return r;
            }, {});
            self.setState({weatherData: dates});
            })
            .catch(function (error) {
            console.log(error);
            });
        }
   }

                setResult = () => {

                /*let result = location1.reduce((r, a) => {
                    // console.log("a", a);
                    // console.log('r', r);
                    r[a.jour] = [...r[a.jour] || [], a];
                    return r;
                }, {});
        
                this.setState({weatherData: result});*/
        
                if(this.state.commune !== ''){
        
                    var self = this;
        
                    var config = {
                    method: 'get',
                    url: 'https://www.meteo60.fr/previsions/json_wrf/4_dgrr56deg-egv57egervez-ezvszfczzz5/'+this.state.commune,
                    headers: { }
                    };
            
                    Axios(config)
                    .then(function (response) {
                    var dates = response.data.reduce((r, a) => {
                        r[a.jour] = [...r[a.jour] || [], a];
                        return r;
                    }, {});
                    self.setState({weatherData: dates});
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                }else{
                    console.log("Choisir le commune");
                }    
        
            }

    logout = () => {
        localStorage.removeItem("loginToken");
        //this.props.history.push('/');
        window.location.href = '/';
    }

    render(){

        let data = this.state.weatherData;

        const obj =  Object.entries(data);

        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <a href="/#"
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                >
                {children}
                </a>
            ));
        
        

        console.log(this.state.commune)

        return(
            <Auxiliary>
                <div className="main" style={{width: '100%'}}>
                    <div className="container" style={{maxWidth: '80%', marginLeft: '16%'}}>
                        <div className="row pt-4 pb-3">
                            <div className="col-md-10">
                                <h2>La météo</h2>
                            </div>
                            <div className="col-md-2">
                            <div className="user d-flex align-items-center justify-content-between">
                                <i className="fas fa-user-circle" style={{width: 40 + "px", height: 40+ "px"}}></i>
                                <p className="m-0" style={{color: "#25283D"}}>{this.state.first_name} {this.state.last_name}</p>
                                    
                                <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <i className="fas fa-chevron-down" style={{cursor: "pointer", color: "#25283D"}}></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => this.logout()}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            </div>
                        </div>
                    
                        <div className="row pt-4">
                            <div className="form-group position-relative mb-3 col-md-9" style={{display: 'flex'}}>
                                <AutoSuggest
                                    debounceTime={3000}
                                    options={communes}
                                    handleChange={(e) => {
                                        this.setState({commune: e});
                                    }}
                                    value={this.state.commune}
                                />
                                <span className="fa fa-search form-control-feedback" style={{position: 'absolute', left: '30%', top: '20%'}}></span>
                            </div>

                            {/*<div className="form-group w-25 position-relative has-search mb-0">
                                <span className="fa fa-search form-control-feedback" style={{right: '5%'}}></span>
                                <input 
                                type="text" 
                                className="form-control search border-0" 
                                placeholder="Chercher..."
                                onChange={(e) => this.setState({searchTerm: e.target.value})} />
                            </div>*/}
                        </div>
                    </div>
                    <div className="container mt-5" style={{maxWidth: '80%', marginLeft: '16%'}}>
                        <div className="cards-container">
                            <div className="cards">

                            {obj.map( (date) => (
                                <WeatherCard
                                key={date[0]}
                                date={date[0]}
                                info={date[1]} />    
                            ) 
                            )}

                            </div>
                        </div>
                    </div>
                </div>
            </Auxiliary>
        );
    }
}

export default Weather;