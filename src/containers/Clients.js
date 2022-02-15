import React, { Component } from 'react';
import Auxiliary from '../hoc/Auxiliary';
import Axios from 'axios';
import './Clients.css';
import ClientsTable from '../components/ClientsTable';
import Pagination from '../components/Pagination';

import { Dropdown, Modal } from 'react-bootstrap';

class Clients extends Component {

    state = { 
        clientsList: [],
        currentPage: 1,
        clientsPerPage: 7,
        pageNo: 7,
        currentPageFilter: 1,
        clientsPerPageFilter: 7,
        pageNoFilter: 7,
        first_name: "",
        last_name: "",
        showModal: false,
        showDeleteModal: false,
        company: "",
        name: "",
        email: "",
        address: "",
        department: "",
        surname: "",
        phone: "",
        password: "",
        passwordConf: "",
        searchTerm: ""
    }


    componentDidMount(){
        var loginToken = localStorage.getItem('loginToken');
        if (!loginToken){
            this.props.history.push('/');
        }

        this.getClients();

        Axios.get("https://frozen-temple-16675.herokuapp.com/users").then((response) => {
            // console.log(response.data);
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
    }

    logout = () => {
        localStorage.removeItem("loginToken");
        //this.props.history.push('/');
        window.location.href = '/';
    }

    getClients = () => {
        Axios.get("https://frozen-temple-16675.herokuapp.com/clients").then((response) => {
            this.setState({clientsList: response.data});
            // setProjectsList(response.data);
            //setShow(!show);  
            // console.log(response.data);
        }  
        );
    };    

    showModal = () => {
        this.setState({ showModal: true });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };


    onSubmit = (e) => {
        e.preventDefault();
        const addClient = Axios.post("https://frozen-temple-16675.herokuapp.com/add-client", {
            email: this.state.email,
            password: this.state.password,
            first_name: this.state.name,
            last_name: this.state.surname,
            numero_Tel: this.state.phone,
            entreprise_name: this.state.company,
            dep_Ref: this.state.company,
            address: this.state.address
        });
        const registerClient = Axios.post("https://frozen-temple-16675.herokuapp.com/register",{
            email: this.state.email,
            password: this.state.password,
            first_name: this.state.name,
            last_name: this.state.surname,
            user_type: 0
        });
        Axios.all([addClient, registerClient]).then(Axios.spread((...responses) => {
            // use/access the results 
          })).catch(errors => {
            // react on errors.
          })
        this.hideModal();
        this.props.history.push('/');
    }


    render() {

        const indexOfLastClient = this.state.currentPage * this.state.clientsPerPage;
        const indexOfFirstClient = indexOfLastClient - this.state.clientsPerPage;
        const filteredClients = this.state.clientsList.filter((client) => {
            if(this.state.searchTerm === ""){
                return client;
            }else if(client.first_name !== null && client.first_name.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
                return client;
            }
        });
        const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

        const paginate = (pageNumber) => this.setState({currentPage: pageNumber});


        const nextPage = () => {
            if(this.state.currentPage < Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                this.setState({currentPage: this.state.currentPage + 1});
                if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage) - 1){
                    this.setState({pageNo: this.state.clientsList.length});
                }else{
                    this.setState({pageNo: this.state.pageNo + 7});
                }
            }else{
                return null;
            }
        }

        const prevPage = () => {
            if(this.state.currentPage > 1){
                this.setState({currentPage: this.state.currentPage - 1, pageNo: this.state.pageNo - currentClients.length});
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            }else{
                return null;
            }
        }

        const indexOfLastClientFilter = this.state.currentPageFilter * this.state.clientsPerPageFilter;
        const indexOfFirstClientFilter = indexOfLastClientFilter - this.state.clientsPerPageFilter;
        const currentClientsFilter = filteredClients.slice(indexOfFirstClientFilter, indexOfLastClientFilter);

        const paginateFilter = (pageNumber) => this.setState({currentPageFilter: pageNumber});

        const nextPageFilter = () => {
            if(this.state.currentPageFilter < Math.ceil(filteredClients.length / this.state.clientsPerPageFilter)){
                this.setState({currentPageFilter: this.state.currentPageFilter + 1});
                if(this.state.currentPageFilter >= Math.ceil(filteredClients.length / this.state.clientsPerPageFilter) - 1){
                    this.setState({pageNoFilter: filteredClients.length});
                }else{
                    this.setState({pageNoFilter: this.state.pageNoFilter + 7});
                }
            }else{
                return null;
            }
        }

        const prevPageFilter = () => {
            if(this.state.currentPageFilter > 1){
                this.setState({currentPageFilter: this.state.currentPageFilter - 1, pageNoFilter: this.state.pageNoFilter - currentClientsFilter.length});
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            }else{
                return null;
            }
        }

        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <a
                href=""
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                >
                {children}
                </a>
            ));

            const labelStyle = {
                position: "absolute",
                top: 3 + "%",
                left: 6 + "%",
                color: "#B84257", 
                fontSize: 11 + "px", 
                fontWeight: 600
            };

        return (
            <Auxiliary>
                <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteModal} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le client</h5>
                        <p>Êtes-vous sûr de vouloir supprimer ce client?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModal}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showModal} onHide={this.hideModal}>
                <Modal.Header className="bg-light">
                    <h4><span style={{color: "#B84257", fontWeight: 700}}>+</span> Ajouter un nouveau client</h4>
                </Modal.Header>
                <Modal.Body>
                <div className="modalContainer px-4">
                    <p style={{color: "#B84257", fontWeight: 600}}>Details</p>
                    <form>
                        <fieldset className="step step-1">
                                <div className="row pt-4">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="company" placeholder="" onChange={(e) => this.setState({company: e.target.value})} />
                                            <label htmlFor="company" className="formLabel">{this.state.company === '' ? "Nom de la compagnie" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="name" placeholder="" onChange={(e) => this.setState({name: e.target.value})} />
                                            <label htmlFor="name" className="formLabel">{this.state.name === '' ? "Nom" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="email" className="form-control formControl bg-light border-0" id="email" placeholder="" onChange={(e) => this.setState({email: e.target.value})} />
                                            <label htmlFor="email" className="formLabel">{this.state.email === '' ? "Email" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="adress" placeholder="" onChange={(e) => this.setState({address: e.target.value})} />
                                            <label htmlFor="adress" className="formLabel">{this.state.address === '' ? "Adresse" : ''}</label>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="department" placeholder="" onChange={(e) => this.setState({department: e.target.value})} />
                                            <label htmlFor="department" className="formLabel">{this.state.department === '' ? "Référence du département" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="Surname" placeholder="" onChange={(e) => this.setState({surname: e.target.value})} />
                                            <label htmlFor="surname" className="formLabel">{this.state.surname === '' ? "Nom de famille" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="phone" placeholder="" onChange={(e) => this.setState({phone: e.target.value})} />
                                            <label htmlFor="phone" className="formLabel">{this.state.phone === '' ? "Téléphone" : ''}</label>
                                        </div>
                                    </div>
                                </div>
                                <hr style={{opacity: 1, backgroundColor: "#F5F6F8"}} />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="password" className="form-control formControl bg-light border-0" id="password" placeholder="" onChange={(e) => this.setState({password: e.target.value})} />
                                            <label htmlFor="password" className="formLabel">{this.state.password === '' ? "Entrez le mot de passe" : ''}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="password" className="form-control formControl bg-light border-0" id="passwordConf" placeholder="" onChange={(e) => this.setState({passwordConf: e.target.value})} />
                                            <label htmlFor="passwordConf" className="formLabel">{this.state.passwordConf === '' ? "Confirmez le mot de passe" : ''}</label>
                                        </div>
                                    </div>
                                </div>
                        </fieldset>
                    </form>
                                {/* <hr style={{opacity: 1, backgroundColor: "#F5F6F8"}} /> */}
                </div>
                </Modal.Body>
                <Modal.Footer style={{justifyContent: "center"}}>
                    <button type="button" className="btn" onClick={this.hideModal}>Annuler</button>
                    <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.onSubmit}>L'étape suivante</button>
                </Modal.Footer>
            </Modal>
                <div className="clientsMain">
                    <div className="container">
                        <div className="row py-4">
                            <div className="col-md-10">
                                <h2>Clients</h2>
                            </div>
                            <div className="col-md-2">
                                <div className="user align-items-center justify-content-between panel" style={{display: 'flex'}}>
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
                    
                        <div className="row py-4">
                            <div className="col-md-12 secrow justify-content-between" style={{display: 'flex'}}>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    style={{backgroundColor: "#B84257", fontWeight: 600, height: 40 + "px"}} 
                                    onClick={this.showModal}>
                                        + Nouveau client
                                    </button>
                                    <div className="form-group w-25 position-relative has-search">
                                        <span className="fa fa-search form-control-feedback"></span>
                                        <input 
                                        type="text" 
                                        className="form-control search border-0" 
                                        placeholder="Chercher..."
                                        onChange={(e) => this.setState({searchTerm: e.target.value})} />
                                    </div>
                                
                            </div>
                        </div>
                        <div className="row py-4">
                            <div className="col-md-6 d-flex">
                                <label className="checkGroup px-4">Tous
                                    <input type="checkbox" defaultChecked/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="checkGroup px-4">Individuel
                                    <input type="checkbox"/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="checkGroup px-4">Entreprise
                                    <input type="checkbox"/>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* <div className="container">
                        <div className="row">
                            <div className="col client-details">
                                <div className="card rounded-3 border-0 p-0" style={{height: '370px'}}>
                                    <div className="card-header bg-white d-flex justify-content-between" style={{borderColor: "#F5F6F8"}}>
                                    <p className="m-0" style={{color:" #5C677B"}}>John Doe</p>
                                    <p 
                                    className="m-0" 
                                    style={{color: "#347CFF", fontWeight: 500, textDecoration: 'none'}}>
                                        Editer
                                    </p>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-item d-flex flex-row justify-content-between">
                                            <p style={{color: "#5C677B"}}>Company Name</p>
                                            <p style={{color: "#2ECC71"}}>Dolor</p>
                                        </div>
                                        <div className="card-item d-flex flex-row justify-content-between">
                                            <p style={{color: "#5C677B"}}>Reference</p>
                                            <p style={{color: "#2D527C"}}>Lorem Ipsum</p>
                                        </div>
                                        <div className="card-item d-flex flex-row justify-content-between">
                                            <p className="m-0" style={{color: "#5C677B"}}>Email</p>
                                            <p className="m-0" style={{color: "#2D527C"}}>johndoe@info.com</p>
                                        </div>
                                        <div className="card-item">
                                        <p 
                                            className="my-5" 
                                            style={{color: "#347CFF", fontWeight: 500, textDecoration: 'none'}}>
                                            Change Password
                                        </p>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div className="col clients-table"> */}
                            {!this.state.searchTerm && 
                            <div className="container">
                                <ClientsTable 
                                    clientsList={currentClients}
                                    deleteClient={this.showDeleteModal}
                                />
                            </div>}

                            {this.state.searchTerm && 
                            <div className="container">
                                <ClientsTable 
                                    clientsList={currentClientsFilter}
                                    deleteClient={this.showDeleteModal}
                                />
                            </div>}
                            {/* </div>
                        </div>
                    </div> */}
                    {!this.state.searchTerm && 
                    <Pagination 
                    clientsPerPage={this.state.clientsPerPage} 
                    totalClients={this.state.clientsList.length} 
                    paginate={paginate}
                    next={nextPage}
                    prev={prevPage}
                    pageNo={this.state.pageNo}
                    style={{position: "fixed", bottom: 0}}
                    />}

                    {this.state.searchTerm &&
                    <Pagination 
                    clientsPerPage={this.state.clientsPerPageFilter} 
                    totalClients={filteredClients.length} 
                    paginate={paginateFilter}
                    next={nextPageFilter}
                    prev={prevPageFilter}
                    pageNo={filteredClients.length < this.state.pageNoFilter ? filteredClients.length : this.state.pageNoFilter}
                    style={{position: "fixed", bottom: 0}}
                    />}

                </div>
            </Auxiliary>
        );
    }
}

export default Clients;