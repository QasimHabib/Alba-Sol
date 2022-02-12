import React, { Component } from 'react';
import './Projects.css';
import Auxiliary from '../hoc/Auxiliary';
import Project from '../components/Project';
import Axios from 'axios';
import { Modal, Dropdown } from 'react-bootstrap';
import Pagination from '../components/Pagination';
//import  { Redirect } from 'react-router-dom';

//import Select, { createFilter } from "react-select";
//import { FixedSizeList as List } from "react-window";

import { AutoSuggest } from "react-autosuggestions";

import { withRouter } from 'react-router-dom';

import { villes } from "./villes.js";
//import { findAllByTestId } from '@testing-library/dom';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
var trigger = true
class Projects extends Component {
     trigger = false
    state = {
        projectsList: [],
        showModal: false,
        showDeleteModal: false,
        totalProjects: 0,
        totalClients: 0,
        currentPage: 1,
        projectsPerPage: 11,
        pageNo: 11,
        currentPageFilter: 1,
        projectsPerPageFilter: 11,
        pageNoFilter: 11,
        currentPageTermine: 1,
        projectsPerPageTermine: 11,
        pageNoTermine: 11,
        currentPageEnCours: 1,
        projectsPerPageEnCours: 11,
        pageNoEnCours: 11,
        currentPageArchive: 1,
        projectsPerPageArchive: 11,
        pageNoArchive: 11,
        currentPageEnfaire: 1,
        projectsPerPageEnFaire: 11,
        pageNoEnFaire: 11,
        currentStep: 1,
        first_name: "",
        last_name: "",
        entreprise_name: "",
        client: "laurent",
        addrPrj: "",
        ville: "",
        nomProjet: "",
        complementAddr: "",
        nomResp: "",
        prenomResp: "",
        numeroResp: "",
        typeProjet: "",
        dateLiv: "ALBA",
        pentes: "",
        surfEstime: "",
        surfRelle: "",
        charges: "",
        volume: "",
        distanceChantier: "",
        addrCentrale: "",
        nomRespCentrale: "",
        numeroContactCentrale: "",
        cailloux: "",
        ciment: "",
        teinte: "",
        sable: "",
        particularites: "",
        accesChantier: [],
        preparationProjet: [],
        planProjet: [],
        vitre: 0,
        plante: 0,
        revetements: 0,
        facade: 0,
        vegetation: 0,
        pompe: 0,
        tapis: 0,
        direct: 0,
        dumper300: 0,
        dumper500: 0,
        dumper800: 0,
        brouette: 0,
        showAllProjects: true,
        showEnCoursProjects: false,
        showTermineProjects: false,
        showArchiveProjects: false,
        showTerminePagination: false,
        showEnfairePagination: false,
        showFaireProjects: false,
        showAllPagination: true,
        totalClientsToday: 0,
        totalProjectsToday: 0,
        searchTerm: "",
        villeopts: [],
        refDuBeton: "",
        nomComCentrale: "",
        numeroComCentrale: "",
        addrCom: "",
        created_at: new Date().toJSON().slice(0, 10),
        etat_projet: 0,
        remarques: "",
        admin1: ""
    }
   

    componentDidMount() {
        console.log(this.state.accesChantier)
        console.log(this.state.planProjet)
        var loginToken = localStorage.getItem('loginToken');
        if (!loginToken) {
            this.props.history.push('/');
        }
        this.setState({admin1: loginToken})
        this.getTotalProjects();       
        this.getTotalClients();
       // this.getProjects();
       
        //New code ||||||||||||||||||||||||||||||||||||||||||=========||||||||||||||||||||||||||||


        Axios.get("http://192.168.100.232:3001/clients").then((response) => {
            //console.log(response.data);
            var users = response.data;
            users.forEach(element => {
                if (element.email === loginToken) {
                    this.setState({
                         first_name: element.first_name,
                        entreprise_name: element.entreprise_name,
                       

                    });
                }
            });
             this.getProjects()
        });

        // ||||||||||||||||||||||||||||||||||||||||||=========||||||||||||||||||||||||||||

        Axios.get("http://192.168.100.232:3001/users").then((response) => {
            //console.log(response.data);
            var users = response.data;
           // console.log("users", users)
            users.forEach(element => {
                
                if (element.email === loginToken) {
                    this.setState({
                        first_name: element.first_name,
                        last_name: element.last_name,
                        client: element.first_name,
                        admin1: element.email
                    });
                }
            });
            
        });
        






        var configClients = {
            method: 'get',
            url: 'http://192.168.100.232:3001/clients-today/',
            headers: {}
        };
        const self = this;
        Axios(configClients)
            .then(function (response) {
                self.setState({
                    totalClientsToday: response.data.Total,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        var configProjects = {
            method: 'get',
            url: 'http://192.168.100.232:3001/projects-today/',
            headers: {}
        };

        Axios(configProjects)
            .then(function (response) {
                console.log(JSON.stringify(response.data.Total));
                self.setState({
                    totalProjectsToday: response.data.Total,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        /*var config = {
            method: 'get',
            url: 'http://192.168.100.232:3001/villes',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : ""
        };

        Axios(config)
        .then((response) => {
            var options = response.data;
            var arrVilles = [];
            for (var k = 0; k < options.length; k++) {
                // arrVilles.push(<option key={options[k].id} value={options[k].ville_code_postal}> {options[k].ville_code_postal} </option>);
                arrVilles.push({value: `${options[k].ville_code_postal}`, label: `${options[k].ville_code_postal} - ${options[k].ville_nom}`});
            }
            this.setState({
                villeopts: arrVilles
            });
            //console.log(this.state.villeopts);
        })
        .catch((error) => {
          console.log(error);
        }); */
    }

    // componentDidUpdate(pP, pS, sS){
    //  if(this.state.first_name != "" && trigger){
    //     this.getProjects()
    //     trigger= false
    //  }
    
    // }

    logout = () => {
        localStorage.removeItem("loginToken");
        window.location.href = '/';
    }


    showModal = () => {
        this.setState({ showModal: true });
        this.setState({ currentStep: 1 });
    };

    hideModal = () => {
        this.setState({ showModal: false });
        this.props.history.push('/projects');
    };

    showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    };

    hideDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    };

    getProjects = () => {
        var userType = localStorage.getItem('roleUser');
        var enterpriseEmail = localStorage.getItem('loginToken');

        if (userType === 'ADMIN') {
            Axios.get("http://192.168.100.232:3001/projects-no-limit").then((response) => {
                this.setState({ projectsList: response.data });
                // setProjectsList(response.data);
                //setShow(!show);  
                console.log(response.data);
            });
        } else {
           // console.log("xxxxxxxxx",response.data);
            console.log("firstNameee",this.state.first_name)
            console.log("Email", enterpriseEmail)
            Axios.get(`http://192.168.100.232:3001/user-projects/${this.state.first_name}`).then((response) => {
                this.setState({ projectsList: response.data });
                console.log("data is:", response.data)
                // setProjectsList(response.data);
                //setShow(!show);  
               // window.location.reload();
          
            });
        }


    };

    getTotalProjects = () => {
        Axios.get("http://192.168.100.232:3001/projects-no-limit").then((response) => {
            const totalProjects = response.data.length;
            this.setState({ totalProjects: totalProjects });
        }
        );
    }

    getTotalClients = () => {
        Axios.get("http://192.168.100.232:3001/clients").then((response) => {
            const totalClients = response.data.length;
            this.setState({ totalClients: totalClients });
        }
        );
    }

    onSubmit = (e) => {
        e.preventDefault();

        var compareDate;

        if (this.state.created_at !== new Date().toJSON().slice(0, 10)) {
            compareDate = 3;
        }

        let formData = new FormData();    //formdata object
        console.log("accessChantier Array",this.state.accesChantier)
      
        this.state.accesChantier.map(c => {
                for(let i=0; i<c.length; i++){
                formData.append('access_au_chantier', c[i]);
                }
        })
       
       console.log("formdata of accessChantier ",formData.getAll('access_au_chantier'))
         
        this.state.preparationProjet.map(p =>{
            for(let j=0; j<p.length; j++){
                formData.append('preparation_projet',p[j])
            }
        })
        
        this.state.planProjet.map(p =>{
            for(let i=0; i<p.length; i++){
                formData.append('plan_projet', p[i])
            }
        })

        // formData.append('access_au_chantier', this.state.accesChantier);
        //formData.append('preparation_projet', this.state.preparationProjet);
       // formData.append('plan_projet', this.state.planProjet);
        formData.append('client', this.state.client);
        formData.append('nom', this.state.entreprise_name);
        formData.append('complement_adresse', this.state.complementAddr);
        formData.append('id_ville_id', this.state.ville);
        formData.append('nom_Responsable', this.state.nomResp);
        formData.append('prenom_Responsable', this.state.prenomResp);
        formData.append('numero_Responsable', this.state.numeroResp);
        formData.append('type_project', this.state.typeProjet);
        formData.append('dates_Livraison', this.state.dateLiv);
        formData.append('pentes', this.state.pentes);
        formData.append('surface_estimee', this.state.surfEstime);
        formData.append('surface_reelle', this.state.surfRelle);
        formData.append('charges', this.state.charges);
        formData.append('volumes', this.state.volume);
        formData.append('distance_Chantier_Centrale', this.state.distanceChantier);
        formData.append('nom_Responsable_centrale', this.state.nomRespCentrale);
        formData.append('num_Contact_Centrale', this.state.numeroContactCentrale);
        formData.append('cailloux', this.state.cailloux);
        formData.append('ciment', this.state.ciment);
        formData.append('teinte', this.state.teinte);
        formData.append('sable', this.state.sable);
        formData.append('particularites_Specifique', this.state.particularites);
        formData.append('vitre', this.state.vitre);
        formData.append('plante', this.state.plante);
        formData.append('revetement', this.state.revetements);
        formData.append('facade', this.state.facade);
        formData.append('vegetation', this.state.vegetation);
        formData.append('tapis', this.state.tapis);
        formData.append('direct', this.state.direct);
        formData.append('dumper_300', this.state.dumper300);
        formData.append('dumper_500', this.state.dumper500);
        formData.append('dumper_800', this.state.dumper800);
        formData.append('brouette', this.state.brouette);
        formData.append('user_id', '13579');
        formData.append('slug', 'test');
        formData.append('draft', "");
        formData.append('beton_lisse', 0);

        if (compareDate === 3) {
            formData.append('etat_projet', 3);
        } else {
            formData.append('etat_projet', this.state.etat_projet);
        }

        formData.append('facture', "");
        formData.append('facture2', "");
        formData.append('protection', "");
        formData.append('type_Beton', 0);
        formData.append('type_Cailloux', 0);
        formData.append('type_Desactivant', 0);
        formData.append('dumper', 0);
        formData.append('adresse', this.state.addrPrj);
        formData.append('created_at', this.state.created_at);
        formData.append('reference_du_beton', this.state.refDuBeton);
        formData.append('nom_com_centrale', this.state.nomComCentrale);
        formData.append('num_com_centrale', this.state.numeroComCentrale);
        formData.append('addr_com_centrale', this.state.addrCom);
        formData.append('remarques', this.state.remarques);

        const config = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'content-type': 'multipart/form-data'
            }
        }

        Axios.post("http://192.168.100.232:3001/create-project", formData, config)
            .then(response => {
                console.log(response);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
        console.log(this.state.accesChantier.name);
        this.hideModal();
        this.setState({ currentStep: 1 });
    }

    render() {

        const nextStep = () => {
            let isValid_1 = true;
            let isValid_2 = true;
            let isValid_3 = true;


            if (this.state.addrPrj === "" || this.state.ville === "" ||
                this.state.nomResp === "" || this.state.prenomResp === "" || this.state.numeroResp === "" ) {
                // this.setState({currentStep: this.state.currentStep});
                isValid_1 = false;
            }

            if (this.state.pentes === "" || this.state.surfEstime === "" || this.state.charges === "" || this.state.volume === "" ||
                this.state.nomRespCentrale === "" || this.state.typeProjet === "" ||
                this.state.cailloux === "" ||
                this.state.accesChantier === "" || this.state.preparationProjet === "" || this.state.planProjet === "") {
                // this.setState({currentStep: this.state.currentStep});
                isValid_2 = false;
            }

            //if(this.state.particularites === "" ){
            // this.setState({currentStep: this.state.currentStep});
            //    isValid_3 = false;
            //}

            // this.setState(this.state.currentStep < 4 ? {currentStep: this.state.currentStep + 1} : {currentStep: 4});
            if (this.state.currentStep < 1 || this.state.currentStep > 4) {
                return null;
            } else {
                if (this.state.currentStep === 2) {
                  
                
                    let ar1=[]
                    let ar2=[]
                    let ar3=[]
                    
                    this.state.accesChantier.map((c) => {
                        
                        for(let i=0; i<c.length; i++){
                            
                            ar1.push(c[i].name)
                             }
                             })

                    this.state.planProjet.map((c) => {
                        
                         for(let i=0; i<c.length; i++){
                                    
                             ar2.push(c[i].name)
                              }
                              })

                     this.state.preparationProjet.map((c) => {
                        
                         for(let i=0; i<c.length; i++){
                                    
                              ar3.push(c[i].name)
                              }
                              })

                    if (ar1.length < 2 ){
                        alert("merci d'insérer au moins 2 photo dans Accès au chantier")
                        return null;
                    }


                    
                    else if( ar2.length < 1) {
                        alert("merci d'insérer au moins 1 photo dans Plan du chantier ")
                        return null;
                    }
                    else if(ar3.length < 4){
                        alert("merci d'insérer au moins 4 photo dans Préparation du chantier ")
                        return null;
                    }
                }
                if (eval("isValid_" + this.state.currentStep)) {
                    this.setState({ currentStep: this.state.currentStep + 1 });
                    document.getElementsByClassName('step-' + (this.state.currentStep + 1))[0].style.display = "block";
                    document.getElementsByClassName('step-' + this.state.currentStep)[0].style.display = "none";
                    document.getElementById('s-' + this.state.currentStep).disabled = true;
                    document.getElementById('s-' + this.state.currentStep).classList.remove('active');
                    document.getElementById('s-' + (this.state.currentStep + 1)).disabled = false;
                    document.getElementById('s-' + (this.state.currentStep + 1)).classList.add('active');
                } else {
                    alert('Remplissez tous les champs!');
                    document.getElementsByClassName('step-' + (this.state.currentStep + 1))[0].style.display = "none";
                    document.getElementsByClassName('step-' + this.state.currentStep)[0].style.display = "block";
                    document.getElementById('s-' + this.state.currentStep).disabled = false;
                    document.getElementById('s-' + this.state.currentStep).classList.add('active');
                    document.getElementById('s-' + (this.state.currentStep + 1)).disabled = true;
                    document.getElementById('s-' + (this.state.currentStep + 1)).classList.remove('active');
                }

            }

        }

        const previousStep = () => {
            let isValid_1 = true;
            let isValid_2 = true;
            let isValid_3 = true;


            /*if(this.state.client === "" || this.state.nomProjet === "" || this.state.addrPrj === "" || this.state.ville === "" ||
                this.state.nomResp === "" || this.state.prenomResp === "" || this.state.numeroResp === "" || this.state.dateLiv.valueOf() === ""){
                    // this.setState({currentStep: this.state.currentStep});
                    isValid_1 = false;
                }
            */
            // if(this.state.pentes === "" || this.state.surfEstime === "" || this.state.surfRelle === "" || this.state.charges === "" || this.state.volume === "" ||
            //     this.state.distanceChantier === "" || this.state.addrCentrale === "" || this.state.nomRespCentrale === "" || this.state.numeroContactCentrale === "" || this.state.typeProjet === "" ||
            //     this.state.cailloux === "" || this.state.ciment === "" || this.state.teinte === "" || this.state.sable === "" || 
            //     this.state.accesChantier === "" || this.state.preparationProjet === "" || this.state.planProjet === ""){
            //         // this.setState({currentStep: this.state.currentStep});
            //     isValid_2 = false;
            // }

            //if(this.state.particularites === "" ){
            // this.setState({currentStep: this.state.currentStep});
            //    isValid_3 = false;
            //}

            // this.setState(this.state.currentStep < 4 ? {currentStep: this.state.currentStep + 1} : {currentStep: 4});
            if (this.state.currentStep < 1 || this.state.currentStep > 4) {
                return null;
            } else {

                if (eval("isValid_" + this.state.currentStep)) {
                    this.setState({ currentStep: this.state.currentStep - 1 });
                    document.getElementsByClassName('step-' + (this.state.currentStep - 1))[0].style.display = "block";
                    document.getElementsByClassName('step-' + this.state.currentStep)[0].style.display = "none";
                    document.getElementById('s-' + this.state.currentStep).disabled = true;
                    document.getElementById('s-' + this.state.currentStep).classList.remove('active');
                    document.getElementById('s-' + (this.state.currentStep - 1)).disabled = false;
                    document.getElementById('s-' + (this.state.currentStep - 1)).classList.add('active');
                }

            }

        }

        const labelStyle = {
            position: "absolute",
            top: 3 + "%",
            left: 6 + "%",
            color: "#B84257",
            fontSize: 11 + "px",
            fontWeight: 600
        };


        const indexOfLastProject = this.state.currentPage * this.state.projectsPerPage;
        const indexOfFirstProject = indexOfLastProject - this.state.projectsPerPage;
        const filteredProjects = this.state.projectsList.filter((project) => {
            if (this.state.searchTerm === "") {
                return project;
            } else if (project.nom !== null && project.nom.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                return project;
            }
        });
        const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

        const paginate = (pageNumber) => this.setState({ currentPage: pageNumber });


        const nextPage = () => {
            if (this.state.currentPage < Math.ceil(this.state.projectsList.length / this.state.projectsPerPage)) {
                this.setState({ currentPage: this.state.currentPage + 1 });
                if (this.state.currentPage >= Math.ceil(this.state.projectsList.length / this.state.projectsPerPage) - 1) {
                    this.setState({ pageNo: this.state.projectsList.length });
                } else {
                    this.setState({ pageNo: this.state.pageNo + 11 });
                }
            } else {
                return null;
            }
        }


        const prevPage = () => {
            if (this.state.currentPage > 1) {
                this.setState({ currentPage: this.state.currentPage - 1, pageNo: this.state.pageNo - currentProjects.length });
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            } else {
                return null;
            }
        }

        const indexOfLastProjectFilter = this.state.currentPageFilter * this.state.projectsPerPageFilter;
        const indexOfFirstProjectFilter = indexOfLastProjectFilter - this.state.projectsPerPageFilter;
        const currentProjectsFilter = filteredProjects.slice(indexOfFirstProjectFilter, indexOfLastProjectFilter);

        const paginateFilter = (pageNumber) => this.setState({ currentPageFilter: pageNumber });

        const nextPageFilter = () => {
            if (this.state.currentPageFilter < Math.ceil(filteredProjects.length / this.state.projectsPerPageFilter)) {
                this.setState({ currentPageFilter: this.state.currentPageFilter + 1 });
                if (this.state.currentPageFilter >= Math.ceil(filteredProjects.length / this.state.projectsPerPageFilter) - 1) {
                    this.setState({ pageNoFilter: filteredProjects.length });
                } else {
                    this.setState({ pageNoFilter: this.state.pageNoFilter + 11 });
                }
            } else {
                return null;
            }
        }

        const prevPageFilter = () => {
            if (this.state.currentPageFilter > 1) {
                this.setState({ currentPageFilter: this.state.currentPageFilter - 1, pageNoFilter: this.state.pageNoFilter - currentProjectsFilter.length });
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            } else {
                return null;
            }
        }


        const enCoursProjects = this.state.projectsList.filter(project => {
            return project.etat_projet === "0" || project.etat_projet === null;
        });

        const indexOfLastProjectEnCours = this.state.currentPageEnCours * this.state.projectsPerPageEnCours;
        const indexOfFirstProjectEnCours = indexOfLastProjectEnCours - this.state.projectsPerPageEnCours;
        const currentEnCoursProjects = enCoursProjects.slice(indexOfFirstProjectEnCours, indexOfLastProjectEnCours);


        const paginateEnCours = (pageNumber) => this.setState({ currentPageEnCours: pageNumber });

        const nextPageEnCours = () => {
            if (this.state.currentPageEnCours < Math.ceil(enCoursProjects.length / this.state.projectsPerPageEnCours)) {
                this.setState({ currentPageEnCours: this.state.currentPageEnCours + 1 });
                if (this.state.currentPageEnCours >= Math.ceil(enCoursProjects.length / this.state.projectsPerPageEnCours) - 1) {
                    this.setState({ pageNoEnCours: enCoursProjects.length });
                } else {
                    this.setState({ pageNoEnCours: this.state.pageNoEnCours + 11 });
                }
            } else {
                return null;
            }
        }

        const prevPageEnCours = () => {
            if (this.state.currentPageEnCours > 1) {
                this.setState({ currentPageEnCours: this.state.currentPageEnCours - 1, pageNoEnCours: this.state.pageNoEnCours - currentEnCoursProjects.length });
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            } else {
                return null;
            }
        }

        const termineProjects = this.state.projectsList.filter(project => {
            return project.etat_projet === "1";
        });

        const indexOfLastProjectTermine = this.state.currentPageTermine * this.state.projectsPerPageTermine;
        const indexOfFirstProjectTermine = indexOfLastProjectTermine - this.state.projectsPerPageTermine;
        const currentTermineProjects = termineProjects.slice(indexOfFirstProjectTermine, indexOfLastProjectTermine);

        const paginateTermine = (pageNumber) => this.setState({ currentPageTermine: pageNumber });

        const nextPageTermine = () => {
            if (this.state.currentPageTermine < Math.ceil(termineProjects.length / this.state.projectsPerPageTermine)) {
                this.setState({ currentPageTermine: this.state.currentPageTermine + 1 });
                if (this.state.currentPageTermine >= Math.ceil(termineProjects.length / this.state.projectsPerPageTermine) - 1) {
                    this.setState({ pageNoTermine: termineProjects.length });
                } else {
                    this.setState({ pageNoTermine: this.state.pageNoTermine + 11 });
                }
            } else {
                return null;
            }
        }

        const prevPageTermine = () => {
            if (this.state.currentPageTermine > 1) {
                this.setState({ currentPageTermine: this.state.currentPageTermine - 1, pageNoTermine: this.state.pageNoTermine - currentTermineProjects.length });
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            } else {
                return null;
            }
        }

        const archiveProjects = this.state.projectsList.filter(project => {
            return project.etat_projet === "2";
        });

        const indexOfLastProjectArchive = this.state.currentPageArchive * this.state.projectsPerPageArchive;
        const indexOfFirstProjectArchive = indexOfLastProjectArchive - this.state.projectsPerPageArchive;
        const currentArchiveProjects = archiveProjects.slice(indexOfFirstProjectArchive, indexOfLastProjectArchive);

        const paginateArchive = (pageNumber) => this.setState({ currentPageArchive: pageNumber });

        const nextPageArchive = () => {
            if (this.state.currentPageArchive < Math.ceil(archiveProjects.length / this.state.projectsPerPageArchive)) {
                this.setState({ currentPageArchive: this.state.currentPageArchive + 1 });
                if (this.state.currentPageArchive >= Math.ceil(archiveProjects.length / this.state.projectsPerPageAcurrentPageArchive) - 1) {
                    this.setState({ pageNoAcurrentPageArchive: archiveProjects.length });
                } else {
                    this.setState({ pageNoAcurrentPageArchive: this.state.pageNoAcurrentPageArchive + 11 });
                }
            } else {
                return null;
            }
        }

        const prevPageArchive = () => {
            if (this.state.currentPageArchive > 1) {
                this.setState({ currentPageArchive: this.state.currentPageArchive - 1, pageNoArchive: this.state.pageNoArchive - currentArchiveProjects.length });
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            } else {
                return null;
            }
        }

        const enFaireProjects = this.state.projectsList.filter(project => {
            return project.etat_projet === "3";
        });

        const indexOfLastProjectEnFaire = this.state.currentPageEnFaire * this.state.projectsPerPageEnFaire;
        const indexOfFirstProjectEnFaire = indexOfLastProjectEnFaire - this.state.projectsPerPageEnFaire;
        const currentEnFaireProjects = enFaireProjects.slice(indexOfFirstProjectEnFaire, indexOfLastProjectEnFaire);

        //console.log(enFaireProjects)


        const paginateEnFaire = (pageNumber) => this.setState({ currentPageEnFaire: pageNumber });

        const nextPageEnFaire = () => {
            if (this.state.currentPageEnFaire < Math.ceil(enFaireProjects.length / this.state.projectsPerPageEnFaire)) {
                this.setState({ currentPageEnFaire: this.state.currentPageEnFaire + 1 });
                if (this.state.currentPageEnFaire >= Math.ceil(enFaireProjects.length / this.state.projectsPerPageEnFaire) - 1) {
                    this.setState({ pageNoEnFaire: enFaireProjects.length });
                } else {
                    this.setState({ pageNoEnFaire: this.state.pageNoEnFaire + 11 });
                }
            } else {
                return null;
            }
        }

        const prevPageEnFaire = () => {
            if (this.state.currentPageEnFaire > 1) {
                this.setState({ currentPageEnFaire: this.state.currentPageEnFaire - 1, pageNoEnFaire: this.state.pageNoEnFaire - currentEnFaireProjects.length });
                // if(this.state.currentPage >= Math.ceil(this.state.clientsList.length / this.state.clientsPerPage)){
                //     this.setState({pageNo: this.state.pageNo - currentClients.length});
                // }else{
                //     this.setState({pageNo: this.state.pageNo - 8});
                // }
            } else {
                return null;
            }
        }


        const showEncours = () => {
            this.setState({
                showAllProjects: false,
                showEnCoursProjects: true,
                showTermineProjects: false,
                showArchiveProjects: false,
                showTerminePagination: false,
                showAllPagination: false,
                showFaireProjects: false,
            });
            document.getElementById('allProjects').classList.remove('active');
        }

        const showArchive = () => {
            this.setState({
                showAllProjects: false,
                showEnCoursProjects: false,
                showTermineProjects: false,
                showArchiveProjects: true,
                showTerminePagination: false,
                showAllPagination: false,
                showFaireProjects: false,
            });
            document.getElementById('allProjects').classList.remove('active');
        }

        const showTermine = () => {
            this.setState({
                showAllProjects: false,
                showEnCoursProjects: false,
                showTermineProjects: true,
                showArchiveProjects: false,
                showTerminePagination: true,
                showAllPagination: false,
                showFaireProjects: false,
            });
            document.getElementById('allProjects').classList.remove('active');
        }

        const showEnfaire = () => {
            this.setState({
                showAllProjects: false,
                showEnCoursProjects: false,
                showTermineProjects: false,
                showFaireProjects: true,
                showArchiveProjects: false,
                showTerminePagination: false,
                showAllPagination: false,
                showEnFairePagination: true,
            });
            document.getElementById('allProjects').classList.remove('active');
        }

        const showAll = () => {
            this.setState({
                showAllProjects: true,
                showEnCoursProjects: false,
                showTermineProjects: false,
                showArchiveProjects: false,
                showTerminePagination: false,
                showAllPagination: true,
                showFaireProjects: false,
            });
        }

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
                <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteModal} className="delete-modal">
                    <Modal.Body>
                        <h5>Delete Project</h5>
                        <p>Are you sure you want to delete this project?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{ backgroundColor: "#F5F6F8" }} onClick={this.hideDeleteModal}>No</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{ backgroundColor: "#B84257" }}>Yes</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showModal} onHide={this.hideModal} backdrop="static">
                    <Modal.Header className="bg-light">
                        <h4><span style={{ color: "#B84257", fontWeight: 700 }}>+</span> Ajouter un nouveau chantier</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modalContainer px-4">
                            <div className="row">
                                <div className="col-md-12 modal-nav">
                                    <button type="button" id="s-1" className="btn active">Projet</button>
                                    <button type="button" id="s-2" className="btn" disabled>Chantier</button>
                                    <button type="button" id="s-3" className="btn" disabled>Protection</button>
                                    <button type="button" id="s-4" className="btn" disabled>Options</button>
                                </div>
                            </div>
                            <form>
                                <fieldset className="step step-1">
                                    <div className="row pt-4">
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                {this.state.admin1 == "d.kapexhiu@stema.al" ? 
                                                    <input type="text" className="form-control formControl bg-light border-0" id="client" placeholder={this.state.entreprise_name} value={this.state.entreprise_name} onChange={(e) => this.setState({ entreprise_name: e.target.value })} required />
                                                    
                                                    : <input type="text" disabled className="form-control formControl bg-light border-0" id="client" placeholder={this.state.entreprise_name} value={this.state.entreprise_name} onChange={(e) => this.setState({ entreprise_name: this.state.entreprise_name })} required />
                                                    
                                                    }
                                                    
                                                <label htmlFor="client" className="formLabel">{'Référence du chantier *'}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="adress" placeholder="" onChange={(e) => this.setState({ addrPrj: e.target.value })} />
                                                <label htmlFor="adress" className="formLabel">{'Adresse du chantier *'}</label>
                                            </div>
                                            <div className="form-group postal-code position-relative mb-3">
                                                <span className="formLabel">{'Ville *'}</span>
                                                <AutoSuggest
                                                    options={villes}
                                                    handleChange={(e) => this.setState({ ville: e })}
                                                    value={this.state.ville}
                                                    name="Code Postal"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {/* <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="projectName" placeholder="" onChange={(e) => this.setState({nomProjet: e.target.value})} />
                                            <label htmlFor="projectName" className="formLabel">{'Référence du chantier *'}</label>
                                        </div> */}

                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="addr" placeholder="" onChange={(e) => this.setState({ complementAddr: e.target.value })} />
                                                <label htmlFor="addr" className="formLabel">{"Complément d'adresse"}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr style={{ opacity: 1, backgroundColor: "#F5F6F8" }} />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="responsibleName" placeholder="" onChange={(e) => this.setState({ nomResp: e.target.value })} />
                                                <label htmlFor="responsibleName" className="formLabel">{"Nom du responsable chantier *"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <PhoneInput
                                                    country={'fr'}
                                                    //value={this.state.numeroResp}
                                                    onChange={numeroResp => this.setState({ numeroResp })}
                                                />
                                                <label htmlFor="responsibleNumber" className="formLabel">{"Téléphone du responsable *"}</label>
                                            </div>
                                            {/* <div className="form-group position-relative mb-3">
                                            <select className="form-control formControl bg-light border-0" id="projectType" onChange={(e) => this.setState({typeProjet: e.target.value})}>
                                                <option value=""></option>
                                                <option value="Béton drainant">Béton drainant</option>
                                                <option value="Béton drainant desactive">Béton drainant desactive</option>
                                                <option value="Béton Desactivé">Béton Desactivé</option>
                                                <option value="Béton Sablé">Béton Sablé</option>
                                                <option value="Béton Balayé">Béton Balayé</option>
                                            </select>
                                            <input type="text" className="form-control formControl bg-light border-0" id="projectType" placeholder="" onChange={(e) => this.setState({typeProjet: e.target.value})} />
                                            <label htmlFor="projectType" className="formLabel">{this.state.typeProjet === '' ? "Type du projet" : ''}</label>
                                        </div> */}
                                        </div>
                                        <div className="col-md-6 d-flex flex-column justify-content-between">
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="responsibleSurname" placeholder="" onChange={(e) => this.setState({ prenomResp: e.target.value })} />
                                                <label htmlFor="responsibleSurname" className="formLabel">{"Prénom du responsable chantier *"}</label>
                                            </div>
                                            <div className="form-group date position-relative mb-3">
                                                <label htmlFor="dateCreate" style={labelStyle}>Date souhaitée</label>
                                                <input type="date" className="form-control bg-light border-0 pl-4 pt-3" id="dateCreate" placeholder="Date de création" /*value={this.state.created_at}*/ onChange={(e) => this.setState({ created_at: e.target.value })} />
                                            </div>
                                            {/* <div className="form-group date position-relative mb-3">
                                            <label htmlFor="date" style={labelStyle}>Et le *</label>
                                            <input type="date" className="form-control bg-light border-0 pl-4 pt-3" id="date" placeholder="Date du chantier" onChange={(e) => this.setState({dateLiv: e.target.value})} />
                                        </div> */}
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="step step-2">
                                    <div className="row pt-4">
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                {/* <input type="text" className="form-control formControl bg-light border-0" id="pentes" placeholder="" onChange={(e) => this.setState({pentes: e.target.value})} /> */}
                                                <select className="form-control formControl bg-light border-0" id="pentes" onChange={(e) => this.setState({ pentes: e.target.value })}>
                                                    <option value=""></option>
                                                    <option value="Faible">Faible</option>
                                                    <option value="Moyenne">Moyenne</option>
                                                    <option value="Forte">Forte</option>
                                                </select>
                                                <label htmlFor="pentes" className="formLabel">{this.state.pentes === '' ? "Pente *" : ''}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="surfRelle" placeholder="" onChange={(e) => this.setState({ surfRelle: e.target.value })} />
                                                <label htmlFor="surfRelle" className="formLabel">{"Surface réelle (m2)"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="volume" placeholder="" onChange={(e) => this.setState({ volume: e.target.value })} />
                                                <label htmlFor="volume" className="formLabel">{"Volume (m3) comprenant 10% de perte *"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nomResCentrale" placeholder="" onChange={(e) => this.setState({ nomRespCentrale: e.target.value })} />
                                                <label htmlFor="nomResCentrale" className="formLabel">{"Nom de la centrale *"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nrContCentrale" placeholder="" onChange={(e) => this.setState({ numeroContactCentrale: e.target.value })} />
                                                <label htmlFor="nrContCentrale" className="formLabel">{"Téléphone planning"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nomComCentrale" placeholder="" onChange={(e) => this.setState({ nomComCentrale: e.target.value })} />
                                                <label htmlFor="nomComCentrale" className="formLabel">{"Commercial de la centrale"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nrComCentrale" placeholder="" onChange={(e) => this.setState({ numeroComCentrale: e.target.value })} />
                                                <label htmlFor="nrComCentrale" className="formLabel">{"Téléphone / Commercial"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <select className="form-control formControl bg-light border-0" id="projectType" onChange={(e) => this.setState({ typeProjet: e.target.value })}>
                                                    <option value=""></option>
                                                    <option value="Béton Désactivé">Béton Désactivé</option>
                                                    <option value="Drainant">Drainant</option>
                                                    <option value="Drainant Désactivé">Drainant Désactivé</option>
                                                    <option value="Béton lissé main">Béton lissé main</option>
                                                    <option value="Béton Balayé">Béton Balayé</option>
                                                </select>
                                                {/* <input type="text" className="form-control formControl bg-light border-0" id="projectType" placeholder="" onChange={(e) => this.setState({typeProjet: e.target.value})} /> */}
                                                <label htmlFor="projectType" className="formLabel">{"Type de projet *"}</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="surfEstime" placeholder="" onChange={(e) => this.setState({ surfEstime: e.target.value })} />
                                                <label htmlFor="surfEstime" className="formLabel">{"Surface estimée (m2) *"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="charges" placeholder="" onChange={(e) => this.setState({ charges: e.target.value })} />
                                                <label htmlFor="charges" className="formLabel">{"Charge (cm) *"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="distance" placeholder="" onChange={(e) => this.setState({ distanceChantier: e.target.value })} />
                                                <label htmlFor="distance" className="formLabel">{"Distance chantier-Centrale"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="adrCentrale" placeholder="" onChange={(e) => this.setState({ addrCentrale: e.target.value })} />
                                                <label htmlFor="adrCentrale" className="formLabel">{"Mail planning"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" placeholder="" style={{ visibility: 'hidden' }} />
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="adrCom" placeholder="" onChange={(e) => this.setState({ addrCom: e.target.value })} />
                                                <label htmlFor="adrCom" className="formLabel">{"Mail / Commercial"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" placeholder="" style={{ visibility: 'hidden' }} />
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="refBeton" placeholder="" onChange={(e) => this.setState({ refDuBeton: e.target.value })} />
                                                <label htmlFor="refBeton" className="formLabel">{"Référence du beton"}</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="cailloux" placeholder="" onChange={(e) => this.setState({ cailloux: e.target.value })} />
                                                <label htmlFor="cailloux" className="formLabel">{"Cailloux / granulométrie *"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="teinte" placeholder="" onChange={(e) => this.setState({ teinte: e.target.value })} />
                                                <label htmlFor="teinte" className="formLabel">{"Teinte"}</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="ciment" placeholder="" onChange={(e) => this.setState({ ciment: e.target.value })} />
                                                <label htmlFor="ciment" className="formLabel">{"Ciment"}</label>
                                            </div>
                                            <div className="form-group position-relative mb-3">
                                                <select className="form-control formControl bg-light border-0" id="pentes" onChange={(e) => this.setState({ sable: e.target.value })}>
                                                    <option value=""></option>
                                                    <option value="Sable Carrière 0/2">Sable Carrière 0/2</option>
                                                    <option value="Sable Carrière 0/4">Sable Carrière 0/4</option>
                                                    <option value="Sable Rivière 0/2">Sable Rivière 0/2</option>
                                                    <option value="Sable Rivière 0/40">Sable Rivière 0/40</option>
                                                </select>
                                                <label htmlFor="sable" className="formLabel">{"Sable"}</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                <button className="form-control formControl bg-light border-0" disabled>
                                                    <input style={{ display: 'none' }} type="file" name="access_au_chantier" id="acces" placeholder="" multiple onChange={(e) => this.setState({ accesChantier: [...this.state.accesChantier, e.target.files] })} />
                                                  
                                                </button>
                                                <label htmlFor="acces" style={{ cursor: 'pointer' }} className="formLabel w-100 h-100">{this.state.accesChantier.length == 0 ? "Accès au chantier *" : this.state.accesChantier.map((c) => {
                                                    let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(c[i].name, " / ")
                                                         }
                                                         return arr
                                                       
                                                         })}</label>
                     
                                            </div>
                                            <div>{this.state.accesChantier.length == 0 ? "" : this.state.accesChantier.map((c) => {
                                                let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(URL.createObjectURL(c[i]))
                                                          }
                                                          return arr.map(ar => <img src={ar} alt="qas" style={{height:"60px" ,width:"60px", marginRight:"4px", marginBottom: "8px", marginTop:"1px"}}/>)
                                                       
                                                          })}</div>
                                            

                                            <div className="form-group position-relative mb-3">
                                                <button className="form-control formControl bg-light border-0" disabled>
                                                    <input style={{ display: 'none' }} type="file" id="plan" placeholder="" multiple onChange={(e) => this.setState({ ...this.state.planProjet.push(e.target.files) })} />
                                                </button>
                                                <label htmlFor="plan" style={{ cursor: 'pointer' }} className="formLabel w-100 h-100">{this.state.planProjet == 0 ? "Plan du chantier *" : this.state.planProjet.map((c) => {
                                                    let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(c[i].name, ' / ')
                                                         }return arr})}</label>
                                            </div>

                                            <div>{this.state.planProjet.length == 0 ? "" : this.state.planProjet.map((c) => {
                                                let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(URL.createObjectURL(c[i]))
                                                          }
                                                        return arr.map(ar => <img src={ar} alt="qas" style={{height:"60px" ,width:"60px", marginRight:"4px", marginBottom: "8px", marginTop:"1px"}}/>)
                                                        
                                                          })}</div>

                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group position-relative mb-3">
                                                <button className="form-control formControl bg-light border-0" disabled>
                                                    <input style={{ display: 'none' }} type="file" id="preparation" placeholder="" multiple onChange={(e) => this.setState({ ...this.state.preparationProjet.push(e.target.files) })} />
                                                </button>
                                                <label htmlFor="preparation" style={{ cursor: 'pointer' }} className="formLabel w-100 h-100">{this.state.preparationProjet == 0 ? "Préparation du chantier *" : this.state.preparationProjet.map((c) => {
                                                    let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(c[i].name, " / ")
                                                         }return arr})}</label>
                                            </div>

                                            <div>{this.state.preparationProjet.length == 0 ? "" : this.state.preparationProjet.map((c) => {
                                                let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(URL.createObjectURL(c[i]))
                                                          }
                                                        return arr.map(ar => <img src={ar} alt="qas" style={{height:"60px" ,width:"60px", marginRight:"4px", marginBottom: "8px", marginTop:"1px"}}/>)
                                                        
                                                          })}</div>


                                        </div>
                                        <div className="row pt-4">
                                            <div className="form-group form-group position-relative mb-3">
                                                <textarea className="form-control formControl bg-light border-0" id="remarques" rows="3" placeholder="" onChange={(e) => this.setState({ remarques: e.target.value })}></textarea>
                                                <label htmlFor="remarques" className="formLabel">{"Remarques"}</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="step step-3">
                                    <div className="row pt-4 px-4">
                                        <div className="col-md-12 d-flex justify-content-between">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="vitre" defaultChecked={this.state.vitre} onChange={() => this.setState({ vitre: 1 })} />
                                                <label className="form-check-label" htmlFor="vitre">Vitres</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="plante" defaultChecked={this.state.plante} onChange={() => this.setState({ plante: 1 })} />
                                                <label className="form-check-label" htmlFor="plante">Plantes</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="revetements" defaultChecked={this.state.revetements} onChange={() => this.setState({ revetements: 1 })} />
                                                <label className="form-check-label" htmlFor="revetements">Revêtements</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="facade" defaultChecked={this.state.facade} onChange={() => this.setState({ facade: 1 })} />
                                                <label className="form-check-label" htmlFor="facade">Façades</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="vegetation" defaultChecked={this.state.vegetation} onChange={() => this.setState({ vegetation: 1 })} />
                                                <label className="form-check-label" htmlFor="vegetation">Végétation</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row pt-4">
                                        <div className="form-group form-group position-relative mb-3">
                                            <textarea className="form-control formControl bg-light border-0" id="particularites" rows="3" placeholder="" onChange={(e) => this.setState({ particularites: e.target.value })}></textarea>
                                            <label htmlFor="particularites" className="formLabel">{"Particularites Specifique"}</label>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="step step-4">
                                    <div className="row pt-4 px-4">
                                        <div className="col-md-12 d-flex flex-column justify-content-between">
                                            <div className="form-check py-2">
                                                <input type="checkbox" className="form-check-input" id="pompe" defaultChecked={this.state.pompe} onChange={() => this.setState({ pompe: 1 })} />
                                                <label className="form-check-label" htmlFor="pompe">Pompe</label>
                                            </div>
                                            <div className="form-check py-2">
                                                <input type="checkbox" className="form-check-input" id="tapis" defaultChecked={this.state.tapis} onChange={() => this.setState({ tapis: 1 })} />
                                                <label className="form-check-label" htmlFor="tapis">Tapis</label>
                                            </div>
                                            <div className="form-check py-2">
                                                <input type="checkbox" className="form-check-input" id="direct" defaultChecked={this.state.direct} onChange={() => this.setState({ direct: 1 })} />
                                                <label className="form-check-label" htmlFor="direct">Direct</label>
                                            </div>
                                            <div className="form-check py-2">
                                                <input type="checkbox" className="form-check-input" id="dumper3" defaultChecked={this.state.dumper300} onChange={() => this.setState({ dumper300: 1 })} />
                                                <label className="form-check-label" htmlFor="dumper3">Dumper 300</label>
                                            </div>
                                            <div className="form-check py-2">
                                                <input type="checkbox" className="form-check-input" id="dumper5" defaultChecked={this.state.dumper500} onChange={() => this.setState({ dumper500: 1 })} />
                                                <label className="form-check-label" htmlFor="dumper5">Dumper 500</label>
                                            </div>
                                            <div className="form-check py-2">
                                                <input type="checkbox" className="form-check-input" id="dumper8" defaultChecked={this.state.dumper800} onChange={() => this.setState({ dumper800: 1 })} />
                                                <label className="form-check-label" htmlFor="dumper8">Dumper 800</label>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <p className="my-4" style={{ color: "#BBC9DC", fontWeight: 500 }}>Option:</p>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="brouette" defaultChecked={this.state.brouette} onChange={() => this.setState({ brouette: 1 })} />
                                                <label className="form-check-label" htmlFor="brouette">Brouette</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                            {/* <hr style={{opacity: 1, backgroundColor: "#F5F6F8"}} /> */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: "center" }}>
                        <button type="button" className="btn" onClick={this.hideModal}>Annuler</button>
                        {this.state.currentStep === 1 ? '' : <button type="button" className="btn btn-danger" style={{ backgroundColor: "#B84257" }} onClick={this.state.currentStep === 4 ? this.onSubmit : previousStep}>{"Précédent"}</button>}
                        <button type="button" className="btn btn-danger" style={{ backgroundColor: "#B84257" }}
                            onClick={this.state.currentStep === 4 ? this.onSubmit : nextStep}>{this.state.currentStep === 4 ? "Valider" : "Suivant"}</button>
                    </Modal.Footer>
                </Modal>
                <div className="main" style={{ width: '100%' }}>
                    <div className="container" style={{ maxWidth: '80%', marginLeft: '16%' }}>
                        <div className="row pt-4 pb-3">
                            <div className="col-md-10">
                                <h2>Projets</h2>
                            </div>
                            <div className="col-md-2">
                                <div className="user d-flex align-items-center justify-content-between">
                                    <i className="fas fa-user-circle" style={{ width: 40 + "px", height: 40 + "px" }}></i>
                                    <p className="m-0" style={{ color: "#25283D" }}>{this.state.first_name} {this.state.last_name}</p>

                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                            <i className="fas fa-chevron-down" style={{ cursor: "pointer", color: "#25283D" }}></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.logout()}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="row pt-4">
                            <div className="col-md-9">
                                <button type="button" className="btn btn-danger" style={{ backgroundColor: "#B84257" }} onClick={this.showModal}>+ Creer un projet</button>
                            </div>
                            <div className="form-group w-25 position-relative has-search mb-0">
                                <span className="fa fa-search form-control-feedback" style={{ right: '5%' }}></span>
                                <input
                                    type="text"
                                    className="form-control search border-0"
                                    placeholder="Chercher..."
                                    onChange={(e) => this.setState({ searchTerm: e.target.value })} />
                            </div>
                        </div>

                        <div className="row pt-4">
                            <div className="col-md-6 d-flex flex-row ">
                                <div className="totalProjects">
                                    <div className="nr flex-row mx-3" style={{ display: 'flex' }}>
                                        <h2>{this.state.totalProjects}</h2>
                                        <p className="mx-3 align-self-center m-0">+{this.state.totalProjectsToday} Aujourd'hui</p>
                                    </div>
                                    <div className=" flex-row align-items-center" style={{ display: 'flex' }}>
                                        <i className="fas fa-user-friends"></i>
                                        <p className="my-0 mx-2">Nombre total de projets</p>
                                    </div>
                                </div>
                                <div className="totalClients mx-auto">
                                    <div className="nr flex-row mx-3" style={{ display: 'flex' }}>
                                        <h2>{this.state.totalClients}</h2>
                                        <p className="mx-3 align-self-center m-0">+{this.state.totalClientsToday} Aujourd'hui</p>
                                    </div>
                                    <div className="d-flex flex-row align-items-center">
                                        <i className="fas fa-users"></i>
                                        <p className="my-0 mx-2">Nombre total de clients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container" style={{ maxWidth: '80%', marginLeft: '16%' }}>
                        <div className="row py-4">
                            <div className="col-md-12 nav d-flex align-items-center">
                                <button type="button" className="btn active" id="allProjects" onClick={showAll}>Tous les projets</button>
                                <button type="button" className="btn" onClick={showEncours}>En cours</button>
                                <button type="button" className="btn" onClick={showEnfaire}>A Faire</button>
                                <button type="button" className="btn" onClick={showTermine}>Terminé</button>

                                <div style={{ marginLeft: "auto", cursor: "pointer" }} className="d-flex align-items-center">
                                    <i className="fas fa-folder-open" style={{ color: "#B84257" }}></i>
                                    <p className="my-0 mx-2" style={{ color: "#B84257", fontWeight: 600 }} onClick={showArchive}>Projets Archives</p>
                                </div>
                            </div>
                        </div>
                        {this.state.showAllProjects && !this.state.searchTerm &&

                            <div className="row allProjects">
                                {currentProjects.map((val, key) => {

                                    return (
                                        <div key={val.id} className="my-3 col-md-3">
                                            <Project
                                                name={val.nom}
                                                projectNo={val.id}
                                                status={val.etat_projet}
                                                date={val.created_at}
                                                client={val.client}
                                            />
                                        </div>
                                    )
                                })}
                                {/* <div className="col-md-3 my-3">
                                <div className="card rounded-3 border-0 p-0 d-flex justify-content-center align-items-center ">
                                    <button className="btn">
                                    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 0C4.47581 0 0 4.47581 0 10C0 15.5242 4.47581 20 10 20C15.5242 20 20 15.5242 20 10C20 4.47581 15.5242 0 10 0ZM15.8065 11.129C15.8065 11.3952 15.5887 11.6129 15.3226 11.6129H11.6129V15.3226C11.6129 15.5887 11.3952 15.8065 11.129 15.8065H8.87097C8.60484 15.8065 8.3871 15.5887 8.3871 15.3226V11.6129H4.67742C4.41129 11.6129 4.19355 11.3952 4.19355 11.129V8.87097C4.19355 8.60484 4.41129 8.3871 4.67742 8.3871H8.3871V4.67742C8.3871 4.41129 8.60484 4.19355 8.87097 4.19355H11.129C11.3952 4.19355 11.6129 4.41129 11.6129 4.67742V8.3871H15.3226C15.5887 8.3871 15.8065 8.60484 15.8065 8.87097V11.129Z" fill="#347CFF"/>
                                    </svg>
                                    </button>
                                </div>
                            </div> */}
                            </div>}

                        {this.state.showAllProjects && this.state.searchTerm &&

                            <div className="row allProjects">
                                {currentProjectsFilter.map((val, key) => {

                                    return (
                                        <div key={val.id} className="my-3 col-md-3">
                                            <Project
                                                name={val.nom}
                                                projectNo={val.id}
                                                status={val.etat_projet}
                                                date={val.created_at}
                                                client={val.client}
                                            />
                                        </div>
                                    )
                                })}
                                {/* <div className="col-md-3 my-3">
                                <div className="card rounded-3 border-0 p-0 d-flex justify-content-center align-items-center ">
                                    <button className="btn">
                                    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 0C4.47581 0 0 4.47581 0 10C0 15.5242 4.47581 20 10 20C15.5242 20 20 15.5242 20 10C20 4.47581 15.5242 0 10 0ZM15.8065 11.129C15.8065 11.3952 15.5887 11.6129 15.3226 11.6129H11.6129V15.3226C11.6129 15.5887 11.3952 15.8065 11.129 15.8065H8.87097C8.60484 15.8065 8.3871 15.5887 8.3871 15.3226V11.6129H4.67742C4.41129 11.6129 4.19355 11.3952 4.19355 11.129V8.87097C4.19355 8.60484 4.41129 8.3871 4.67742 8.3871H8.3871V4.67742C8.3871 4.41129 8.60484 4.19355 8.87097 4.19355H11.129C11.3952 4.19355 11.6129 4.41129 11.6129 4.67742V8.3871H15.3226C15.5887 8.3871 15.8065 8.60484 15.8065 8.87097V11.129Z" fill="#347CFF"/>
                                    </svg>
                                    </button>
                                </div>
                            </div> */}
                            </div>}


                        {this.state.showEnCoursProjects &&
                            <div className="row enCoursProjects">
                                {currentEnCoursProjects.map((val, key) => {

                                    return (
                                        <div key={val.id} className="my-3 col-md-3">
                                            <Project
                                                name={val.nom}
                                                projectNo={val.id}
                                                status={val.etat_projet}
                                                date={val.created_at}
                                                client={val.client}
                                            />
                                        </div>
                                    )
                                })}
                            </div>}

                        {this.state.showArchiveProjects &&
                            <div className="row enCoursProjects">
                                {archiveProjects.map((val, key) => {

                                    return (
                                        <div key={val.id} className="my-3 col-md-3">
                                            <Project
                                                name={val.nom}
                                                projectNo={val.id}
                                                status={val.etat_projet}
                                                date={val.created_at}
                                                client={val.client}
                                            />
                                        </div>
                                    )
                                })}
                            </div>}

                        {this.state.showTermineProjects &&
                            <div className="row termineProjects">
                                {currentTermineProjects.map((val, key) => {

                                    return (
                                        <div key={val.id} className="my-3 col-md-3">
                                            <Project
                                                name={val.nom}
                                                projectNo={val.id}
                                                status={val.etat_projet}
                                                date={val.created_at}
                                                client={val.client}
                                            />
                                        </div>
                                    )
                                })}
                            </div>}

                        {this.state.showFaireProjects &&
                            <div className="row faireProjects">

                                {enFaireProjects.map((val, key) => {

                                    return (
                                        <div key={val.id} className="my-3 col-md-3">
                                            <Project
                                                name={val.nom}
                                                projectNo={val.id}
                                                status={val.etat_projet}
                                                date={val.created_at}
                                                client={val.client}
                                            />
                                        </div>
                                    )
                                })}
                            </div>}

                        {this.state.showAllPagination &&
                            <Pagination
                                clientsPerPage={this.state.projectsPerPage}
                                totalClients={this.state.projectsList.length}
                                paginate={paginate}
                                next={nextPage}
                                prev={prevPage}
                                pageNo={this.state.pageNo}
                                style={{ position: "fixed", bottom: 2 + "%", right: 5 + "%" }}
                            />}

                        {this.state.searchTerm &&
                            <Pagination
                                clientsPerPage={this.state.projectsPerPageFilter}
                                totalClients={filteredProjects.length}
                                paginate={paginateFilter}
                                next={nextPageFilter}
                                prev={prevPageFilter}
                                pageNo={filteredProjects.length < this.state.pageNoFilter ? filteredProjects.length : this.state.pageNoFilter}
                                style={{ position: "fixed", bottom: 2 + "%", right: 5 + "%" }}
                                numStyle={{ width: '85px', textAlign: 'center' }}
                            />}

                        {this.state.showTerminePagination &&
                            <Pagination
                                clientsPerPage={this.state.projectsPerPageTermine}
                                totalClients={termineProjects.length}
                                paginate={paginateTermine}
                                next={nextPageTermine}
                                prev={prevPageTermine}
                                pageNo={this.state.pageNoTermine}
                                style={{ position: "fixed", bottom: 2 + "%", right: 5 + "%" }}
                            />}

                        {this.state.showEnCoursProjects &&
                            <Pagination
                                clientsPerPage={this.state.projectsPerPageEnCours}
                                totalClients={enCoursProjects.length}
                                paginate={paginateEnCours}
                                next={nextPageEnCours}
                                prev={prevPageEnCours}
                                pageNo={enCoursProjects.length < this.state.pageNoEnCours ? enCoursProjects.length : this.state.pageNoEnCours}
                                style={{ position: "fixed", bottom: 2 + "%", right: 5 + "%" }}
                            />}

                        {this.state.showArchiveProjects &&
                            <Pagination
                                clientsPerPage={this.state.projectsPerPageArchive}
                                totalClients={archiveProjects.length}
                                paginate={paginateArchive}
                                next={nextPageArchive}
                                prev={prevPageArchive}
                                pageNo={archiveProjects.length < this.state.pageNoArchive ? archiveProjects.length : this.state.pageNoArchive}
                                style={{ position: "fixed", bottom: 2 + "%", right: 5 + "%" }}
                            />}

                        {this.state.showFaireProjects &&
                            <Pagination
                                clientsPerPage={this.state.projectsPerPageEnFaire}
                                totalClients={enFaireProjects.length}
                                paginate={paginateEnFaire}
                                next={nextPageEnFaire}
                                prev={prevPageEnFaire}
                                pageNo={enFaireProjects.length < this.state.pageNoEnFaire ? enFaireProjects.length : this.state.pageNoEnFaire}
                                style={{ position: "fixed", bottom: 2 + "%", right: 5 + "%" }}
                            />}
                    </div>

                </div>

            </Auxiliary>
        );
    }
}

export default withRouter(Projects);
