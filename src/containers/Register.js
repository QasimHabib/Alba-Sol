import React, { Component } from 'react';
import Auxiliary from '../hoc/Auxiliary';
import { Form, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Redirect, Route, useHistory } from 'react-router-dom'
import "./LogIn.css";

import Axios from 'axios';

class Register extends Component {

    state = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        company: ""
    }
    
    componentDidMount(){

    }

    render() {

       // const { email, password, firstName, lastName, phone, company } = this.state;

        const login = () => {
            const { email, password, firstName, lastName, phone, company } = this.state;
              
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };

            const addClient = Axios.post("http://192.168.100.232:3001/add-client", {
                email: this.state.email,
                password: this.state.password,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                numero_Tel: this.state.phone,
                entreprise_name: this.state.company,
                dep_Ref: "",
                address: ""
            }, axiosConfig);
            const registerClient = Axios.post("http://192.168.100.232:3001/register",{
                email: this.state.email,
                password: this.state.password,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                user_type: 0
            },axiosConfig);
            Axios.all([addClient, registerClient]).then(Axios.spread((...responses) => {
                // use/access the results 
                window.location.href = "/";
                
              })).catch(errors => {
                // react on errors.
              })

            /*Axios.post("http://192.168.100.232:3001/login", postData, axiosConfig).then((response) => {
                this.setState({loginStatus: response.data});
                console.log(response);
                localStorage.setItem('loginToken', this.state.username);

                if(this.state.username === 'd.kapexhiu@stema.al'){
                    localStorage.setItem('roleUser', 'ADMIN');
                }else{
                    localStorage.setItem('roleUser', 'USER');
                }
                window.location.reload();
                
            });*/
        };

        return (
            <Router>
            <Auxiliary>
                <div className="main d-flex align-items-center justify-content-center" style={{backgroundColor: "#F5F6F8", height: 100 + "vh"}}>

                    <div className="form-container form-container-mob" style={{width: 22 + "%"}}>
                        <h1>Connectez-vous.</h1>
                        <p className="my-5">Ici, vous pouvez vous connecter au monde d'Albasolutions.</p>
                        <Form>
                            <Form.Group className="formGroup">
                                <Form.Control 
                                className="formControl"
                                type="email"
                                placeholder=""
                                onChange={ (e) => {
                                    this.setState({email: e.target.value})
                                }} />
                                <Form.Label className="formLabel">{this.state.email === '' ? 'Email' : ''}</Form.Label>
                            </Form.Group>
                            <Form.Group className="formGroup">
                                <Form.Control
                                className="formControl"
                                type="password" 
                                placeholder="" 
                                onChange={ (e) => {
                                    this.setState({password: e.target.value})
                                }}
                                />
                                <Form.Label className="formLabel">{this.state.password === '' ? 'Mot de passe' : ''}</Form.Label>
                            </Form.Group>
                            <Form.Group className="formGroup">
                                <Form.Control
                                className="formControl"
                                type="text" 
                                placeholder="" 
                                onChange={ (e) => {
                                    this.setState({firstName: e.target.value})
                                }}
                                />
                                <Form.Label className="formLabel">{this.state.firstName === '' ? 'Prénom' : ''}</Form.Label>
                            </Form.Group>
                            <Form.Group className="formGroup">
                                <Form.Control
                                className="formControl"
                                type="text" 
                                placeholder="" 
                                onChange={ (e) => {
                                    this.setState({lastName: e.target.value})
                                }}
                                />
                                <Form.Label className="formLabel">{this.state.lastName === '' ? 'Surname' : ''}</Form.Label>
                            </Form.Group>
                            <Form.Group className="formGroup">
                                <Form.Control
                                className="formControl"
                                type="text" 
                                placeholder="" 
                                onChange={ (e) => {
                                    this.setState({phone: e.target.value})
                                }}
                                />
                                <Form.Label className="formLabel">{this.state.phone === '' ? 'Phone' : ''}</Form.Label>
                            </Form.Group>
                            <Form.Group className="formGroup">
                                <Form.Control
                                className="formControl"
                                type="text" 
                                placeholder="" 
                                onChange={ (e) => {
                                    this.setState({company: e.target.value})
                                }}
                                />
                                <Form.Label className="formLabel">{this.state.company === '' ? 'Entreprise' : ''}</Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Button 
                                variant="danger" 
                                className="w-100" 
                                style={{backgroundColor: "#B84257"}}
                                onClick={login}
                                >
                                    S'inscrire
                                </Button>
                            </Form.Group>
                        </Form>
                        <a href="/">Vous avez un compte? Se connecter ici</a>
                    </div>
                </div>


                
            </Auxiliary>
            </Router>
        );
    }
}

export default Register;