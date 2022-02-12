import React, { Component } from 'react';
import Auxiliary from '../hoc/Auxiliary';
import { Dropdown, Table, Modal } from 'react-bootstrap';
import Axios from 'axios';
import './ProjectDetails.css';
import { FileIcon, defaultStyles } from 'react-file-icon';
//import folder from '../images/folder.png';
//import map from '../images/map.png';
//import point from '../images/point.svg';
//import { PDFReader } from 'reactjs-pdf-reader';
import qs from 'qs';

import Geocode from 'react-geocode';

//import Select, { createFilter } from "react-select";
import { FixedSizeList as List } from "react-window";

import { AutoSuggest } from "react-autosuggestions";

import { villes } from "./villes.js";

import Dropzone from "react-dropzone";

import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ProjectDetails extends Component {

    state={
        first_name: "",
        last_name: "",
        showProjet: true,
        showChantier: false,
        showProtections: false,
        showOptions: false,
        showDocuments: false,
        showLocation: false,
        showDeleteModal: false,
        project: "",
        facture: "",
        lat: "",
        long: "",
        showModal: false,
        id: "",
        accesChantier: "",
        preparationProjet: "",
        planProjet: "",
        client: "",
        addrPrj: "",
        ville: "",
        nomProjet: "",
        complementAddr: "",
        nomResp: "",
        prenomResp: "",
        numeroResp: "",
        typeProjet: "",
        dateLiv: "",
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
        currentStep: 1,
        villeopts: [],
        refDuBeton: "",
        nomComCentrale: "",
        numeroComCentrale: "",
        addrCom: "",
        showPlanMasse: true,
        showPhotosAcces: false,
        showPhotosPreparation: false,
        showPhotosChantier: false,
        showFactures: false,
        planMasse: [],
        photosAcces: [],
        photosPreparation: [],
        photosChantier: [],
        factures: [],
        showFilePlanMasse: false,
        ext: "",
        file: null,
        fileId: "",
        document: "",
        showFilePhotosAcces: false,
        showFilePhotosPreparation: false,
        showFilePhotosChantier: false,
        showFileFactures: false,
        remarques: "",
        showDeleteModalPhotosChantier: false,
        showDeleteModalPhotosAccess: false,
        showDeleteModalPlanMasse: false,
        showDeleteModalPhotosPreparation: false,
        showDeleteModalFileFactures: false,
        created_at: null,
        createdat_timestamp: null
    }

    nextStep = () => {
        console.log(this.state.currentStep);
        this.setState(this.state.currentStep < 4 ? {currentStep: this.state.currentStep + 1} : {currentStep: 4});
        if(this.state.currentStep < 1 || this.state.currentStep > 4){
            return null;
        }else{
            document.getElementsByClassName('step-'+ (this.state.currentStep + 1) )[0].style.display = "block";
            document.getElementsByClassName('step-' + this.state.currentStep)[0].style.display = "none";
            document.getElementById('s-' + this.state.currentStep).disabled = true;
            document.getElementById('s-' + this.state.currentStep).classList.remove('active');
            document.getElementById('s-' + (this.state.currentStep + 1)).disabled = false;
            document.getElementById('s-' + (this.state.currentStep +1)).classList.add('active');
        }
        
    }

    previousStep = () => {
        console.log(this.state.currentStep);
        this.setState(this.state.currentStep < 4 ? {currentStep: this.state.currentStep - 1} : {currentStep: 4});
        if(this.state.currentStep < 1 || this.state.currentStep > 4){
            return null;
        }else{
            document.getElementsByClassName('step-'+ (this.state.currentStep - 1) )[0].style.display = "block";
            document.getElementsByClassName('step-' + this.state.currentStep)[0].style.display = "none";
            document.getElementById('s-' + this.state.currentStep).disabled = true;
            document.getElementById('s-' + this.state.currentStep).classList.remove('active');
            document.getElementById('s-' + (this.state.currentStep - 1)).disabled = false;
            document.getElementById('s-' + (this.state.currentStep -1)).classList.add('active');
        }
        
    }

    componentDidMount(){

        Geocode.setApiKey('');
        Geocode.setLanguage("fr");
        Geocode.setRegion("fr");

// Get latitude & longitude from address.
Geocode.fromAddress(this.state.project.adresse).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      this.setState({lat: lat, long: lng})
      //alert(this.state.long);
    },
    (error) => {
      console.error(error);
    }
);

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
        const projectId = (window.location.href).split('/').pop();
        

        Axios.get(`http://192.168.100.232:3001/project/${projectId}`).then((response) => {
            if (response.data.length > 0) {
                this.setState({
                    project: response.data[0],
                    id: response.data[0].id,
                    client: response.data[0].nom,
                    addrPrj: response.data[0].adresse,
                    ville: response.data[0].id_ville_id,
                    nomProjet: response.data[0].nom,
                    complementAddr: response.data[0].complement_adresse,
                    nomResp: response.data[0].nom_Responsable,
                    prenomResp: response.data[0].prenom_Responsable,
                    numeroResp: response.data[0].numero_Responsable,
                    typeProjet: response.data[0].type_project,
                    dateLiv: response.data[0].dates_Livraison,
                    pentes: response.data[0].pentes,
                    surfEstime: response.data[0].surface_estimee,
                    surfRelle: response.data[0].surface_reelle,
                    charges: response.data[0].charges,
                    volume: response.data[0].volumes,
                    distanceChantier: response.data[0].distance_Chantier_Centrale,
                    nomRespCentrale: response.data[0].nom_Responsable_centrale,
                    numeroContactCentrale: response.data[0].num_Contact_Centrale,
                    cailloux: response.data[0].cailloux,
                    ciment: response.data[0].ciment,
                    teinte: response.data[0].teinte,
                    sable: response.data[0].sable,
                    particularites: response.data[0].particularites_Specifique,
                    vitre: response.data[0].vitre,
                    plante: response.data[0].plante,
                    revetements: response.data[0].revetement,
                    facade: response.data[0].facade,
                    vegetation: response.data[0].vegetation,
                    tapis: response.data[0].tapis,
                    direct: response.data[0].direct,
                    dumper300: response.data[0].dumper_300,
                    dumper500: response.data[0].dumper_500,
                    dumper800: response.data[0].dumper_800,
                    brouette: response.data[0].brouette,
                    accesChantier: response.data[0].Acces_au_chantier,
                    preparationProjet: response.data[0].preparation_Projet,
                    planProjet: response.data[0].plan_Projet,
                    facture: response.data[0].facture.split('/').pop(),
                    refDuBeton: response.data[0].reference_du_beton,
                    remarques: response.data[0].remarques,
                    created_at: response.data[0].created_at,
                    created_timestamp: response.data[0].created_timestamp,
                });
            }
        }  
        );

        var config = {
            method: 'get',
            url: 'http://192.168.100.232:3001/villes',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : ""
        };

        {/*Axios(config)
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
        }); */}

        Axios
        .get(`http://192.168.100.232:3001/plan-masse/${projectId}`)
        .then((response) => {
            // console.log(response.data);
            const data = response.data;
            for(let i = 0; i < data.length; i++){
                this.setState(prevState => ({planMasse: [...prevState.planMasse, data[i]]}));
            }
        });  

        Axios
        .get(`http://192.168.100.232:3001/photo-acces/${projectId}`)
        .then((response) => {
            console.log(response.data);
            const data = response.data;
            for(let i = 0; i < data.length; i++){
                this.setState(prevState => ({photosAcces: [...prevState.photosAcces, response.data[i]]}));
            }
        }); 

        Axios
        .get(`http://192.168.100.232:3001/photos-preparation/${projectId}`)
        .then((response) => {
            // console.log(response.data[0]);
            const data = response.data;
            for(let i = 0; i < data.length; i++){
                this.setState(prevState => ({photosPreparation: [...prevState.photosPreparation, response.data[i]]}));
            }
        }); 

        Axios
        .get(`http://192.168.100.232:3001/photos_chantier/${projectId}`)
        .then((response) => {
            // console.log(response.data[0]);
            const data = response.data;
            for(let i = 0; i < data.length; i++){
                this.setState(prevState => ({photosChantier: [...prevState.photosChantier, response.data[i]]}));
            }
        }); 

        Axios
        .get(`http://192.168.100.232:3001/factures/${projectId}`)
        .then((response) => {
            // console.log(response.data[0]);
            const data = response.data;
            for(let i = 0; i < data.length; i++){
                this.setState(prevState => ({factures: [...prevState.factures, response.data[i]]}));
            }
        }); 

    }

    showFilePlanMasse = (event, file, id) => {
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFilePlanMasse: true});
    }

    hideFilePlanMasse = () => {
        this.setState({showFilePlanMasse: false});
    }

    showFilePhotosAcces = (event, file, id) => {
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFilePhotosAcces: true});
        console.log("docc",this.state.document)
    }

    hideFilePhotosAcces = () => {
        this.setState({showFilePhotosAcces: false});
    }

    showFilePhotosPreparation = (event, file, id) => {
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFilePhotosPreparation: true});
    }

    hideFilePhotosPreparation = () => {
        this.setState({showFilePhotosPreparation: false});
    }

    showFilePhotosChantier = (event, file, id) => {
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFilePhotosChantier: true});
    }

    hideFilePhotosChantier = () => {
        this.setState({showFilePhotosChantier: false});
    }

    showFileFactures = (event, file, id) => {
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFileFactures: true});
    }

    hideFileFactures = () => {
        this.setState({showFileFactures: false});
    }

    showModal = () => {
        this.setState({ showModal: true });
    };


    hideModal = () => {
        this.setState({ showModal: false });
    };

    logout = () => {
        localStorage.removeItem("loginToken");
        //this.props.history.push('/');
        window.location.href = '/';
    }

    showDeleteModalPhotosChantier = () => {
        this.setState({ showDeleteModalPhotosChantier: true });
    };

    hideDeleteModalPhotosChantier = () => {
        this.setState({ showDeleteModalPhotosChantier: false });
    };

    showDeleteModalPhotosAccess = () => {
        this.setState({ showDeleteModalPhotosAccess: true });
    };

    hideDeleteModalPhotosAccess = () => {
        this.setState({ showDeleteModalPhotosAccess: false });
    };

    showDeleteModalPlanMasse = () => {
        this.setState({ showDeleteModalPlanMasse: true });
    };

    hideDeleteModalPlanMasse = () => {
        this.setState({ showDeleteModalPlanMasse: false });
    };

    showDeleteModalPhotosPreparation = () => {
        this.setState({ showDeleteModalPhotosPreparation: true });
    };

    hideDeleteModalPhotosPreparation = () => {
        this.setState({ hideDeleteModalPhotosPreparation: false });
    };

    showDeleteModalFileFactures = () => {
        this.setState({ showDeleteModalFileFactures: true });
    };

    hideDeleteModalFileFactures = () => {
        this.setState({ hideDeleteModalFileFactures: false });
    };

    deletePhotosChantier = (event, id) => {
        var data = qs.stringify({
        'id': this.state.fileId 
        });
        var config = {
        method: 'delete',
        url: 'http://192.168.100.232:3001/delete-photos-chantier',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };
    
        Axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        window.location.reload(false);
        })
        .catch(function (error) {
        console.log(error);
        });
        this.setState({showFilePhotosChantier: false});
        this.setState({showDeleteModalPhotosChantier: false}); 
        
        }

        deletePlanMasse = (event, id) => {
            var data = qs.stringify({
            'id': this.state.fileId 
            });
            var config = {
            method: 'delete',
            url: 'http://192.168.100.232:3001/delete-plan-masse',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
            };
        
            Axios(config)
            .then(function (response) {
            console.log(JSON.stringify(response.data));
            window.location.reload(false);
            })
            .catch(function (error) {
            console.log(error);
            });
            this.setState({showFilePlanMasse: false});
            this.setState({showDeleteModalPlanMasse: false}); 
            }

            deletePhotosAccess = (event, id) => {
                var data = qs.stringify({
                'id': this.state.fileId 
                });
                var config = {
                method: 'delete',
                url: 'http://192.168.100.232:3001/delete-photos-access',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
                };
            
                Axios(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                window.location.reload(false);
                })
                .catch(function (error) {
                console.log(error);
                });
                this.setState({showFilePhotosAcces: false});
                this.setState({showDeleteModalPhotosAccess: false}); 
                }

                deletePhotosPreparation = (event, id) => {
                    var data = qs.stringify({
                    'id': this.state.fileId 
                    });
                    var config = {
                    method: 'delete',
                    url: 'http://192.168.100.232:3001/delete-photos-preparation',
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                    };
                
                    Axios(config)
                    .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    window.location.reload(false);
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                    this.setState({showFilePhotosPreparation: false});
                    this.setState({showDeleteModalPhotosPreparation: false}); 
                    }

                    deleteFileFactures = (event, id) => {
                        var data = qs.stringify({
                        'id': this.state.fileId 
                        });
                        var config = {
                        method: 'delete',
                        url: 'http://192.168.100.232:3001/delete-file-factures',
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data : data
                        };
                    
                        Axios(config)
                        .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        window.location.reload(false);
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                        this.setState({showFileFactures: false});
                        this.setState({showDeleteModalFileFactures: false}); 
                        }
    

    onShowProjet = () => {
        this.setState({
            showProjet: true,
            showChantier: false,
            showProtections: false,
            showOptions: false,
            showDocuments: false,
            showLocation: false
        })
        // document.getElementById('projet').classList.add('active');
        // document.getElementById('chantier').classList.remove('active');
        // document.getElementById('protections').classList.remove('active');
        // document.getElementById('options').classList.remove('active');
        // document.getElementById('documents').classList.remove('active');
        // document.getElementById('location').classList.remove('active');
    }

    onShowChantier = () => {
        this.setState({
            showProjet: false,
            showChantier: true,
            showProtections: false,
            showOptions: false,
            showDocuments: false,
            showLocation: false
        })
        document.getElementById('projet').classList.remove('active');
        // document.getElementById('chantier').classList.add('active');
        // document.getElementById('protections').classList.remove('active');
        // document.getElementById('options').classList.remove('active');
        // document.getElementById('documents').classList.remove('active');
        // document.getElementById('location').classList.remove('active');
    }

    onShowProtections = () => {
        this.setState({
            showProjet: false,
            showChantier: false,
            showProtections: true,
            showOptions: false,
            showDocuments: false,
            showLocation: false
        })
        document.getElementById('projet').classList.remove('active');
        // document.getElementById('chantier').classList.remove('active');
        // document.getElementById('protections').classList.add('active');
        // document.getElementById('options').classList.remove('active');
        // document.getElementById('documents').classList.remove('active');
        // document.getElementById('location').classList.remove('active');
    }

    onShowOptions = () => {
        this.setState({
            showProjet: false,
            showChantier: false,
            showProtections: false,
            showOptions: true,
            showDocuments: false,
            showLocation: false
        })
        document.getElementById('projet').classList.remove('active');
        // document.getElementById('chantier').classList.remove('active');
        // document.getElementById('protections').classList.remove('active');
        // document.getElementById('options').classList.add('active');
        // document.getElementById('documents').classList.remove('active');
        // document.getElementById('location').classList.remove('active');
    }

    onShowDocuments = () => {
        this.setState({
            showProjet: false,
            showChantier: false,
            showProtections: false,
            showOptions: false,
            showDocuments: true,
            showLocation: false
        })
        document.getElementById('projet').classList.remove('active');
        // document.getElementById('chantier').classList.remove('active');
        // document.getElementById('protections').classList.remove('active');
        // document.getElementById('options').classList.remove('active');
        // document.getElementById('documents').classList.add('active');
        // document.getElementById('location').classList.remove('active');
    }

    onShowLocation = () => {
        this.setState({
            showProjet: false,
            showChantier: false,
            showProtections: false,
            showOptions: false,
            showDocuments: false,
            showLocation: true,
            
        })
        document.getElementById('projet').classList.remove('active');
        // document.getElementById('chantier').classList.remove('active');
        // document.getElementById('protections').classList.remove('active');
        // document.getElementById('options').classList.remove('active');
        // document.getElementById('documents').classList.remove('active');
        // document.getElementById('location').classList.add('active');
    }

    onShowPlanMasse = () => {
        this.setState({
            showPlanMasse: true,
            showPhotosAcces: false,
            showPhotosPreparation: false,
            showPhotosChantier: false,
            showFactures: false
        })
    }

    handlePlanMasseDrop = (acceptedFiles, rejectedFiles) => {
        console.log("Accepted Files: ", acceptedFiles);
        console.log("Rejected Files: ", rejectedFiles);
        let formData = new FormData();    //formdata object

        formData.append('idProject', this.state.id);   //append the values with key, value pair
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-plan-masse", formData, config)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        window.location.href = window.location;
      }; 
      

    onShowPhotosAcces = () => {
        this.setState({
            showPlanMasse: false,
            showPhotosAcces: true,
            showPhotosPreparation: false,
            showPhotosChantier: false,
            showFactures: false
        })
        document.getElementById('planMasse').classList.remove('active');
    }

    handlePhotosAccesDrop = (acceptedFiles, rejectedFiles) => {
        console.log("Accepted Files: ", acceptedFiles);
        console.log("Rejected Files: ", rejectedFiles);
        let formData = new FormData();    //formdata object

        formData.append('idProject', this.state.id);   //append the values with key, value pair
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-photos-acces", formData, config)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        window.location.href = window.location;
      }; 

    onShowPhotosPreparation = () => {
        this.setState({
            showPlanMasse: false,
            showPhotosAcces: false,
            showPhotosPreparation: true,
            showPhotosChantier: false,
            showFactures: false
        })
        document.getElementById('planMasse').classList.remove('active');
    }

    handlePhotosPreparationDrop = (acceptedFiles, rejectedFiles) => {
        console.log("Accepted Files: ", acceptedFiles);
        console.log("Rejected Files: ", rejectedFiles);
        let formData = new FormData();    //formdata object

        formData.append('idProject', this.state.id);   //append the values with key, value pair
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-photos-preparation", formData, config)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        window.location.href = window.location;
      }; 

    onShowPhotosChantier = () => {
        this.setState({
            showPlanMasse: false,
            showPhotosAcces: false,
            showPhotosPreparation: false,
            showPhotosChantier: true,
            showFactures: false
        })
        document.getElementById('planMasse').classList.remove('active');
    }

    handlePhotosChantierDrop = (acceptedFiles, rejectedFiles) => {
        console.log("Accepted Files: ", acceptedFiles);
        console.log("Rejected Files: ", rejectedFiles);
        let formData = new FormData();    //formdata object

        formData.append('idProject', this.state.id);   //append the values with key, value pair
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-photos-chantier", formData, config)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        window.location.href = window.location;
      }; 

    onShowFactures = () => {
        this.setState({
            showPlanMasse: false,
            showPhotosAcces: false,
            showPhotosPreparation: false,
            showPhotosChantier: false,
            showFactures: true
        })
        document.getElementById('planMasse').classList.remove('active');
    }

    handleFacturesDrop = (acceptedFiles, rejectedFiles) => {
        console.log("Accepted Files: ", acceptedFiles);
        console.log("Rejected Files: ", rejectedFiles);
        let formData = new FormData();    //formdata object

        formData.append('idProject', this.state.id);   //append the values with key, value pair
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-factures", formData, config)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        window.location.href = window.location;
      }; 


    showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    };

    hideDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    };

    onDeleteProject = (e) => {
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
            'id': this.state.project.id 
            });
            var config = {
                method: 'delete',
                url: 'http://192.168.100.232:3001/delete-project',
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
        console.log(this.state.project.id);
        this.hideDeleteModal();
        this.props.history.push('/projects');
    }

    onFinishProject = (e) => {
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
            'id': this.state.project.id 
            });
            var config = {
                method: 'put',
                url: 'http://192.168.100.232:3001/finish-project',
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
        this.props.history.push('/projects');
    }

    onArchiveProject = (e) => {
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
            'id': this.state.project.id 
            });
            var config = {
                method: 'put',
                url: 'http://192.168.100.232:3001/archive-project',
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
        this.props.history.push('/projects');
    }

    onDearchiveProject = (e) => {
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
            'id': this.state.project.id 
            });
            var config = {
                method: 'put',
                url: 'http://192.168.100.232:3001/dearchive-project',
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
        this.props.history.push('/projects');
    }

    onSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();    //formdata object

        // formData.append('access_au_chantier', this.state.accesChantier);
        // formData.append('preparation_projet', this.state.preparationProjet);
        // formData.append('plan_projet', this.state.planProjet);
        formData.append('client', this.state.client);
        formData.append('nom', this.state.nomProjet);
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
        formData.append('etat_projet', 0);
        formData.append('facture', "");
        formData.append('facture2', "");
        formData.append('protection', "");
        formData.append('type_Beton', 0);
        formData.append('type_Cailloux', 0);
        formData.append('type_Desactivant', 0);
        formData.append('dumper', 0);
        formData.append('adresse', this.state.addrPrj);
        formData.append('created_at', this.state.created_at);
        formData.append('id', this.state.id);
        formData.append('reference_du_beton', this.state.refDuBeton);
        formData.append('nom_com_centrale', this.state.nomComCentrale);
        formData.append('num_com_centrale', this.state.numeroComCentrale);
        formData.append('addr_com_centrale', this.state.addrCom);
        formData.append('remarques', this.state.remarques);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/edit-project" , formData, config)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        this.hideModal();
        this.setState({currentStep: 1});
        this.props.history.push("/projects");
    }

    render() {

        // console.log(this.state.planMasse);

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

            const { project, facture, accesChantier, preparationProjet, planProjet } = this.state;

            let status = "";
            let p = ""; let p2 = "";

            if(project.etat_projet === "0" || project.etat_projet === null){
                status = "En Cours";
                p = <p style={{color: "#FBB245", fontWeight: 500}}>{status}</p>;
                p2 = <p className="mb-0 mr-4" style={{cursor: "pointer", fontWeight: 600, color: "#25283D"}} onClick={this.onFinishProject}>Chantier Terminé</p>;
            }
            else if(project.etat_projet === "1"){
                status = "Terminé";
                p = <p style={{color: "#2ECC71", fontWeight: 500}}>{status}</p>;
                p2 = <p className="mb-0 mr-4" style={{cursor: "pointer", fontWeight: 600, color: "#25283D"}} onClick={this.onArchiveProject}>Archiver Projet</p>;
            }
            else if(project.etat_projet === "2"){
                status = "Archiver";
                p = <p style={{color: "#B84257", fontWeight: 500}}>{status}</p>;
                p2 = <p className="mb-0 mr-4" style={{cursor: "pointer", fontWeight: 600, color: "#347CFF"}} onClick={this.onDearchiveProject}>Désarchiver Projet</p>;
            }
            else if(project.etat_projet === "3"){
                status = "Faire";
                p = <p style={{color: "#347CFF", fontWeight: 500}}>{status}</p>
            }

            const labelStyle = {
                position: "absolute",
                top: 3 + "%",
                left: 4 + "%",
                color: "#B84257", 
                fontSize: 11 + "px", 
                fontWeight: 600
            };

                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(this.state.document)[1];

        return (
            <Auxiliary>
                <Modal show={this.state.showFilePlanMasse} onHide={this.hideFilePlanMasse} className="doc-modal">
                    <Modal.Body>
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a> 
                                <button className="btn p-0" onClick={this.showDeleteModalPlanMasse} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button>
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}><button className="btn p-0" onClick={this.showDeleteModalPhotosChantier} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            <iframe width="100%" height="100%" frameborder="0" src={this.state.document}></iframe>
                        //src={`https://docs.google.com/gview?url=${this.state.document}&embedded=true`}
                        )}

                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalPlanMasse} onHide={this.hideDeleteModalPlanMasse} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalPlanMasse}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deletePlanMasse(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFilePhotosAcces} onHide={this.hideFilePhotosAcces} className="doc-modal">
                    <Modal.Body>
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a> 
                                <button className="btn p-0" onClick={this.showDeleteModalPhotosAccess} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button>
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            //<iframe width="100%" height="100%" frameborder="0" src={`https://docs.google.com/gview?url=${this.state.document}&embedded=true`}></iframe>
                            //oldcode<img src={this.state.document} alt="" style={{width: '50%'}}/>
                            <iframe width="100%" height="100%" frameborder="0" src={this.state.document}></iframe>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalPhotosAccess} onHide={this.hideDeleteModalPhotosAccess} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalPhotosAccess}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deletePhotosAccess(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFilePhotosPreparation} onHide={this.hideFilePhotosPreparation} className="doc-modal">
                    <Modal.Body>
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a>
                                <button className="btn p-0" onClick={this.showDeleteModalPhotosPreparation} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button> 
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            //<iframe width="100%" height="100%" frameborder="0" src={`https://docs.google.com/gview?url=${this.state.document}&embedded=true`}></iframe>
                            <img src={this.state.document} alt="" style={{width: '50%'}}/>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalPhotosPreparation} onHide={this.hideDeleteModalPhotosPreparation} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalPhotosPreparation}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deletePhotosPreparation(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFilePhotosChantier} onHide={this.hideFilePhotosChantier} className="doc-modal">
                    <Modal.Body>
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a>
                                <button className="btn p-0" onClick={this.showDeleteModalPhotosChantier} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button>  
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            //<iframe width="100%" height="100%" frameborder="0" src={`https://docs.google.com/gview?url=${this.state.document}&embedded=true`}></iframe>
                            <img src={this.state.document} alt="" style={{width: '50%'}}/>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalPhotosChantier} onHide={this.hideDeleteModalPhotosChantier} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalPhotosChantier}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deletePhotosChantier(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFileFactures} onHide={this.hideFileFactures} className="doc-modal">
                    <Modal.Body>
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a> 
                                <button className="btn p-0" onClick={this.showDeleteModalFileFactures} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button>  
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            <iframe width="100%" height="100%" frameborder="0" src={`https://docs.google.com/gview?url=${this.state.document}&embedded=true`}></iframe>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalFileFactures} onHide={this.hideDeleteModalFileFactures} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalFileFactures}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deleteFileFactures(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showModal} onHide={this.hideModal}>
                <Modal.Header className="bg-light">
                    <h4><span style={{color: "#B84257", fontWeight: 700}}>+</span> Editer projet</h4>
                </Modal.Header>
                <Modal.Body>
                <div className="modalContainer px-4">
                    <div className="row">
                        <div className="col-md-12 modal-nav">
                            <button type="button" id="s-1" className="btn active">Projet</button>
                            <button type="button" id="s-2" className="btn" disabled>Chantier</button>
                            <button type="button" id="s-3" className="btn" disabled>Protections</button>
                            <button type="button" id="s-4" className="btn" disabled>Options</button>
                        </div>
                    </div>
                    <form>
                        <fieldset className="step step-1">
                                <div className="row pt-4">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="client" placeholder="" value={this.state.client} onChange={(e) => this.setState({client: e.target.value})} />
                                            <label htmlFor="client" className="formLabel">{'Client'}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="adress" placeholder="" value={this.state.addrPrj} onChange={(e) => this.setState({addrPrj: e.target.value})} />
                                            <label htmlFor="adress" className="formLabel">{'Adresse du chantier'}</label>
                                        </div>
                                        <div className="form-group postal-code position-relative mb-3">
                                            {/* <label htmlFor="ville" style={labelStyle}>Ville</label> */}
                                            <AutoSuggest
                                            options={villes}
                                            handleChange={(e) => this.setState({ville: e})}
                                            value={this.state.ville}
                                            name="Code Postal"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="projectName" placeholder="" value={this.state.nomProjet} onChange={(e) => this.setState({nomProjet: e.target.value})} />
                                            <label htmlFor="projectName" className="formLabel">{'Référence du chantier'}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="addr" placeholder="" value={this.state.complementAddr} onChange={(e) => this.setState({complementAddr: e.target.value})} />
                                            <label htmlFor="addr" className="formLabel">{"Complément d'adresse"}</label>
                                        </div>
                                    </div>
                                </div>
                                <hr style={{opacity: 1, backgroundColor: "#F5F6F8"}} />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="responsibleName" placeholder="" value={this.state.nomResp} onChange={(e) => this.setState({nomResp: e.target.value})} />
                                            <label htmlFor="responsibleName" className="formLabel">{"Nom du responsable"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="responsibleNumber" placeholder="" value={this.state.numeroResp} onChange={(e) => this.setState({numeroResp: e.target.value})} />
                                            <label htmlFor="responsibleNumber" className="formLabel">{"Téléphone du responsable"}</label>
                                        </div>
                                        {/* <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="projectType" placeholder="" value={this.state.typeProjet} onChange={(e) => this.setState({typeProjet: e.target.value})} />
                                            <label htmlFor="projectType" className="formLabel">{this.state.typeProjet === '' ? "Type du projet" : ''}</label>
                                        </div> */}
                                    </div>
                                    <div className="col-md-6 d-flex flex-column justify-content-between">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="responsibleSurname" placeholder="" value={this.state.prenomResp} onChange={(e) => this.setState({prenomResp: e.target.value})} />
                                            <label htmlFor="responsibleSurname" className="formLabel">{"Prénom du responsable"}</label>
                                        </div>
                                        <div className="form-group date position-relative mb-3">
                                            <label htmlFor="date" style={labelStyle}>Entre le</label>
                                            <input type="date" className="form-control bg-light border-0 pl-4 pt-3" id="date" placeholder="Date du chantier" defaultValue={this.state.created_at && this.state.created_at.split("/").join("/").slice(0, 10)} onChange={(e) => this.setState({created_at: e.target.value})}/>
                                        </div>
                                        <div className="form-group date position-relative mb-3">
                                            <label htmlFor="date" style={labelStyle}>Et le</label>
                                            <input type="date" className="form-control bg-light border-0 pl-4 pt-3" id="date" placeholder="Date de livraison" defaultValue={this.state.dateLiv && this.state.dateLiv.split("/").join("/").slice(0, 10)} onChange={(e) => this.setState({dateLiv: e.target.value})}/>
                                        </div>
                                    </div>
                                </div>
                        </fieldset>
                        <fieldset className="step step-2">
                                <div className="row pt-4">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            {/* <input type="text" className="form-control formControl bg-light border-0" id="pentes" placeholder="" onChange={(e) => this.setState({pentes: e.target.value})} /> */}
                                            <select className="form-control formControl bg-light border-0" id="pentes" onChange={(e) => this.setState({pentes: e.target.value})}>
                                                <option value=""></option>
                                                <option value="Faible">Faible</option>
                                                <option value="Moyenne">Moyenne</option>
                                                <option value="Forte">Forte</option>
                                            </select>
                                            <label htmlFor="pentes" className="formLabel">{"Pente"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="surfRelle" placeholder="" onChange={(e) => this.setState({surfRelle: e.target.value})} />
                                            <label htmlFor="surfRelle" className="formLabel">{"Surface réelle (m2)"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="volume" placeholder="" onChange={(e) => this.setState({volume: e.target.value})} />
                                            <label htmlFor="volume" className="formLabel">{"Volume (m3) comprenant 10% de perte"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nomResCentrale" placeholder="" onChange={(e) => this.setState({nomRespCentrale: e.target.value})} />
                                                <label htmlFor="nomResCentrale" className="formLabel">{"Nom de la centrale"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="nrContCentrale" placeholder="" onChange={(e) => this.setState({numeroContactCentrale: e.target.value})} />
                                            <label htmlFor="nrContCentrale" className="formLabel">{"Téléphone / Centrale"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nomComCentrale" placeholder="" onChange={(e) => this.setState({nomComCentrale: e.target.value})} />
                                                <label htmlFor="nomComCentrale" className="formLabel">{"Commercial de la centrale"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="nrComCentrale" placeholder="" onChange={(e) => this.setState({numeroComCentrale: e.target.value})} />
                                            <label htmlFor="nrComCentrale" className="formLabel">{"Téléphone / Commercial"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <select className="form-control formControl bg-light border-0" id="projectType" onChange={(e) => this.setState({typeProjet: e.target.value})}>
                                                <option value=""></option>
                                                <option value="Béton Désactivé">Béton Désactivé</option>
                                                <option value="Drainant">Drainant</option>
                                                <option value="Drainant Désactivé">Drainant Désactivé</option>
                                                <option value="Béton lissé main">Béton lissé main</option>
                                                <option value="Béton Balayé">Béton Balayé</option>
                                            </select>
                                            {/* <input type="text" className="form-control formControl bg-light border-0" id="projectType" placeholder="" onChange={(e) => this.setState({typeProjet: e.target.value})} /> */}
                                            <label htmlFor="projectType" className="formLabel">{"Type de projet"}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="surfEstime" placeholder="" onChange={(e) => this.setState({surfEstime: e.target.value})} />
                                            <label htmlFor="surfEstime" className="formLabel">{"Surface (m2)"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="charges" placeholder="" onChange={(e) => this.setState({charges: e.target.value})} />
                                            <label htmlFor="charges" className="formLabel">{"Charge (cm)"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="distance" placeholder="" onChange={(e) => this.setState({distanceChantier: e.target.value})} />
                                            <label htmlFor="distance" className="formLabel">{"Distance chantier-Centrale"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="adrCentrale" placeholder="" onChange={(e) => this.setState({addrCentrale: e.target.value})} />
                                            <label htmlFor="adrCentrale" className="formLabel">{"Mail / centrale"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" placeholder="" style={{visibility: 'hidden'}}/>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="adrCom" placeholder="" onChange={(e) => this.setState({addrCom: e.target.value})} />
                                            <label htmlFor="adrCom" className="formLabel">{"Mail / Commercial"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" placeholder="" style={{visibility: 'hidden'}}/>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="refBeton" placeholder="" onChange={(e) => this.setState({refDuBeton: e.target.value})} />
                                            <label htmlFor="refBeton" className="formLabel">{"Référence du beton"}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="cailloux" placeholder="" onChange={(e) => this.setState({cailloux: e.target.value})} />
                                            <label htmlFor="cailloux" className="formLabel">{"Cailloux"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="teinte" placeholder="" onChange={(e) => this.setState({teinte: e.target.value})} />
                                            <label htmlFor="teinte" className="formLabel">{"Teinte"}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="ciment" placeholder="" onChange={(e) => this.setState({ciment: e.target.value})} />
                                            <label htmlFor="ciment" className="formLabel">{"Ciment"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <select className="form-control formControl bg-light border-0" id="pentes" onChange={(e) => this.setState({sable: e.target.value})}>
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
                                                <input style={{display: 'none'}} type="file" name="access_au_chantier" id="acces" placeholder="" onChange={(e) => this.setState({accesChantier: e.target.files[0]})} />
                                            </button>
                                            <label htmlFor="acces" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{"Accès au chantier"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <button className="form-control formControl bg-light border-0" disabled>
                                                <input style={{display: 'none'}} type="file"  id="plan" placeholder="" onChange={(e) => this.setState({planProjet: e.target.files[0]})} />
                                            </button>
                                            <label htmlFor="plan" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{"Plan du chantier"}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <button className="form-control formControl bg-light border-0" disabled>
                                                <input style={{display: 'none'}} type="file"  id="preparation" placeholder="" onChange={(e) => this.setState({preparationProjet: e.target.files[0]})} />
                                            </button>
                                            <label htmlFor="preparation" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{"Préparation du chantier"}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                    <div className="form-group form-group position-relative mb-3">
                                        <textarea className="form-control formControl bg-light border-0" id="remarques" rows="3" placeholder="" value={this.state.remarques} onChange={(e) => this.setState({remarques: e.target.value})}></textarea>
                                        <label htmlFor="remarques" className="formLabel">{"Remarques"}</label>
                                    </div>
                                    </div>
                                </div>
                        </fieldset>
                        <fieldset className="step step-3">
                                <div className="row pt-4 px-4">
                                    <div className="col-md-12 d-flex justify-content-between">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="vitre" defaultChecked={this.state.vitre} onChange={() => this.setState({vitre: this.state.vitre == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="vitre">Vitres</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="plante" defaultChecked={this.state.plante} onChange={() => this.setState({plante: this.state.plante == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="plante">Plantes</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="revetements" defaultChecked={this.state.revetements} onChange={() => this.setState({revetements: this.state.revetements == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="revetements">Revêtements</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="facade" defaultChecked={this.state.facade} onChange={() => this.setState({facade: this.state.facade == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="facade">Façades</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="vegetation" defaultChecked={this.state.vegetation} onChange={() => this.setState({vegetation: this.state.vegetation == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="vegetation">Végétation</label>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row pt-4">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="cailloux" placeholder="" value={this.state.cailloux} onChange={(e) => this.setState({cailloux: e.target.value})} />
                                            <label htmlFor="cailloux" className="formLabel">{this.state.cailloux === '' ? "Cailloux" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="teinte" placeholder="" value={this.state.teinte} onChange={(e) => this.setState({teinte: e.target.value})} />
                                            <label htmlFor="teinte" className="formLabel">{this.state.teinte === '' ? "Teinte" : ''}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="ciment" placeholder="" value={this.state.ciment} onChange={(e) => this.setState({ciment: e.target.value})} />
                                            <label htmlFor="ciment" className="formLabel">{this.state.ciment === '' ? "Ciment" : ''}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="sable" placeholder="" value={this.state.sable} onChange={(e) => this.setState({sable: e.target.value})} />
                                            <label htmlFor="sable" className="formLabel">{this.state.sable === '' ? "Sable" : ''}</label>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="form-group form-group position-relative mb-3">
                                        <textarea className="form-control formControl bg-light border-0" id="particularites" rows="3" placeholder="" value={this.state.particularites} onChange={(e) => this.setState({particularites: e.target.value})}></textarea>
                                        <label htmlFor="particularites" className="formLabel">{"Particularites Specifique"}</label>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <button className="form-control formControl bg-light border-0" disabled>
                                                <input type="file" name="access_au_chantier" id="acces" placeholder="" onChange={(e) => this.setState({accesChantier: e.target.files[0]})} />
                                            </button>
                                            <label htmlFor="acces" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{this.state.accesChantier === '' ? "Accès au chantier" : this.state.accesChantier}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <button className="form-control formControl bg-light border-0" disabled>
                                                <input type="file"  id="plan" placeholder="" onChange={(e) => this.setState({planProjet: e.target.files[0]})} />
                                            </button>
                                            <label htmlFor="plan" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{this.state.planProjet === '' ? "Plan du projet" : this.state.planProjet}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <button className="form-control formControl bg-light border-0" disabled>
                                                <input type="file"  id="preparation" placeholder="" onChange={(e) => this.setState({preparationProjet: e.target.files[0]})} />
                                            </button>
                                            <label htmlFor="preparation" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{this.state.preparationProjet === '' ? "Preparation Projet" : this.state.preparationProjet}</label>
                                        </div>
                                    </div>
                                </div> */}
                        </fieldset>
                        <fieldset className="step step-4">
                                <div className="row pt-4 px-4">
                                    <div className="col-md-12 d-flex flex-column justify-content-between">
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="pompe" defaultChecked={this.state.pompe} onChange={() => this.setState({pompe: 1})} />
                                            <label className="form-check-label" htmlFor="pompe">Pompe</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="tapis" defaultChecked={this.state.tapis} onChange={() => this.setState({tapis: this.state.tapis == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="tapis">Tapis</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="direct" defaultChecked={this.state.direct} onChange={() => this.setState({direct: this.state.direct == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="direct">Direct</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="dumper3" defaultChecked={this.state.dumper300} onChange={() => this.setState({dumper300: this.state.dumper300 == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="dumper3">Dumper 300</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="dumper5" defaultChecked={this.state.dumper500} onChange={() => this.setState({dumper500: this.state.dumper500 == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="dumper5">Dumper 500</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="dumper8" defaultChecked={this.state.dumper800} onChange={() => this.setState({dumper800: this.state.dumper800 == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="dumper8">Dumper 800</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <p className="my-4" style={{color: "#BBC9DC", fontWeight: 500}}>Option:</p>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="brouette" defaultChecked={this.state.brouette} onChange={() => this.setState({brouette: this.state.brouette == 0 ? 1 : 0})} />
                                            <label className="form-check-label" htmlFor="brouette">Brouette</label>
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
                    {this.state.currentStep === 1 ? '' : <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.state.currentStep === 4 ? this.onSubmit : this.previousStep}>{"Précédent"}</button>}
                    <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.state.currentStep === 4 ? this.onSubmit : this.nextStep}>{this.state.currentStep === 4 ? 'Valider' : "Suivant"}</button>
                </Modal.Footer>
            </Modal>
                <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteModal} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le Projet</h5>
                        <p>Êtes-vous sûr de vouloir supprimer ce projet?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModal}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} onClick={this.onDeleteProject}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <div className="main">
                    <div className="container">
                        <div className="row pt-4 pb-3">
                            <div className="col-md-10">
                                <h2>Projet</h2>
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
                            <div className="col-md-9">
                                <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.showModal}>Modifier l'évènement</button>
                            </div>
                            <div className="col-md-3 d-flex align-items-center btns" style={{justifyContent: 'flex-end'}}>      
                        
                                    {p2}
                                    <p 
                                    className="m-0" 
                                    style={{cursor: "pointer", fontWeight: 600, color: "#B84257"}}
                                    onClick={this.showDeleteModal}>
                                        Supprimer Projet
                                    </p>
                            </div>
                        </div>
                    </div>
                    <div className="container py-5">
                        <div className="row">
                        <div className="col-md-3">
                            <div className="card rounded-3 border-0 p-0" style={{height: '370px'}}>
                                <div className="card-header bg-white d-flex justify-content-between" style={{borderColor: "#F5F6F8"}}>
                                <p className="m-0" style={{color:" #5C677B", fontWeight: 600}}>Projet {project.id}</p>
                                <p 
                                className="m-0" 
                                style={{cursor: 'pointer', color: "#347CFF", fontWeight: 500, textDecoration: 'none'}}
                                onClick={this.showModal}>
                                    Modifier
                                </p>
                                </div>
                                <div className="card-body">
                                    <div className="card-item d-flex flex-row justify-content-between">
                                        <p style={{color: "#5C677B"}}>Statut</p>
                                        {p}
                                    </div>
                                    <div className="card-item d-flex flex-row justify-content-between">
                                        <p style={{color: "#5C677B"}}>Date</p>
                                        <p style={{color: "#2D527C", fontWeight: 500}}>{project.created_at && project.created_at.split("-").join("/").slice(0, 10)}</p>
                                    </div>
                                    <div className="card-item d-flex flex-row justify-content-between">
                                        <p className="m-0" style={{color: "#5C677B"}}>Client</p>
                                        <p className="m-0" style={{color: "#2D527C", fontWeight: 500}}>{project.client}</p>
                                    </div>
                                </div>
                            </div>    
                        </div>
                        <div className="col-md-8 ml-auto" >
                            <div className="row pb-4">
                                <div className="col-md-12 modal-nav project-nav" style={{borderColor: '#fff'}}>
                                    <button type="button" className="btn active" id="projet" onClick={this.onShowProjet}>Projet</button>
                                    <button type="button" className="btn" id="chantier" onClick={this.onShowChantier}>Chantier</button>
                                    <button type="button" className="btn" id="protections" onClick={this.onShowProtections}>Protections</button>
                                    <button type="button" className="btn" id="options" onClick={this.onShowOptions}>Options</button>
                                    <button type="button" className="btn" id="documents" onClick={this.onShowDocuments}>Dossiers</button>
                                    <button type="button" className="btn" id="locations" onClick={this.onShowLocation}>Localisation</button>
                                </div>
                            </div>

                            {this.state.showProjet && 
                            
                            (<div className="card projet-card rounded-3 border-0 p-3 my-4 position-relative" style={{height: 'auto'}}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Client</p>
                                            <p>{project.nom}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Référence du chantier</p>
                                            <p>{project.nom}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Adresse du chantier</p>
                                            <p>{project.adresse}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Complément d’adresse</p>
                                            <p>{project.complement_adresse}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Ville</p>
                                            <p>{project.id_ville_id}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Nom du responsable</p>
                                            <p>{project.nom_Responsable}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Prénom du responsable</p>
                                            <p>{project.prenom_Responsable}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Téléphone du responsable</p>
                                            <p>{project.numero_Responsable}</p>
                                        </div>
                                        {/* <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Type de projet</p>
                                            <p>{project.type_project}</p>
                                        </div> */}
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Date d'enregistrement</p>
                                            <p>{project.created_timestamp && project.created_timestamp.split("-").join("/").slice(0, 10)}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Et le</p>
                                            <p>{project.created_at && project.created_at.split("-").join("/").slice(0, 10)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                            }

                            {this.state.showChantier && 
                            
                            (<div className="card chantier-card rounded-3 border-0 p-3 my-4 position-relative" style={{height: 'auto'}}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Pente</p>
                                            <p>{project.pentes}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Surface Réelle</p>
                                            <p>{project.surface_reelle}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Volume (m3) comprenant 10% de perte</p>
                                            <p>{project.volumes && project.volumes.toFixed(2)}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Nom du Contact a la Centrale</p>
                                            <p>{project.nom_Responsable_centrale}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Cailloux</p>
                                            <p>{project.cailloux}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Teinte</p>
                                            <p>{project.teinte}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Type de projet</p>
                                            <p>{project.type_project}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Référence du beton</p>
                                            <p>{project.reference_du_beton || ""}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Surface Estimée</p>
                                            <p>{project.surface_estimee}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Charge</p>
                                            <p>{project.charges}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Distance Chantier Centrale</p>
                                            <p>{project.distance_Chantier_Centrale}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Numero du Contact a la Centrale</p>
                                            <p>{project.num_Contact_Centrale}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Ciment</p>
                                            <p>{project.ciment}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Sable</p>
                                            <p>{project.sable}</p>
                                        </div>
                                        <div className="info-group d-flex flex-column mb-2">
                                            <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Type de Beton</p>
                                            <p>{project.type_Beton}</p>
                                        </div>
                                    </div>
                                    <div className="row pt-4">
                                        <div className="col-md-6">
                                            <div className="info-group d-flex flex-column mb-2">
                                                <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Remarques</p>
                                                <p>{project.remarques || ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                            }

                            {this.state.showProtections && 
                            
                            (<div className="card protections-card rounded-3 border-0 p-3 my-4 position-relative" style={{height: 'auto'}}>
                                <p className="mb-0" style={{color: "#B84257", fontWeight: 600}}>Protections</p>
                                <div className="row p-3">
                                    <Table striped>
                                        <tbody>
                                            <tr>
                                                <td className="py-1">Vitres</td>
                                                <td className="text-right py-1">{project.vitre === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Façades</td>
                                                <td className="text-right py-1">{project.facade === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Plantes</td>
                                                <td className="text-right py-1">{project.plante === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Végétation</td>
                                                <td className="text-right py-1">{project.vegetation === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Revêtements</td>
                                                <td className="text-right py-1">{project.revetement === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <div className="row pt-4">
                                        <div className="col-md-6">
                                            <div className="info-group d-flex flex-column mb-2">
                                                <p className="mb-1" style={{color: "#B84257", fontWeight: 600}}>Particularites Specifique</p>
                                                <p>{project.particularites_Specifique || ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>)
                            }

                            {this.state.showOptions && 
                            
                            (<div className="card options-card rounded-3 border-0 p-3 my-4 position-relative" style={{height: 'auto'}}>
                                <div className="row p-3">
                                    <Table striped>
                                        <tbody>
                                            <tr>
                                                <td className="py-1">Pompe</td>
                                                <td className="text-right py-1"><i className="fas fa-check-circle"/></td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Dumper 300</td>
                                                <td className="text-right py-1">{project.dumper_300 === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Dumper 500</td>
                                                <td className="text-right py-1">{project.dumper_500 === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Dumper 800</td>
                                                <td className="text-right py-1">{project.dumper_800 === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Tapis</td>
                                                <td className="text-right py-1">{project.tapis === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Direct</td>
                                                <td className="text-right py-1">{project.direct === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Brouette</td>
                                                <td className="text-right py-1">{project.brouette === 1 ? <i className="fas fa-check-circle check"/> : <i className="fas fa-times-circle cross"/>}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>)
                            }

                            {this.state.showDocuments && 
                            
                            (<div className="card documents-card rounded-3 border-0 p-3 my-4 position-relative" style={{height: 'auto'}}>
                                <div className="row px-4 pb-5">
                                    {/* <p className="mb-4" style={{color: "#25283D", fontWeight: 700, fontSize: '18px'}}>Fichers</p>
                                    <div className="col-md-6 d-flex justify-content-between">
                                        {facture && <FileIcon extension={facture.split('.').pop()} {...defaultStyles.pdf} />}
                                        {accesChantier && <FileIcon extension={accesChantier.split('.').pop()} {...defaultStyles.pdf} />}
                                        {preparationProjet && <FileIcon extension={preparationProjet.split('.').pop()} {...defaultStyles.pdf} />}
                                        {planProjet && <FileIcon extension={planProjet.split('.').pop()} {...defaultStyles.pdf} />}
                                        
                                    </div> */}
                                    <div className="col-md-12 modal-nav project-nav" style={{borderColor: '#fff'}}>
                                        <button type="button" className="btn active" id="planMasse" onClick={this.onShowPlanMasse}>Plan Masse</button>
                                        <button type="button" className="btn" id="photosAcces" onClick={this.onShowPhotosAcces}>Photos Accès</button>
                                        <button type="button" className="btn" id="photosPreparation" onClick={this.onShowPhotosPreparation}>Photos Préparation</button>
                                        <button type="button" className="btn" id="photosChantier" onClick={this.onShowPhotosChantier}>Photos Chantier</button>
                                        <button type="button" className="btn" id="factures" onClick={this.onShowFactures}>Factures</button>
                                    </div>
                                    {this.state.showPlanMasse && (
                                        <div className="col-md-12 pt-5">
                                            <div className="row">
                                                <p>Formats acceptés: .pdf, .doc, .docx, .xls, .xlsx</p>
                                                <div className="col-md-2 mt-3">
                                                    <Dropzone onDrop={this.handlePlanMasseDrop}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <div className="add">
                                                                <label htmlFor="upload">
                                                                    <div className="text"> 
                                                                        <span>+</span>
                                                                        <br />
                                                                        Ajouter
                                                                    </div>
                                                                </label>
                                                        </div>
                                                        </div>
                                                        </section>
                                                    )}
                                                    </Dropzone>
                                                </div>
                                                {this.state.planMasse && this.state.planMasse.map((plan) => (
                                                    
                                                    <div className="col-md-2">
                                                        {plan &&

                                                        <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePlanMasse(e, plan.fichier, plan.id)
                                                        }}>
                                                            {(plan.fichier.split('.').pop() === "png" || plan.fichier.split('.').pop() === "jpg") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.png} />}
                                                            {(plan.fichier.split('.').pop() === "pdf") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(plan.fichier.split('.').pop() === "doc" || plan.fichier.split('.').pop() === "docx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.docx} />}
                                                            {(plan.fichier.split('.').pop() === "xls" || plan.fichier.split('.').pop() === "xlsx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.xlsx} />}
                                                        {plan.fichier}</button>

                                                        }
                                                    </div>

                                                )
                                                )}
                                                <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePlanMasse(e, this.state.planProjet, this.state.planProjet)
                                                        }}>
                                                            {(this.state.planProjet.split('.').pop() === "png" || this.state.planProjet.split('.').pop() === "jpg" || this.state.planProjet.split('.').pop() === "jpeg") && <FileIcon key={this.state.planProjet} link={this.state.planProjet} extension={this.state.planProjet.split('.').pop()} {...defaultStyles.png} />}
                                                            {(this.state.planProjet.split('.').pop() === "pdf") && <FileIcon key={this.state.planProjet} link={this.state.planProjet} extension={this.state.planProjet.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(this.state.planProjet.split('.').pop() === "xlsx" || this.state.planProjet.split('.').pop() === "xlsx") && <FileIcon key={this.state.planProjet} link={this.state.planProjet} extension={this.state.planProjet.split('.').pop()} {...defaultStyles.xlsx} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.showPhotosAcces && (
                                        <div className="col-md-12 pt-5">
                                            <div className="row">
                                            <p>Formats acceptés: .png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx</p>
                                                <div className="col-md-2 mt-3">
                                                    <Dropzone onDrop={this.handlePhotosAccesDrop}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <div className="add">
                                                                <label htmlFor="upload">
                                                                    <div className="text"> 
                                                                        <span>+</span>
                                                                        <br />
                                                                        Ajouter
                                                                    </div>
                                                                </label>
                                                        </div>
                                                        </div>
                                                        </section>
                                                    )}
                                                    </Dropzone>
                                                </div>
                                                {this.state.photosAcces && this.state.photosAcces.map((plan) => (
                                                    <div className="col-md-2">
                                                        {plan &&

                                                        <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePhotosAcces(e, plan.fichier, plan.id)
                                                        }}>
                                                            {(plan.fichier.split('.').pop() === "png" || plan.fichier.split('.').pop() === "jpg" || plan.fichier.split('.').pop() === "jpeg") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.png} />}
                                                            {(plan.fichier.split('.').pop() === "pdf") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(plan.fichier.split('.').pop() === "doc" || plan.fichier.split('.').pop() === "docx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.docx} />}
                                                            {(plan.fichier.split('.').pop() === "xlsx" || plan.fichier.split('.').pop() === "xlsx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.xlsx} />}
                                                            {plan.fichier}</button>

                                                        }
                                                    </div>
                                                )
                                                )}
                                                <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePhotosAcces(e, this.state.accesChantier, this.state.accesChantier)
                                                        }}>
                                                            {(this.state.accesChantier.split('.').pop() === "png" || this.state.accesChantier.split('.').pop() === "jpg" || this.state.accesChantier.split('.').pop() === "jpeg") && <FileIcon key={this.state.accesChantier} link={this.state.accesChantier} extension={this.state.accesChantier.split('.').pop()} {...defaultStyles.png} />}
                                                            {(this.state.accesChantier.split('.').pop() === "pdf") && <FileIcon key={this.state.accesChantier} link={this.state.accesChantier} extension={this.state.accesChantier.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(this.state.accesChantier.split('.').pop() === "xlsx" || this.state.accesChantier.split('.').pop() === "xlsx") && <FileIcon key={this.state.accesChantier} link={this.state.accesChantier} extension={this.state.accesChantier.split('.').pop()} {...defaultStyles.xlsx} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.showPhotosPreparation && (
                                        <div className="col-md-12 pt-5">
                                            <div className="row">
                                            <p>Formats acceptés: .png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx</p>
                                                <div className="col-md-2 mt-3">
                                                    <Dropzone onDrop={this.handlePhotosPreparationDrop}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <div className="add">
                                                                <label htmlFor="upload">
                                                                    <div className="text"> 
                                                                        <span>+</span>
                                                                        <br />
                                                                        Ajouter
                                                                    </div>
                                                                </label>
                                                        </div>
                                                        </div>
                                                        </section>
                                                    )}
                                                    </Dropzone>
                                                </div>
                                                {this.state.photosPreparation && this.state.photosPreparation.map((plan) => (
                                                    <div className="col-md-2">
                                                        {plan &&

                                                        <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePhotosPreparation(e, plan.fichier, plan.id)
                                                        }}>
                                                            {(plan.fichier.split('.').pop() === "png" || plan.fichier.split('.').pop() === "jpg") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.png} />}
                                                            {(plan.fichier.split('.').pop() === "pdf") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(plan.fichier.split('.').pop() === "doc" || plan.fichier.split('.').pop() === "docx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.docx} />}
                                                            {(plan.fichier.split('.').pop() === "xlsx" || plan.fichier.split('.').pop() === "xlsx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.xlsx} />}
                                                            {plan.fichier}</button>

                                                        }
                                                    </div>
                                                )
                                                )}
                                                <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePhotosPreparation(e, this.state.preparationProjet, this.state.preparationProjet)
                                                        }}>
                                                            {(this.state.preparationProjet.split('.').pop() === "png" || this.state.preparationProjet.split('.').pop() === "jpg" || this.state.preparationProjet.split('.').pop() === "jpeg") && <FileIcon key={this.state.preparationProjet} link={this.state.preparationProjet} extension={this.state.preparationProjet.split('.').pop()} {...defaultStyles.png} />}
                                                            {(this.state.preparationProjet.split('.').pop() === "pdf") && <FileIcon key={this.state.preparationProjet} link={this.state.preparationProjet} extension={this.state.preparationProjet.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(this.state.preparationProjet.split('.').pop() === "xlsx" || this.state.preparationProjet.split('.').pop() === "xlsx") && <FileIcon key={this.state.preparationProjet} link={this.state.preparationProjet} extension={this.state.preparationProjet.split('.').pop()} {...defaultStyles.xlsx} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.showPhotosChantier && (
                                        <div className="col-md-12 pt-5">
                                            <div className="row">
                                            <p>Formats acceptés: .png, .jpg, .pdf, .doc, .docx, .xls, .xlsx</p>
                                                <div className="col-md-2 mt-3">
                                                    <Dropzone onDrop={this.handlePhotosChantierDrop}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <div className="add">
                                                                <label htmlFor="upload">
                                                                    <div className="text"> 
                                                                        <span>+</span>
                                                                        <br />
                                                                        Ajouter
                                                                    </div>
                                                                </label>
                                                        </div>
                                                        </div>
                                                        </section>
                                                    )}
                                                    </Dropzone>
                                                </div>
                                                {this.state.photosChantier && this.state.photosChantier.map((plan) => (
                                                    <div className="col-md-2">
                                                        {plan &&

                                                        <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFilePhotosChantier(e, plan.fichier, plan.id)
                                                        }}>
                                                            {(plan.fichier.split('.').pop() === "png" || plan.fichier.split('.').pop() === "jpg") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.png} />}
                                                            {(plan.fichier.split('.').pop() === "pdf") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(plan.fichier.split('.').pop() === "doc" || plan.fichier.split('.').pop() === "docx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.docx} />}
                                                            {(plan.fichier.split('.').pop() === "xlsx" || plan.fichier.split('.').pop() === "xlsx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.xlsx} />}
                                                            {plan.fichier}</button>

                                                        }
                                                    </div>
                                                )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {this.state.showFactures && (
                                        <div className="col-md-12 pt-5">
                                            <div className="row">
                                            <p>Formats acceptés: .pdf, .doc, .docx, .xls, .xlsx</p>
                                                <div className="col-md-2 mt-3">
                                                    <Dropzone onDrop={this.handleFacturesDrop}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <div className="add">
                                                                <label htmlFor="upload">
                                                                    <div className="text"> 
                                                                        <span>+</span>
                                                                        <br />
                                                                        Ajouter
                                                                    </div>
                                                                </label>
                                                        </div>
                                                        </div>
                                                        </section>
                                                    )}
                                                    </Dropzone>
                                                </div>
                                                {this.state.factures && this.state.factures.map((plan) => (
                                                    <div className="col-md-2">
                                                        {plan &&

                                                        <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                                        this.showFileFactures(e, plan.fichier, plan.id)
                                                        }}>
                                                            {(plan.fichier.split('.').pop() === "png" || plan.fichier.split('.').pop() === "jpg") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.png} />}
                                                            {(plan.fichier.split('.').pop() === "pdf") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.pdf} />}
                                                            {(plan.fichier.split('.').pop() === "doc" || plan.fichier.split('.').pop() === "docx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.docx} />}
                                                            {(plan.fichier.split('.').pop() === "xlsx" || plan.fichier.split('.').pop() === "xlsx") && <FileIcon key={plan.id} link={plan.fichier} extension={plan.fichier.split('.').pop()} {...defaultStyles.xlsx} />}
                                                            {plan.fichier}</button>

                                                        }
                                                    </div>
                                                )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>)
                            }

                            {this.state.showLocation && 
                            
                            (<div className="card location-card rounded-3 border-0  my-4 position-relative" style={{height: 'auto'}}>
                                <div className="row p-3 bg-white" >
                                    <div className="form-group position-relative p-0 mb-0">
                                            <label htmlFor="address" style={labelStyle}>Address Details</label>
                                            <input id="address" className="form-control bg-light border-0 pl-4 pt-3" value={project.adresse} disabled />
                                    </div>
                                </div>
                                {/* <img src={map} alt="map" />
                                <img src={point} alt="point" style={{position: 'absolute', top: '51%', left: '27%'}} /> */}
                                <div className="row" style={{minHeight: '150px'}}>

    {/*<Map
        className="map"
        google={this.props.google}
        style={{ height: "100%", position: "relative", width: "100%" }}
        zoom={8}
        initialCenter={{
            lat: this.state.lat,
            lng: this.state.long
        }}
      >
    </Map>*/}

 <iframe width="640" height="480" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src={`https://maps.google.it/maps?q=${this.state.project.adresse}&output=embed`} id="embedLink"></iframe>
    
                                </div>
                                
                            </div>)
                            }
                        </div>
                        </div>
                    </div>
                </div>
            </Auxiliary>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ""
})(ProjectDetails);
