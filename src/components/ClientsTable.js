import React, { Component } from "react";
import { Table, Modal } from 'react-bootstrap';
import Axios from 'axios';
import qs from 'qs';
import Auxiliary from '../hoc/Auxiliary';
import { withRouter } from 'react-router-dom';


class ClientsTable extends Component {

    state = {
        clients: [],
        first_name: "",
        last_name: "",
        company: "",
        department: "",
        email: "",
        phone: "",
        address: "",
        id: "",
        password: "",
        showDeleteModal: false,
        showModal: false,
        client_projects: [] 
    }


    componentDidMount(){
        Axios.get("http://192.168.100.232:3001/clients").then((response) => {
            this.setState({clients: response.data});
            console.log(response.data);
        }  
        );

    }

    showModal = () => {
        this.setState({ showModal: true });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    showDeleteModal = (id) => {
        this.setState({ 
            showDeleteModal: true, 
            id: id
        });
        console.log(this.state.id);
    };

    hideDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    };

    onDeleteClient = (e) => {
        e.preventDefault();
        // Axios.delete("http://localhost:3001/delete-project" , {
        //     id: 338
        // }).then(response => {
        //     console.log(response);
        // })
        // .catch(error => {
        //     console.log(error);
        // });
        var data = qs.stringify({
            'id': this.state.id
            });
            var config = {
                method: 'delete',
                url: 'http://192.168.100.232:3001/delete-client',
                headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
            };
            Axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
        this.hideDeleteModal();
        this.props.history.push('/');
    }

    onUpdate = (e) => {
        e.preventDefault();

        var data = qs.stringify({
        'id': this.state.id,
        'email': this.state.email,
        'password': this.state.password,
        'first_name': this.state.first_name,
        'last_name': this.state.last_name,
        'numero_Tel': this.state.phone,
        'entreprise_name': this.state.company,
        'dep_Ref': this.state.department,
        'address': this.state.address, 
        });
        var config = {
          method: 'put',
          url: 'http://192.168.100.232:3001/update-client',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data
        };
        
        Axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
            console.log(error);
            });
        this.hideModal();
        this.props.history.push("/");
    }


    getClientProjects = () => {
        //console.log(this.state.company);
        var config = {
          method: 'get',
          url: `http://192.168.100.232:3001/client-projects/${this.state.company}`,
          headers: { },
          data : ""
        };
        Axios(config)
        .then((response) => {
        this.setState({client_projects: response.data});
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });  

           
    }

    viewDetails = (id) => {
        document.querySelector('.client-details').style.display = "block";
        document.querySelector('.client-details').style.maxWidth = "20%";

        this.state.clients.map( client => {
            if(client.id === id){
                this.setState({
                    id: client.id,
                    first_name: client.first_name,
                    last_name: client.last_name,
                    company: client.entreprise_name,
                    department: client.dep_Ref,
                    email: client.email,
                    phone: client.numero_Tel,
                    password: client.password,
                    address: client.address
                });
            }
        })

        console.log(this.state.id);
        console.log(this.state.client_projects);
    }


    render(){

        
    return (<Auxiliary>
            <Modal show={this.state.showModal} onHide={this.hideModal}>
                <Modal.Header className="bg-light">
                    <h4><span style={{color: "#B84257", fontWeight: 700}}>+</span> Modifier fiche client</h4>
                </Modal.Header>
                <Modal.Body>
                <div className="modalContainer px-4">
                    <p style={{color: "#B84257", fontWeight: 600}}>Détails</p>
                    <form>
                        <fieldset className="step step-1">
                                <div className="row pt-4">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="company" placeholder="" value={this.state.company} onChange={(e) => this.setState({company: e.target.value})} />
                                            <label htmlFor="company" className="formLabel">{this.state.company === '' ? "Nom de la compagnie" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="name" placeholder="" value={this.state.first_name}  onChange={(e) => this.setState({first_name: e.target.value})} />
                                            <label htmlFor="name" className="formLabel">{this.state.first_name === '' ? "Nom" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="email" className="form-control formControl bg-light border-0" id="email" placeholder="" value={this.state.email}  onChange={(e) => this.setState({email: e.target.value})} />
                                            <label htmlFor="email" className="formLabel">{this.state.email === '' ? "Email" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="adress" placeholder="" value={this.state.address}  onChange={(e) => this.setState({address: e.target.value})} />
                                            <label htmlFor="adress" className="formLabel">{this.state.address === '' ? "Adresse" : ''}</label>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="department" placeholder="" value={this.state.department}  onChange={(e) => this.setState({department: e.target.value})} />
                                            <label htmlFor="department" className="formLabel">{this.state.department === '' ? "Référence du département" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="Surname" placeholder="" value={this.state.last_name}  onChange={(e) => this.setState({last_name: e.target.value})} />
                                            <label htmlFor="surname" className="formLabel">{this.state.last_name === '' ? "Nom de famille" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="phone" placeholder="" value={this.state.phone} onChange={(e) => this.setState({phone: e.target.value})} />
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
                    <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.onUpdate}>Valider</button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteModal} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le Client</h5>
                        <p>Êtes-vous sûr de vouloir supprimer ce client?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModal}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} onClick={this.onDeleteClient}>Oui</button>
                        </div>
                    </Modal.Body>
            </Modal>
            <div className="w-100 m-0 mw-100">
                <div className="row rowmob">
                    <div className="col client-details">
                        <div className="card rounded-3 border-0 p-0" style={{height: 'auto'}}>
                            <div className="card-header bg-white d-flex justify-content-between" style={{borderColor: "#F5F6F8"}}>
                                <p className="m-0" style={{color:" #5C677B", fontWeight: 600}}>{this.state.first_name} {this.state.last_name}</p>
                                <p 
                                className="m-0" 
                                style={{cursor: 'pointer', color: "#347CFF", fontWeight: 500, textDecoration: 'none'}}
                                onClick={this.showModal}>
                                Modifier
                            </p>
                            </div>
                            <div className="card-body">
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p style={{color: "#5C677B"}}>Nom de la compagnie</p>
                                    <p className="text-right" style={{color: "#2D527C", fontWeight: 500, overflow: 'hidden'}}>{this.state.company}</p>
                                </div>
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p style={{color: "#5C677B"}}>Référence</p>
                                    <p style={{color: "#2D527C", fontWeight: 500}}>{this.state.department}</p>
                                </div>
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p style={{color: "#5C677B"}}>Email</p>
                                    <p className="text-right" style={{color: "#2D527C", fontWeight: 500, overflow: 'hidden'}}>{this.state.email}</p>
                                </div>
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p className="m-0" style={{color: "#5C677B"}}>Téléphone</p>
                                    <p className="m-0" style={{color: "#2D527C", fontWeight: 500}}>{this.state.phone}</p>
                                </div>
                                <div className="card-item d-flex flex-column justify-content-between align-items-center">
                                    <p className="m-0" style={{color: "#5C677B"}}>Projets</p>
                                    {this.state.client_projects && this.state.client_projects.map(project => {
                                        return(<p className="m-0" key={project.nom} style={{color: "#2D527C", fontWeight: 500}}>{project.nom}</p>);
                                    })}
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="col clients-table">
                        <Table borderless>
                            <thead className="bg-transparent text-secondary">
                                <tr className="table-head">
                                    <th scope="col" className="py-3" data-column="id" data-order="desc">No. </th>
                                    <th scope="col" className="py-3" data-column="last_name" data-order="desc">Prénom</th>
                                    <th scope="col" className="py-3" data-column="first_name" data-order="desc">Nom</th>
                                    <th scope="col" className="py-3" data-column="address" data-order="desc">Adresse</th>
                                    <th scope="col" className="py-3 px-2 " data-column="date_joined" data-order="desc">Date</th>
                                    <th scope="col" className="py-3" data-column="email" data-order="desc">Email</th>
                                    <th scope="col" className="py-3 px-1 " data-column="entreprise_name" data-order="desc">Enterprise</th>
                                    <th scope="col" className="text-center py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                            {this.props.clientsList.map(client => (
                                <tr key={client.id} onClick={() => this.setState({id: client.id})}>
                                    <td className="p-3">{client.id}</td>
                                    <td className="py-3">{client.last_name}</td>
                                    <td className="py-3">{client.first_name}</td>
                                    <td className="py-3">{client.address}</td>
                                    <td className="py-3">{client.date_joined.split("-").join("/").slice(0, 10)}</td>
                                    <td className="py-3">{client.email}</td>
                                    <td className="py-3">{client.entreprise_name}</td>
                                    <td className="py-3 px-0 text-center actions">

                                        <button className="btn p-0" onClick={() => this.viewDetails(client.id)}>
                                            <svg className="mx-1"  width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className="view" d="M17.8912 5.54375C16.1965 2.23719 12.8415 0 8.99998 0C5.15842 0 1.80248 2.23875 0.108733 5.54406C0.037246 5.68547 0 5.8417 0 6.00016C0 6.15861 0.037246 6.31484 0.108733 6.45625C1.80342 9.76281 5.15842 12 8.99998 12C12.8415 12 16.1975 9.76125 17.8912 6.45594C17.9627 6.31453 18 6.1583 18 5.99984C18 5.84139 17.9627 5.68516 17.8912 5.54375ZM8.99998 10.5C8.10997 10.5 7.23994 10.2361 6.49992 9.74161C5.7599 9.24715 5.18312 8.54434 4.84253 7.72208C4.50193 6.89981 4.41282 5.99501 4.58645 5.12209C4.76008 4.24918 5.18867 3.44736 5.818 2.81802C6.44734 2.18868 7.24916 1.7601 8.12208 1.58647C8.99499 1.41283 9.89979 1.50195 10.7221 1.84254C11.5443 2.18314 12.2471 2.75991 12.7416 3.49993C13.2361 4.23995 13.5 5.10998 13.5 6C13.5003 6.59103 13.3841 7.17632 13.158 7.72242C12.932 8.26851 12.6005 8.7647 12.1826 9.18262C11.7647 9.60054 11.2685 9.932 10.7224 10.158C10.1763 10.3841 9.59101 10.5003 8.99998 10.5ZM8.99998 3C8.73221 3.00374 8.46617 3.04358 8.20905 3.11844C8.42099 3.40646 8.5227 3.7609 8.49572 4.11748C8.46875 4.47406 8.31487 4.80917 8.06201 5.06203C7.80915 5.31489 7.47405 5.46876 7.11747 5.49574C6.76088 5.52271 6.40644 5.42101 6.11842 5.20906C5.95441 5.81331 5.98402 6.45377 6.20307 7.04031C6.42213 7.62685 6.8196 8.12993 7.33955 8.47874C7.8595 8.82754 8.47574 9.00452 9.10153 8.98475C9.72733 8.96498 10.3312 8.74946 10.8281 8.36853C11.325 7.9876 11.6899 7.46044 11.8715 6.86125C12.0531 6.26205 12.0422 5.62099 11.8404 5.0283C11.6386 4.43561 11.256 3.92114 10.7464 3.55728C10.2369 3.19343 9.62609 2.99853 8.99998 3Z" fill="#ECEFF3"/>
                                            </svg>
                                        </button>
                                        
                                        <button className="btn p-0" onClick={this.getClientProjects}>
                                            <svg className="mx-1" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className="edit" d="M12.5813 2.60069L15.4 5.41943C15.5187 5.53818 15.5187 5.73193 15.4 5.85068L8.575 12.6757L5.675 12.9975C5.2875 13.0413 4.95938 12.7132 5.00313 12.3257L5.325 9.42568L12.15 2.60069C12.2687 2.48194 12.4625 2.48194 12.5813 2.60069ZM17.6437 1.88506L16.1187 0.360064C15.6437 -0.114935 14.8719 -0.114935 14.3938 0.360064L13.2875 1.46631C13.1688 1.58506 13.1688 1.77881 13.2875 1.89756L16.1063 4.71631C16.225 4.83506 16.4188 4.83506 16.5375 4.71631L17.6437 3.61006C18.1187 3.13193 18.1187 2.36006 17.6437 1.88506ZM12 10.8194V14.0007H2V4.00068H9.18125C9.28125 4.00068 9.375 3.96006 9.44687 3.89131L10.6969 2.64131C10.9344 2.40381 10.7656 2.00069 10.4312 2.00069H1.5C0.671875 2.00069 0 2.67256 0 3.50068V14.5007C0 15.3288 0.671875 16.0007 1.5 16.0007H12.5C13.3281 16.0007 14 15.3288 14 14.5007V9.56942C14 9.23505 13.5969 9.06943 13.3594 9.3038L12.1094 10.5538C12.0406 10.6257 12 10.7194 12 10.8194Z" fill="#ECEFF3"/>
                                            </svg>
                                        </button>
                                        
                                        <button className="btn p-0" onClick={() => this.showDeleteModal(client.id)}>
                                            <svg className="mx-1" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className="delete" d="M1 14.4998C1 14.8976 1.15804 15.2792 1.43934 15.5605C1.72064 15.8418 2.10218 15.9998 2.5 15.9998H11.5C11.8978 15.9998 12.2794 15.8418 12.5607 15.5605C12.842 15.2792 13 14.8976 13 14.4998V3.99982H1V14.4998ZM9.5 6.49982C9.5 6.36721 9.55268 6.24004 9.64645 6.14627C9.74021 6.0525 9.86739 5.99982 10 5.99982C10.1326 5.99982 10.2598 6.0525 10.3536 6.14627C10.4473 6.24004 10.5 6.36721 10.5 6.49982V13.4998C10.5 13.6324 10.4473 13.7596 10.3536 13.8534C10.2598 13.9471 10.1326 13.9998 10 13.9998C9.86739 13.9998 9.74021 13.9471 9.64645 13.8534C9.55268 13.7596 9.5 13.6324 9.5 13.4998V6.49982ZM6.5 6.49982C6.5 6.36721 6.55268 6.24004 6.64645 6.14627C6.74021 6.0525 6.86739 5.99982 7 5.99982C7.13261 5.99982 7.25979 6.0525 7.35355 6.14627C7.44732 6.24004 7.5 6.36721 7.5 6.49982V13.4998C7.5 13.6324 7.44732 13.7596 7.35355 13.8534C7.25979 13.9471 7.13261 13.9998 7 13.9998C6.86739 13.9998 6.74021 13.9471 6.64645 13.8534C6.55268 13.7596 6.5 13.6324 6.5 13.4998V6.49982ZM3.5 6.49982C3.5 6.36721 3.55268 6.24004 3.64645 6.14627C3.74021 6.0525 3.86739 5.99982 4 5.99982C4.13261 5.99982 4.25979 6.0525 4.35355 6.14627C4.44732 6.24004 4.5 6.36721 4.5 6.49982V13.4998C4.5 13.6324 4.44732 13.7596 4.35355 13.8534C4.25979 13.9471 4.13261 13.9998 4 13.9998C3.86739 13.9998 3.74021 13.9471 3.64645 13.8534C3.55268 13.7596 3.5 13.6324 3.5 13.4998V6.49982ZM13.5 0.999822H9.75L9.45625 0.415447C9.39402 0.290514 9.29817 0.185423 9.17947 0.111997C9.06078 0.0385706 8.92395 -0.000277729 8.78438 -0.000177626H5.2125C5.07324 -0.000712956 4.93665 0.0379905 4.81838 0.111498C4.7001 0.185006 4.60492 0.290346 4.54375 0.415447L4.25 0.999822H0.5C0.367392 0.999822 0.240215 1.0525 0.146447 1.14627C0.0526784 1.24004 0 1.36721 0 1.49982L0 2.49982C0 2.63243 0.0526784 2.75961 0.146447 2.85338C0.240215 2.94714 0.367392 2.99982 0.5 2.99982H13.5C13.6326 2.99982 13.7598 2.94714 13.8536 2.85338C13.9473 2.75961 14 2.63243 14 2.49982V1.49982C14 1.36721 13.9473 1.24004 13.8536 1.14627C13.7598 1.0525 13.6326 0.999822 13.5 0.999822Z" fill="#ECEFF3"/>
                                            </svg>  
                                        </button>
                                    </td>
                                </tr>
                            ))}   
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            </Auxiliary>
    )
    }
}

export default withRouter (ClientsTable);