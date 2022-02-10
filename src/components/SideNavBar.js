import React, { Component } from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import { BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import logo from '../images/logo-white.svg';

import LogIn from '../containers/LogIn';
import Projects from '../containers/Projects';
import Clients from '../containers/Clients';
import Calendar from '../containers/Calendar';
import Archive from '../containers/Archive';
import ProjectDetails from '../containers/ProjectDetails';
import Settings from '../containers/Settings';
import ForgotPassword from '../containers/ForgotPassword';
import ResetPassword from '../containers/ResetPassword';
import EmailReset from '../containers/EmailAfterReset';
import Weather from '../containers/Weather';
import Register from '../containers/Register';

class SideNavBar extends Component {
    state = {
        loginStatus: "0"
    }

    componentDidMount(){
        if(localStorage.getItem('loginToken')){
            this.setState({loginStatus: "1"});
        }

    }

    logout = () => {
        localStorage.removeItem("loginToken");
        //this.props.history.push('/');
        window.location.href = '/';
    }

    render() {

        var userType = localStorage.getItem('roleUser');

        return (
            <Router>
                <Route render={({ location, history }) => (
                    <React.Fragment>
                        <Navbar collapseOnSelect expand="lg" variant="dark" className="mobile-nav" style={this.state.loginStatus === "0" ? {display: "none"} : {display: "flex"}}>
                            <Navbar.Brand href="#home" className="logo">
                                <img src={logo} alt="logo" />
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="mx-auto text-center">
                                <Nav.Link href="/calendar">Calendrier</Nav.Link> 
                                {userType === 'ADMIN' && <Nav.Link href="/projects">Projets</Nav.Link> }
                                {userType === 'ADMIN' && <Nav.Link href="/clients">Clients</Nav.Link> }
                                <Nav.Link href="/weather">La météo</Nav.Link>
                                {userType === 'ADMIN' && <Nav.Link href="/archive">Documents</Nav.Link> }
                                <Nav.Link href="/settings">Paramètres</Nav.Link>
                                <Nav.Link>
                                    <button className="btn" style={{color: 'rgba(255,255,255,.5)'}} onClick={this.logout}>Logout</button>
                                </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                            </Navbar>
                        <SideNav
                            className="sideNavigation"
                            style={this.state.loginStatus === "0" ? {display: "none"} : {backgroundColor: "#B84257", display: "block"}}
                            defaultExpanded
                            onSelect={(selected) => {
                                const to = '/' + selected;
                                if (location.pathname !== to) {
                                    history.push(to);
                                }
                            }}
                        >
                                <NavItem>
                                    <img src={logo} alt="logo" style={{ width: 78 + "px"}} className="m-4" />
                                </NavItem>
                            <SideNav.Toggle style={{display: "none"}} />
                            <SideNav.Nav defaultSelected="calendar" style={{height: 100 + "%", paddingTop: 30 + "%", display: "flex", flexDirection: "column"}}>
                                <NavItem eventKey="calendar">
                                    <NavIcon>
                                        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="icon1" d="M0 11.6875C0 12.4121 0.671875 13 1.5 13H12.5C13.3281 13 14 12.4121 14 11.6875V5.25H0V11.6875ZM2 7.4375C2 7.19688 2.225 7 2.5 7H5.5C5.775 7 6 7.19688 6 7.4375V10.0625C6 10.3031 5.775 10.5 5.5 10.5H2.5C2.225 10.5 2 10.3031 2 10.0625V7.4375ZM12.5 1.75H11V0.4375C11 0.196875 10.775 0 10.5 0H9.5C9.225 0 9 0.196875 9 0.4375V1.75H5V0.4375C5 0.196875 4.775 0 4.5 0H3.5C3.225 0 3 0.196875 3 0.4375V1.75H1.5C0.671875 1.75 0 2.33789 0 3.0625V4.375H14V3.0625C14 2.33789 13.3281 1.75 12.5 1.75Z" fill="#ECEFF3"/>
                                        </svg>
                                    </NavIcon>
                                    <NavText>
                                    Calendrier
                                    </NavText>
                                </NavItem>

                                <NavItem eventKey="projects">
                                    <NavIcon>
                                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="icon2" d="M2.1 4.8125C2.87219 4.8125 3.5 4.1959 3.5 3.4375C3.5 2.6791 2.87219 2.0625 2.1 2.0625C1.32781 2.0625 0.7 2.6791 0.7 3.4375C0.7 4.1959 1.32781 4.8125 2.1 4.8125ZM11.9 4.8125C12.6722 4.8125 13.3 4.1959 13.3 3.4375C13.3 2.6791 12.6722 2.0625 11.9 2.0625C11.1278 2.0625 10.5 2.6791 10.5 3.4375C10.5 4.1959 11.1278 4.8125 11.9 4.8125ZM12.6 5.5H11.2C10.815 5.5 10.4672 5.65254 10.2134 5.89961C11.095 6.37441 11.7206 7.23164 11.8562 8.25H13.3C13.6872 8.25 14 7.94277 14 7.5625V6.875C14 6.1166 13.3722 5.5 12.6 5.5ZM7 5.5C8.35406 5.5 9.45 4.42363 9.45 3.09375C9.45 1.76387 8.35406 0.6875 7 0.6875C5.64594 0.6875 4.55 1.76387 4.55 3.09375C4.55 4.42363 5.64594 5.5 7 5.5ZM8.68 6.1875H8.49844C8.04344 6.40234 7.53813 6.53125 7 6.53125C6.46187 6.53125 5.95875 6.40234 5.50156 6.1875H5.32C3.92875 6.1875 2.8 7.29609 2.8 8.6625V9.28125C2.8 9.85059 3.27031 10.3125 3.85 10.3125H10.15C10.7297 10.3125 11.2 9.85059 11.2 9.28125V8.6625C11.2 7.29609 10.0712 6.1875 8.68 6.1875ZM3.78656 5.89961C3.53281 5.65254 3.185 5.5 2.8 5.5H1.4C0.627813 5.5 0 6.1166 0 6.875V7.5625C0 7.94277 0.312812 8.25 0.7 8.25H2.14156C2.27938 7.23164 2.905 6.37441 3.78656 5.89961Z" fill="#ECEFF3"/>
                                        </svg> 
                                    </NavIcon>
                                    <NavText>
                                        Projets
                                    </NavText>
                                </NavItem>

                                {userType === 'ADMIN' &&

                                <NavItem eventKey="clients">
                                    <NavIcon>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="icon3" d="M8.75 9.1875C8.75 9.42922 8.55422 9.625 8.3125 9.625H5.6875C5.44578 9.625 5.25 9.42922 5.25 9.1875V7.875H0V11.8125C0 12.5125 0.6125 13.125 1.3125 13.125H12.6875C13.3875 13.125 14 12.5125 14 11.8125V7.875H8.75V9.1875ZM12.6875 3.5H10.5V2.1875C10.5 1.4875 9.8875 0.875 9.1875 0.875H4.8125C4.1125 0.875 3.5 1.4875 3.5 2.1875V3.5H1.3125C0.6125 3.5 0 4.1125 0 4.8125V7H14V4.8125C14 4.1125 13.3875 3.5 12.6875 3.5ZM8.75 3.5H5.25V2.625H8.75V3.5Z" fill="#ECEFF3"/>
                                        </svg> 
                                    </NavIcon>
                                    <NavText>
                                        Clients
                                    </NavText>
                                </NavItem>

                                }

                                <NavItem eventKey="weather">
                                    <NavIcon>
                                        <i className="fas fa-archive"></i> 
                                    </NavIcon>
                                    <NavText>
                                    La météo
                                    </NavText>
                                </NavItem>

                                {userType === 'ADMIN' &&

                                <NavItem eventKey="archive">
                                    <NavIcon>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="icon7" d="M13.3438 9.59766H0.65625C0.292578 9.59766 0 9.89023 0 10.2539V12.4414C0 12.8051 0.292578 13.0977 0.65625 13.0977H13.3438C13.7074 13.0977 14 12.8051 14 12.4414V10.2539C14 9.89023 13.7074 9.59766 13.3438 9.59766ZM12.6875 11.7852H7.90234V10.9102H12.6875V11.7852ZM13.3438 5.22266H0.65625C0.292578 5.22266 0 5.51523 0 5.87891V8.06641C0 8.43008 0.292578 8.72266 0.65625 8.72266H13.3438C13.7074 8.72266 14 8.43008 14 8.06641V5.87891C14 5.51523 13.7074 5.22266 13.3438 5.22266ZM12.6875 7.41016H4.40234V6.53516H12.6875V7.41016ZM13.3438 0.847656H0.65625C0.292578 0.847656 0 1.14023 0 1.50391V3.69141C0 4.05508 0.292578 4.34766 0.65625 4.34766H13.3438C13.7074 4.34766 14 4.05508 14 3.69141V1.50391C14 1.14023 13.7074 0.847656 13.3438 0.847656ZM12.6875 3.03516H9.65234V2.16016H12.6875V3.03516Z" fill="#ECEFF3"/>
                                        </svg> 
                                    </NavIcon>
                                    <NavText>
                                        Documents
                                    </NavText>
                                </NavItem>

                                }
                                
                                <NavItem eventKey="settings">
                                    <NavIcon>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="icon7" d="M13.3438 9.59766H0.65625C0.292578 9.59766 0 9.89023 0 10.2539V12.4414C0 12.8051 0.292578 13.0977 0.65625 13.0977H13.3438C13.7074 13.0977 14 12.8051 14 12.4414V10.2539C14 9.89023 13.7074 9.59766 13.3438 9.59766ZM12.6875 11.7852H7.90234V10.9102H12.6875V11.7852ZM13.3438 5.22266H0.65625C0.292578 5.22266 0 5.51523 0 5.87891V8.06641C0 8.43008 0.292578 8.72266 0.65625 8.72266H13.3438C13.7074 8.72266 14 8.43008 14 8.06641V5.87891C14 5.51523 13.7074 5.22266 13.3438 5.22266ZM12.6875 7.41016H4.40234V6.53516H12.6875V7.41016ZM13.3438 0.847656H0.65625C0.292578 0.847656 0 1.14023 0 1.50391V3.69141C0 4.05508 0.292578 4.34766 0.65625 4.34766H13.3438C13.7074 4.34766 14 4.05508 14 3.69141V1.50391C14 1.14023 13.7074 0.847656 13.3438 0.847656ZM12.6875 3.03516H9.65234V2.16016H12.6875V3.03516Z" fill="#ECEFF3"/>
                                        </svg> 
                                    </NavIcon>
                                    <NavText>
                                    Paramètres
                                    </NavText>
                                </NavItem>
                                <NavItem className="mt-auto mb-4" disabled>
                                    <NavIcon>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 0C3.134 0 0 3.134 0 7C0 10.866 3.134 14 7 14C10.866 14 14 10.866 14 7C14 3.134 10.866 0 7 0ZM10.3062 9.78738C10.2613 9.84008 9.18349 11.0782 7.20557 11.0782C4.81507 11.0782 3.12739 9.29261 3.12739 6.96943C3.12739 4.67459 4.8775 2.92182 7.18519 2.92182C9.0751 2.92182 10.0632 3.97507 10.1044 4.01992C10.155 4.07515 10.186 4.14564 10.1923 4.22033C10.1986 4.29502 10.18 4.3697 10.1393 4.43267L9.50761 5.41083C9.39332 5.58772 9.14705 5.61832 8.99294 5.47561C8.98636 5.46957 8.24414 4.80158 7.24633 4.80158C5.94466 4.80158 5.15999 5.74926 5.15999 6.94905C5.15999 8.06685 5.88014 9.19842 7.25652 9.19842C8.34877 9.19842 9.0991 8.39856 9.10655 8.39046C9.2514 8.23338 9.50338 8.2484 9.62895 8.42018L10.3218 9.36778C10.3668 9.42928 10.3897 9.50415 10.3869 9.58029C10.384 9.65643 10.3556 9.72939 10.3062 9.78738Z" fill="#ECEFF3"/>
                                        </svg>
                                    </NavIcon>
                                    <NavText>
                                    AlbaSolutions 2021
                                    </NavText>
                                </NavItem>
                            </SideNav.Nav>
                            
                        </SideNav>
                        <main>
                            <Route path="/" exact render={(props) => {
                                if(this.state.loginStatus === "1"){
                                    return <Calendar />
                                }
                                else{
                                    return <LogIn />
                                }
                            }} />
                            <Switch>
                                <Route path="/projects" component={Projects} />
                                <Route path="/clients" component={Clients} />
                                <Route path="/calendar" component={Calendar} />
                                <Route path="/archive" component={Archive} />
                                <Route path="/weather" component={Weather} />
                                <Route exact path="/project/:id" component={ProjectDetails} />
                                <Route exact path="/settings" component={Settings} />
                                <Route path="/forgot" component={ForgotPassword} />
                                <Route path="/reset/:token" component={ResetPassword} />
                                <Route path="/email-reset" component={EmailReset} />
                                <Route path="/register" component={Register} />
                            </Switch>
                        </main>
                    </React.Fragment>
                )}
                />
            </Router>
        );
    }
}

export default SideNavBar;