import React, { Component } from 'react';
import Auxiliary from '../hoc/Auxiliary';
import { Form, Button} from 'react-bootstrap';
//import { BrowserRouter as Router, Redirect, Route, useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

//import "./LogIn.css";
import './Settings.css';
import profile from '../images/profile.svg';
//import password from '../images/password.svg';

import Axios from 'axios';
//var qs = require('qs');

class Archive extends Component {
    constructor(props) {
    super(props)
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            showProfile: true,
            showPassword: false,
            activeProfile: false,
            activePassword: false,
        }
        this.toggleStateProfile = this.toggleStateProfile.bind(this);
        this.toggleStatePassword = this.toggleStatePassword.bind(this);
        this.getData = this.getData.bind(this);
    }   

    componentDidMount(){
        var loginToken = localStorage.getItem('loginToken');
        if (!loginToken){
            this.props.history.push('/');
        }
        this.getData();
    }
    toggleStateProfile() {
        this.setState({ showProfile: !this.state.showProfile });
        this.setState({ showPassword: !this.state.showPassword });
        this.setState({ activeProfile: !this.state.active });
    }
    toggleStatePassword() {
        this.setState({ showProfile: !this.state.showProfile });
        this.setState({ showPassword: !this.state.showPassword });
        this.setState({ activePassword: !this.state.active });
    }
    getData() {
        var loginToken = localStorage.getItem('loginToken');
        var config = {
            method: 'get',
            url: 'https://frozen-temple-16675.herokuapp.com/user/'+loginToken,
            headers: { 
              'Content-Type': 'application/json'
            },
        };
        const self = this;
        Axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data[0]));
            self.setState({ firstName: response.data[0].first_name });
            self.setState({ lastName: response.data[0].last_name });
        })
          .catch(function (error) {
            console.log(error);
        });
    }

    logout = () => {
        localStorage.removeItem("loginToken");
        //this.props.history.push('/');
        window.location.href = '/';
    }



    render() {
        const submit = () => {
            const { firstName, lastName, newPassword } = this.state;
            console.log(firstName, lastName, newPassword);
            const email = localStorage.getItem('loginToken');
            Axios.put("https://frozen-temple-16675.herokuapp.com/update-user", {
                email: email,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                password: this.state.newPassword
            }).then((response) => {
                //this.setState({loginStatus: response.data});
                console.log(response);
                window.location.reload();
            });
        };
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <a
                href="/#"
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                >
                {children}
                </a>
            ));
        return (
            <Auxiliary>

                <div className="main d-flex align-items-center justify-content-center" style={{backgroundColor: "#F5F6F8", height: 100 + "vh"}}>

                    <div className="container">
                        <div className="row pt-4 head">
                            <div className="col-md-10">
                                <h2>Parametres</h2>
                            </div>
                            <div className="col-md-2">
                                <div className="user d-flex align-items-center justify-content-between">
                                    <i className="fas fa-user-circle" style={{width: 40 + "px", height: 40+ "px"}}></i>
                                    <p className="m-0" style={{color: "#25283D"}}>{this.state.firstName} {this.state.lastName}</p>
                                    
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
                        <div className="row pt-3" style={{height: "90vh"}}>
                            <div className="col-md-4 profil">
                                <p className={this.state.activeProfile ? 'active': null} style={{fontSize: '13px'}} onClick={this.toggleStateProfile}><img src={profile} alt=""/> Profil</p>
                                {/*<p className={this.state.activePassword ? 'active': null} style={{fontSize: '13px'}} onClick={this.toggleStatePassword}><img src={password} /> Mot de passe</p>*/}
                            </div>
                            <div className="col-md-8">
                    
                                <div id="profile" style={{ display: (this.state.showProfile ? 'block' : 'none') }}>
                                
                                    <div className="form-container" style={{width: 50 + "%"}}>
                                        <h3 style={{fontSize: '18px', color: '#B84257', lineHeight: '27px', fontWeight: '600'}}>Paramètres de profil</h3>
                                        <p style={{fontSize: '14px', color: '#444754', lineHeight: '21px', fontWeight: '400'}} className="my-5">Modifier les paramètres du profil</p>
                                        <Form>
                                            <Form.Group className="formGroup">
                                                <Form.Control 
                                                className="formControl"
                                                type="text"
                                                placeholder=""
                                                onChange={ (e) => {
                                                    this.setState({firstName: e.target.value})
                                                }} />
                                                <Form.Label className="formLabel">{this.state.firstName === '' ? 'Nom' : this.state.firstName}</Form.Label>
                                            </Form.Group>
                                            <Form.Group className="formGroup">
                                                <Form.Control
                                                className="formControl"
                                                type="email" 
                                                placeholder="" 
                                                onChange={ (e) => {
                                                    this.setState({lastName: e.target.value})
                                                }}
                                                />
                                                <Form.Label className="formLabel">{this.state.lastName === '' ? 'Prenom' : this.state.lastName}</Form.Label>
                                            </Form.Group>
                                            <Form.Group className="formGroup">
                                                <Form.Control
                                                className="formControl"
                                                type="text" 
                                                placeholder="" 
                                                onChange={ (e) => {
                                                    this.setState({newPassword: e.target.value})
                                                }}
                                                />
                                                <Form.Label className="formLabel">{this.state.newPassword === '' ? 'Nouveau mot de passe' : ''}</Form.Label>
                                            </Form.Group>
                                            <Form.Group className="formGroup">
                                                <Form.Control
                                                className="formControl"
                                                type="text" 
                                                placeholder="" 
                                                onChange={ (e) => {
                                                    this.setState({password: e.target.value})
                                                }}
                                                />
                                                <Form.Label className="formLabel">{this.state.confirmPassword === '' ? 'Confirmez le mot de passe' : ''}</Form.Label>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button 
                                                variant="danger" 
                                                className="saveBtn" 
                                                style={{backgroundColor: "#B84257"}}
                                                onClick={submit}
                                                >
                                                    Sauvegarder
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
 
                                </div>
                                
                                {/*<div id="password" style={{ display: (this.state.showPassword ? 'block' : 'none') }}>

                                    <div className="form-container" style={{width: 50 + "%"}}>
                                        <h3 style={{fontSize: '18px', color: '#B84257', lineHeight: '27px', fontWeight: '600'}}>Changer le mot de passe</h3>
                                        <p style={{fontSize: '14px', color: '#444754', lineHeight: '21px', fontWeight: '400'}} className="my-5">Modifier le mot de passe</p>
                                        <Form>
                                            <Form.Group className="formGroup">
                                                <Form.Control 
                                                className="formControl"
                                                type="text"
                                                placeholder=""
                                                onChange={ (e) => {
                                                    //this.setState({username: e.target.value})
                                                }} />
                                                <Form.Label className="formLabel">{this.state.oldPassword === '' ? 'Ancien mot de passe' : ''}</Form.Label>
                                            </Form.Group>
                                            <Form.Group className="formGroup">
                                                <Form.Control
                                                className="formControl"
                                                type="text" 
                                                placeholder="" 
                                                onChange={ (e) => {
                                                    //this.setState({password: e.target.value})
                                                }}
                                                />
                                                <Form.Label className="formLabel">{this.state.newPassword === '' ? 'Nouveau mot de passe' : ''}</Form.Label>
                                            </Form.Group>
                                            <Form.Group className="formGroup">
                                                <Form.Control
                                                className="formControl"
                                                type="text" 
                                                placeholder="" 
                                                onChange={ (e) => {
                                                    //this.setState({password: e.target.value})
                                                }}
                                                />
                                                <Form.Label className="formLabel">{this.state.confirmPassword === '' ? 'Confirmez le mot de passe' : ''}</Form.Label>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button 
                                                variant="danger" 
                                                className="saveBtn" 
                                                style={{backgroundColor: "#B84257"}}
                                                //onClick={login}
                                                >
                                                    Sauvegarder
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </div>

                                            </div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </Auxiliary>
        );
    }
}
export default Archive;