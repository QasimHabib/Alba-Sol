import React, { Component } from 'react';
import Auxiliary from '../hoc/Auxiliary';
import { Form, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Redirect, Route, useHistory } from 'react-router-dom'
import "./LogIn.css";

import Axios from 'axios';

class LogIn extends Component {

    state = {
        username: "",
        password: "",
        loginStatus: "",
        isChecked: false
    }
    

    // isLoggedIn = async () => {
    //     const loginToken = localStorage.getItem('loginToken');
    //     console.log(loginToken);

    //     if(loginToken){
    //         history.push('/calendar');
    //     }
    // }

    
    componentDidMount(){

        // this.isLoggedIn();

        // this.toggleSideBar();

        // $(document).ready(function(){
        //     $(document).on('click', '.nav button', function() {
        //     $(".nav button").removeClass("active");
        //     $(this).addClass("active");
        // });

        // $(document).on('click', '.modal-nav button', function() {
        //     $(".modal-nav button").removeClass("active");
        //     $(this).addClass("active");
        // });

        
        // $(".nav-link-1").hover(function(){
        //     $(".icon1").css('fill', '#B84257');
        // }, function(){
        //     $(".icon1").css('fill', '');
        // });

        // $(".nav-link-1").focusin(function(){
        //     $('.icon1').addClass("active");
        // }).focusout(function(){
        //     $('.icon1').removeClass("active");
        // });


        // $(".nav-link-2").hover(function(){
        //     $(".icon2").css('fill', '#B84257');
        // }, function(){
        //     $(".icon2").css('fill', '');
        // });

        // $(".nav-link-2").focusin(function(){
        //     $('.icon2').addClass("active");
        // }).focusout(function(){
        //     $('.icon2').removeClass("active");
        // });

        // $(".nav-link-3").hover(function(){
        //     $(".icon3").css('fill', '#B84257');
        // }, function(){
        //     $(".icon3").css('fill', '');
        // });

        // $(".nav-link-3").focusin(function(){
        //     $('.icon3').addClass("active");
        // }).focusout(function(){
        //     $('.icon3').removeClass("active");
        // });

        // $(".nav-link-4").hover(function(){
        //     $(".icon4").css('fill', '#B84257');
        // }, function(){
        //     $(".icon4").css('fill', '');
        // });

        // $(".nav-link-4").focusin(function(){
        //     $('.icon4').addClass("active");
        // }).focusout(function(){
        //     $('.icon4').removeClass("active");
        // });

        // $(".nav-link-5").hover(function(){
        //     $(".icon5").css('fill', '#B84257');
        // }, function(){
        //     $(".icon5").css('fill', '');
        // });

        // $(".nav-link-5").focusin(function(){
        //     $('.icon5').addClass("active");
        // }).focusout(function(){
        //     $('.icon5').removeClass("active");
        // });

        // $(".nav-link-6").hover(function(){
        //     $(".icon6").css('fill', '#B84257');
        // }, function(){
        //     $(".icon6").css('fill', '');
        // });

        // $(".nav-link-6").focusin(function(){
        //     $('.icon6').addClass("active");
        // }).focusout(function(){
        //     $('.icon6').removeClass("active");
        // });

        // $(".nav-link-7").hover(function(){
        //     $(".icon7").css('fill', '#B84257');
        // }, function(){
        //     $(".icon7").css('fill', '');
        // });

        // $(".nav-link-7").focusin(function(){
        //     $('.icon7').addClass("active");
        // }).focusout(function(){
        //     $('.icon7').removeClass("active");
        // });
    
        // });

        if (localStorage.checkbox && localStorage.username !== "") {
            this.setState({
                isChecked: true,
                username: localStorage.username,
                password: localStorage.password
            })
        }
    }

    // toggleSideBar = event => {
    //     this.sidebar.toggle();
    // }
 
    onChangeCheckbox = event => {
        this.setState({
            isChecked: event.target.checked
        })
    }


    render() {

        // const labelStyle = {
        // position: "absolute",
        // left: 5 + "%",
        // top: 2 + "%",
        // fontSize: 10 + "px",
        // fontWeight: 600,
        // color: "#B84257",
        // opacity: 1 
        // };

        const { username, password, isChecked } = this.state;

        const login = () => {
            const { username, password, isChecked } = this.state;
            if (isChecked && username !== "") {
                localStorage.username = username
                localStorage.password = password
                localStorage.checkbox = isChecked
            }

            var postData = {
                email: this.state.username,
                password: this.state.password
            };

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };

            Axios.post("http://192.168.100.232:3001/login", postData, axiosConfig).then((response) => {
                this.setState({loginStatus: response.data});
                console.log(response.data);
                localStorage.setItem('loginToken', this.state.username);

                if(this.state.username === 'd.kapexhiu@stema.al'){
                    localStorage.setItem('roleUser', 'ADMIN');
                }else{
                    localStorage.setItem('roleUser', 'USER');
                }
                window.location.reload();
                
            });
        };

        return (
            <Router>
            <Auxiliary>
                <div className="main d-flex align-items-center justify-content-center" style={{backgroundColor: "#F5F6F8", height: 100 + "vh"}}>
                {/* <SideBar ref={(sidebar => this.sidebar = sidebar)} >
                    <div className="sidenav d-flex flex-column bg-white align-items-start px-4 pb-2 pt-4 h-100 w-100">
                        <Link to="/" style={{textDecoration: "none"}}>
                        <div className="logo d-flex align-items-center px-3">
                            <h2 style={{fontWeight: 900, color: "#B84257"}}>ALBA</h2>
                            <p className="my-0 mx-1" style={{color: "#B84257", letterSpacing: 2 + "px"}}>solutions</p>
                        </div>
                        </Link>

                        <div className="nav-links mt-5">
                        <div className="d-flex align-items-center link1">
                                <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="icon1" d="M0 11.6875C0 12.4121 0.671875 13 1.5 13H12.5C13.3281 13 14 12.4121 14 11.6875V5.25H0V11.6875ZM2 7.4375C2 7.19688 2.225 7 2.5 7H5.5C5.775 7 6 7.19688 6 7.4375V10.0625C6 10.3031 5.775 10.5 5.5 10.5H2.5C2.225 10.5 2 10.3031 2 10.0625V7.4375ZM12.5 1.75H11V0.4375C11 0.196875 10.775 0 10.5 0H9.5C9.225 0 9 0.196875 9 0.4375V1.75H5V0.4375C5 0.196875 4.775 0 4.5 0H3.5C3.225 0 3 0.196875 3 0.4375V1.75H1.5C0.671875 1.75 0 2.33789 0 3.0625V4.375H14V3.0625C14 2.33789 13.3281 1.75 12.5 1.75Z" fill="#ECEFF3"/>
                                </svg>
                            <a href="#" className="nav-link nav-link-1 py-3">Calendrier</a>
                            
                        </div>
                        <Link to="/projects" style={{textDecoration: "none"}}>
                            <div className="d-flex align-items-center">
                                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="icon2" d="M2.1 4.8125C2.87219 4.8125 3.5 4.1959 3.5 3.4375C3.5 2.6791 2.87219 2.0625 2.1 2.0625C1.32781 2.0625 0.7 2.6791 0.7 3.4375C0.7 4.1959 1.32781 4.8125 2.1 4.8125ZM11.9 4.8125C12.6722 4.8125 13.3 4.1959 13.3 3.4375C13.3 2.6791 12.6722 2.0625 11.9 2.0625C11.1278 2.0625 10.5 2.6791 10.5 3.4375C10.5 4.1959 11.1278 4.8125 11.9 4.8125ZM12.6 5.5H11.2C10.815 5.5 10.4672 5.65254 10.2134 5.89961C11.095 6.37441 11.7206 7.23164 11.8562 8.25H13.3C13.6872 8.25 14 7.94277 14 7.5625V6.875C14 6.1166 13.3722 5.5 12.6 5.5ZM7 5.5C8.35406 5.5 9.45 4.42363 9.45 3.09375C9.45 1.76387 8.35406 0.6875 7 0.6875C5.64594 0.6875 4.55 1.76387 4.55 3.09375C4.55 4.42363 5.64594 5.5 7 5.5ZM8.68 6.1875H8.49844C8.04344 6.40234 7.53813 6.53125 7 6.53125C6.46187 6.53125 5.95875 6.40234 5.50156 6.1875H5.32C3.92875 6.1875 2.8 7.29609 2.8 8.6625V9.28125C2.8 9.85059 3.27031 10.3125 3.85 10.3125H10.15C10.7297 10.3125 11.2 9.85059 11.2 9.28125V8.6625C11.2 7.29609 10.0712 6.1875 8.68 6.1875ZM3.78656 5.89961C3.53281 5.65254 3.185 5.5 2.8 5.5H1.4C0.627813 5.5 0 6.1166 0 6.875V7.5625C0 7.94277 0.312812 8.25 0.7 8.25H2.14156C2.27938 7.23164 2.905 6.37441 3.78656 5.89961Z" fill="#ECEFF3"/>
                                    </svg>                
                                <p className="nav-link nav-link-2 py-3 m-0">Projets</p>
                            </div>
                        </Link>
                        
                        <Link to="/clients" style={{textDecoration: "none"}}>
                            <div className="d-flex align-items-center">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="icon3" d="M8.75 9.1875C8.75 9.42922 8.55422 9.625 8.3125 9.625H5.6875C5.44578 9.625 5.25 9.42922 5.25 9.1875V7.875H0V11.8125C0 12.5125 0.6125 13.125 1.3125 13.125H12.6875C13.3875 13.125 14 12.5125 14 11.8125V7.875H8.75V9.1875ZM12.6875 3.5H10.5V2.1875C10.5 1.4875 9.8875 0.875 9.1875 0.875H4.8125C4.1125 0.875 3.5 1.4875 3.5 2.1875V3.5H1.3125C0.6125 3.5 0 4.1125 0 4.8125V7H14V4.8125C14 4.1125 13.3875 3.5 12.6875 3.5ZM8.75 3.5H5.25V2.625H8.75V3.5Z" fill="#ECEFF3"/>
                                    </svg>                
                                <p className="nav-link nav-link-3 py-3 m-0">Clients</p>
                            </div>
                        </Link>
                        <div className="d-flex align-items-center">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="icon4" d="M0.875 12.25C0.875 12.734 1.26602 13.125 1.75 13.125H12.25C12.734 13.125 13.125 12.734 13.125 12.25V4.375H0.875V12.25ZM5.25 6.45312C5.25 6.27266 5.39766 6.125 5.57812 6.125H8.42188C8.60234 6.125 8.75 6.27266 8.75 6.45312V6.67188C8.75 6.85234 8.60234 7 8.42188 7H5.57812C5.39766 7 5.25 6.85234 5.25 6.67188V6.45312ZM13.125 0.875H0.875C0.391016 0.875 0 1.26602 0 1.75V3.0625C0 3.30312 0.196875 3.5 0.4375 3.5H13.5625C13.8031 3.5 14 3.30312 14 3.0625V1.75C14 1.26602 13.609 0.875 13.125 0.875Z" fill="#ECEFF3"/>
                                </svg>    
                            <a href="#" className="nav-link nav-link-4 py-3">Le temps</a>
                        </div>
                        <div className="d-flex align-items-center">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="icon5" d="M0.875 12.25C0.875 12.734 1.26602 13.125 1.75 13.125H12.25C12.734 13.125 13.125 12.734 13.125 12.25V4.375H0.875V12.25ZM5.25 6.45312C5.25 6.27266 5.39766 6.125 5.57812 6.125H8.42188C8.60234 6.125 8.75 6.27266 8.75 6.45312V6.67188C8.75 6.85234 8.60234 7 8.42188 7H5.57812C5.39766 7 5.25 6.85234 5.25 6.67188V6.45312ZM13.125 0.875H0.875C0.391016 0.875 0 1.26602 0 1.75V3.0625C0 3.30312 0.196875 3.5 0.4375 3.5H13.5625C13.8031 3.5 14 3.30312 14 3.0625V1.75C14 1.26602 13.609 0.875 13.125 0.875Z" fill="#ECEFF3"/>
                                </svg>                
                            <a href="#" className="nav-link nav-link-5 py-3">Archiver</a>
                        </div>
                        <div className="d-flex align-items-center">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="icon6" d="M13.3438 9.59766H0.65625C0.292578 9.59766 0 9.89023 0 10.2539V12.4414C0 12.8051 0.292578 13.0977 0.65625 13.0977H13.3438C13.7074 13.0977 14 12.8051 14 12.4414V10.2539C14 9.89023 13.7074 9.59766 13.3438 9.59766ZM12.6875 11.7852H7.90234V10.9102H12.6875V11.7852ZM13.3438 5.22266H0.65625C0.292578 5.22266 0 5.51523 0 5.87891V8.06641C0 8.43008 0.292578 8.72266 0.65625 8.72266H13.3438C13.7074 8.72266 14 8.43008 14 8.06641V5.87891C14 5.51523 13.7074 5.22266 13.3438 5.22266ZM12.6875 7.41016H4.40234V6.53516H12.6875V7.41016ZM13.3438 0.847656H0.65625C0.292578 0.847656 0 1.14023 0 1.50391V3.69141C0 4.05508 0.292578 4.34766 0.65625 4.34766H13.3438C13.7074 4.34766 14 4.05508 14 3.69141V1.50391C14 1.14023 13.7074 0.847656 13.3438 0.847656ZM12.6875 3.03516H9.65234V2.16016H12.6875V3.03516Z" fill="#ECEFF3"/>
                                </svg>
                            <a href="#" className="nav-link nav-link-6 py-3">Documents</a>
                        </div>
                        <div className="d-flex align-items-center">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="icon7" d="M13.3438 9.59766H0.65625C0.292578 9.59766 0 9.89023 0 10.2539V12.4414C0 12.8051 0.292578 13.0977 0.65625 13.0977H13.3438C13.7074 13.0977 14 12.8051 14 12.4414V10.2539C14 9.89023 13.7074 9.59766 13.3438 9.59766ZM12.6875 11.7852H7.90234V10.9102H12.6875V11.7852ZM13.3438 5.22266H0.65625C0.292578 5.22266 0 5.51523 0 5.87891V8.06641C0 8.43008 0.292578 8.72266 0.65625 8.72266H13.3438C13.7074 8.72266 14 8.43008 14 8.06641V5.87891C14 5.51523 13.7074 5.22266 13.3438 5.22266ZM12.6875 7.41016H4.40234V6.53516H12.6875V7.41016ZM13.3438 0.847656H0.65625C0.292578 0.847656 0 1.14023 0 1.50391V3.69141C0 4.05508 0.292578 4.34766 0.65625 4.34766H13.3438C13.7074 4.34766 14 4.05508 14 3.69141V1.50391C14 1.14023 13.7074 0.847656 13.3438 0.847656ZM12.6875 3.03516H9.65234V2.16016H12.6875V3.03516Z" fill="#ECEFF3"/>
                                </svg>
                            <a href="#" className="nav-link nav-link-7 py-3">Parametres</a>
                        </div>
                        
                        </div>

                        <div className="nav-footer mt-auto d-flex">
                            <img src="../src/images/copyrights.svg" alt=""/>
                            <p className="my-0 mx-2" style={{fontWeight: 500, color: "#25283D"}}> &copy; AlbaSolutions 2021</p>
                        </div>
                        
                    </div>
                </SideBar> */}
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
                                    this.setState({username: e.target.value})
                                }} />
                                <Form.Label className="formLabel">{this.state.username === '' ? 'Email' : ''}</Form.Label>
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
                                <Form.Text className="text-danger">{this.state.loginStatus}</Form.Text>
                        
                            </Form.Group>
                            <Form.Group className="d-flex justify-content-between mt-5">
                                <Form.Check type="checkbox" checked={isChecked} onChange={this.onChangeCheckbox} label="Se souvenir de moi" />
                                <Form.Label style={{color: "#B84257", cursor: "pointer"}} onClick={() => window.location.href = "/forgot"}>Mot de passe oublié</Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Button 
                                variant="danger" 
                                className="w-100" 
                                style={{backgroundColor: "#B84257"}}
                                onClick={login}
                                >
                                    Se connecter
                                </Button>
                            </Form.Group>
                        </Form>
                        <a href="/register">Vous n'avez pas de compte? Inscrivez-vous ici</a>
                    </div>
                </div>


                
            </Auxiliary>
            </Router>
        );
    }
}

export default LogIn;