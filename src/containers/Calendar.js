import React, { Component} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import frLocale from "@fullcalendar/core/locales/fr";

import Auxiliary from '../hoc/Auxiliary';
import { Modal } from 'react-bootstrap';

import $, { data } from 'jquery';

import Axios from 'axios';

import { Dropdown } from 'react-bootstrap';
import Loader from "../components/LoaderSpinner";

import './Calendar.css';

// must manually import the stylesheets for each plugin
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import Select, { createFilter } from "react-select";
import { FixedSizeList as List } from "react-window";

import { AutoSuggest } from "react-autosuggestions";

import { withRouter } from 'react-router-dom';

import { villes } from "./villes.js";

import villesFr from "./villesFrance.json";

import * as dates from './weatherData.json';

import { communes } from './communesData.js';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

var qs = require('qs');

var addDays = function(str, days) {
    var myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate;
}

const height = 35;

class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

class Calendar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            canDrop: true,
            showModal: false,
            first_name: "",
            last_name: "",
            currentStep: 1,
            calendarWeekends: true,
                calendarEvents: [],  
                client: "ALBA",
                addrPrj: "",
                ville: "",
                entreprise_name: "",
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
                isLoaded: false,
                villeopts: [], 
                weatherData: "",
                refDuBeton: "",
                commune: "",
                nomComCentrale: "",
                numeroComCentrale: "",
                addrCom: "",
                created_at: new Date().toJSON().slice(0,10),
                etat_projet: 0,
                communes: [],
                remarques: "",
                admin1: "",
            }

        this.getProjects = this.getProjects.bind(this);
    } 

    componentDidMount(){
        var loginToken = localStorage.getItem('loginToken');
        if (!loginToken){
            this.props.history.push('/');
        }
        this.setState({admin1: loginToken})

         //New code||||||||||||||||||||||====||||||||||||||||||||||||||||||||||||||
         Axios.get("http://192.168.100.232:3001/clients").then((response) => {
            //console.log(response.data);
            var users = response.data;
            users.forEach(element => {
                if(element.email === loginToken){
                    this.setState({
                        entreprise_name: element.entreprise_name,
                        client: element.first_name,
                        first_name: element.first_name,
                    
                    });
                } 
            });
            this.getProjects();

        });


        Axios.get("http://192.168.100.232:3001/users").then((response) => {
            //console.log(response.data);
            var users = response.data;
            users.forEach(element => {
                if(element.email === loginToken){
                    this.setState({
                        first_name: element.first_name,
                        last_name: element.last_name,
                        client: element.first_name
                    });
                } 
            });
        });
       
      

        {/*var config = {
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
        });*/} 
 
        var arrVilles = [];
        for (var k = 0; k < villesFr.length; k++) {
            arrVilles.push({value: `${villesFr[k].Nom_commune} - ${villesFr[k].Code_postal}`, name: `${villesFr[k].Nom_commune} - ${villesFr[k].Code_postal}`});
        }

        var self = this;

        if(this.state.commune !== ''){

        console.log(this.state.commune);

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
            console.log("Choisir un commune");
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.commune !== this.state.commune) {
            var self = this;

            if(this.state.commune !== ''){
    
            console.log(this.state.commune);
    
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
                console.log("Choisir un commune");
            }
        }
      }



    getProjects = () => {
        var userType = localStorage.getItem('roleUser');

        var enterpriseEmail = localStorage.getItem('loginToken');

        if(userType === 'ADMIN') {
            Axios.get("http://192.168.100.232:3001/projects").then((response) => {
                var projects = response.data;
                projects.forEach(element => {
                    var start = element.created_at.split("/").join("/").slice(0, 10);
                    //var end = element.dates_Livraison && element.dates_Livraison.split("/").join("/").slice(0, 10);
                    var end = element.dates_Livraison;
                    //console.log(start);
                    var color, border;
                    if(element.etat_projet == 0 || element.etat_projet === null){
                        color = "#f5cd90";
                        border = "#faa423"
                    }else if(element.etat_projet == 1){
                        color = "#DFFFE0";
                        border = "green"
                    }else if(element.etat_projet == 3){
                        color = "#EBF2FF";
                        border = "#347CFF"
                    }
                    var newProject = {
                        id: element.id,
                        title: element.nom + " - " + element.client,
                        start: start, 
                        end: end,
                        url: `/project/${element.id}`,
                        backgroundColor: color,
                        borderColor: border,
                        client: element.client
                    }
                    var joined = this.state.calendarEvents.concat(newProject);
                    this.setState({ calendarEvents: joined, isLoaded: true });
                    //console.log(this.state.calendarEvents);
                });
            });
        }else{
            console.log("calendar testing", this.state.first_name)
            console.log("enterprise Email", enterpriseEmail)
                var config2 = {
                    method: 'get',
                    //url: `http://192.168.100.232:3001/user-projects-email/${this.state.first_name}`,
                    url: `http://192.168.100.232:3001/user-projects/${this.state.first_name}`,
                };
                  
                Axios(config2)
                  .then(function (response) {
                      console.log("calendar data:",response.data)
                    if(response.data.length === 0){
                        this.setState({ calendarEvents: [], isLoaded: true });
                    }
                    var projects = response.data;
                    projects.forEach(element => {
                        var start = element.created_at.split("/").join("/").slice(0, 10);
                        //var end = element.dates_Livraison && element.dates_Livraison.split("/").join("/").slice(0, 10);
                        var end = element.dates_Livraison;
                        //console.log(start);
                        var color, border;
                        if(element.etat_projet == 0 || element.etat_projet === null){
                            color = "#f5cd90";
                            border = "#faa423"
                        }else if(element.etat_projet == 1){
                            color = "#DFFFE0";
                            border = "green"
                        }else if(element.etat_projet == 3){
                            color = "#EBF2FF";
                            border = "#347CFF"
                        }
                        var newProject = {
                            id: element.id,
                            title: element.nom,
                            start: start, 
                            end: end,
                            url: `/project/${element.id}`,
                            backgroundColor: color,
                            borderColor: border,
                            client: element.client
                        }
                        var joined = this.state.calendarEvents.concat(newProject);
                        this.setState({ calendarEvents: joined, isLoaded: true });
                        //console.log(this.state.calendarEvents);
                    });
                 }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

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
        this.props.history.push('/projects');;
    };

    setCanDrop = () => {};
    calendarComponentRef = React.createRef();

    onSubmit = (e) => {
        e.preventDefault();

        var compareDate;

        if(this.state.created_at != new Date().toJSON().slice(0,10)) {
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



        

        //formData.append('access_au_chantier', this.state.accesChantier);
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

        if(compareDate === 3){
        formData.append('etat_projet', 3);
        }else{
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

        Axios.post("http://192.168.100.232:3001/create-project" , formData, config)
        .then(response => {
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });

        this.hideModal();
        this.setState({currentStep: 1});

        //window.location.href = '/projects';

    }

    render() { 

        const nextStep = () => {
            let isValid_1 = true;
            let isValid_2 = true;
            let isValid_3 = true;
    
            
            if(this.state.client === "" || this.state.addrPrj === "" || this.state.ville === "" ||
                this.state.nomResp === "" || this.state.prenomResp === "" || this.state.numeroResp === "" || this.state.dateLiv.valueOf() === ""){
                    // this.setState({currentStep: this.state.currentStep});
                    isValid_1 = false;
                }

            if(this.state.pentes === "" || this.state.surfEstime === "" ||  this.state.charges === "" || this.state.volume === "" ||
                 this.state.nomRespCentrale === "" || this.state.typeProjet === "" ||
                 this.state.cailloux === "" || 
                 this.state.accesChantier === "" || this.state.preparationProjet === "" || this.state.planProjet === ""){
                     // this.setState({currentStep: this.state.currentStep});
                 isValid_2 = false;
             }

            //if(this.state.particularites === "" ){
                    // this.setState({currentStep: this.state.currentStep});
            //    isValid_3 = false;
            //}

            // this.setState(this.state.currentStep < 4 ? {currentStep: this.state.currentStep + 1} : {currentStep: 4});
            if(this.state.currentStep < 1 || this.state.currentStep > 4){
                return null;
            }else{
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

                if(eval("isValid_" + this.state.currentStep)){
                    this.setState({currentStep: this.state.currentStep + 1});
                    document.getElementsByClassName('step-' + (this.state.currentStep + 1))[0].style.display = "block";
                    document.getElementsByClassName('step-' + this.state.currentStep)[0].style.display = "none";
                    document.getElementById('s-' + this.state.currentStep).disabled = true;
                    document.getElementById('s-' + this.state.currentStep).classList.remove('active');
                    document.getElementById('s-' + (this.state.currentStep + 1)).disabled = false;
                    document.getElementById('s-' + (this.state.currentStep + 1)).classList.add('active');
                }else{
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
            if(this.state.currentStep < 1 || this.state.currentStep > 4){
                return null;
            }else{

                if(eval("isValid_" + this.state.currentStep)){
                    this.setState({currentStep: this.state.currentStep - 1});
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
            
        return (
            <Auxiliary>
            <Modal show={this.state.showModal} onHide={this.hideModal} backdrop="static">
                <Modal.Header className="bg-light">
                    <h4><span style={{color: "#B84257", fontWeight: 700}}>+</span> Ajouter un nouveau chantier</h4>
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
                                            <input type="text" className="form-control formControl bg-light border-0" id="adress" placeholder="" onChange={(e) => this.setState({addrPrj: e.target.value})} />
                                            <label htmlFor="adress" className="formLabel">{'Adresse du chantier *'}</label>
                                        </div>
                                        <div className="form-group postal-code position-relative mb-3">
                                            <span className="formLabel">{'Ville *'}</span>
                                            <AutoSuggest
                                            options={villes}
                                            handleChange={(e) => this.setState({ville: e})}
                                            value={this.state.ville}
                                            name="Communes"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="projectName" placeholder="" onChange={(e) => this.setState({complementAddr: e.target.value})} />
                                            <label htmlFor="projectName" className="formLabel">{'Complément d adresse '}</label>
                                        </div>
                                        {/* <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="addr" placeholder="" onChange={(e) => this.setState({complementAddr: e.target.value})} />
                                            <label htmlFor="addr" className="formLabel">{"Complément d'adresse"}</label>
                                        </div> */}
                                    </div>
                                </div>
                                <hr style={{opacity: 1, backgroundColor: "#F5F6F8"}} />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="responsibleName" placeholder="" onChange={(e) => this.setState({nomResp: e.target.value})} />
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
                                    </div>
                                    <div className="col-md-6 d-flex flex-column justify-content-between">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="responsibleSurname" placeholder="" onChange={(e) => this.setState({prenomResp: e.target.value})} />
                                            <label htmlFor="responsibleSurname" className="formLabel">{"Prénom du responsable chantier *"}</label>
                                        </div>
                                        <div className="form-group date position-relative mb-3">
                                            <label htmlFor="dateCreate" style={labelStyle}>Date souhaitée</label>
                                            <input type="date" className="form-control bg-light border-0 pl-4 pt-3" id="dateCreate" placeholder="Date de création" /*value={this.state.created_at}*/ onChange={(e) => this.setState({created_at: e.target.value})} />
                                        </div>
                                        {/* <div className="form-group date position-relative mb-3">
                                            <label htmlFor="date" style={labelStyle}>Et le *</label>
                                            <input type="date" className="form-control bg-light border-0 pl-4 pt-3" id="date" placeholder="Date de livraison souhaitee" onChange={(e) => this.setState({dateLiv: e.target.value})} />
                                        </div> */}
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
                                            <label htmlFor="pentes" className="formLabel">{"Pente *"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="surfRelle" placeholder="" onChange={(e) => this.setState({surfRelle: e.target.value})} />
                                            <label htmlFor="surfRelle" className="formLabel">{"Surface réelle (m2)"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="volume" placeholder="" onChange={(e) => this.setState({volume: e.target.value})} />
                                            <label htmlFor="volume" className="formLabel">{"Volume (m3) comprenant 10% de perte *"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                                <input type="text" className="form-control formControl bg-light border-0" id="nomResCentrale" placeholder="" onChange={(e) => this.setState({nomRespCentrale: e.target.value})} />
                                                <label htmlFor="nomResCentrale" className="formLabel">{"Nom de la centrale *"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="nrContCentrale" placeholder="" onChange={(e) => this.setState({numeroContactCentrale: e.target.value})} />
                                            <label htmlFor="nrContCentrale" className="formLabel">{"Téléphone planning"}</label>
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
                                            <label htmlFor="projectType" className="formLabel">{"Type de projet *"}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="surfEstime" placeholder="" onChange={(e) => this.setState({surfEstime: e.target.value})} />
                                            <label htmlFor="surfEstime" className="formLabel">{"Surface estimée (m2) *"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="charges" placeholder="" onChange={(e) => this.setState({charges: e.target.value})} />
                                            <label htmlFor="charges" className="formLabel">{"Charge (cm) *"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="distance" placeholder="" onChange={(e) => this.setState({distanceChantier: e.target.value})} />
                                            <label htmlFor="distance" className="formLabel">{"Distance chantier-Centrale"}</label>
                                        </div>
                                        <div className="form-group position-relative mb-3">
                                            <input type="text" className="form-control formControl bg-light border-0" id="adrCentrale" placeholder="" onChange={(e) => this.setState({addrCentrale: e.target.value})} />
                                            <label htmlFor="adrCentrale" className="formLabel">{"Mail planning"}</label>
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
                                            <label htmlFor="cailloux" className="formLabel">{"Cailloux / granulométrie *"}</label>
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
                                                <input style={{display: 'none'}} type="file" name="access_au_chantier" id="acces" placeholder="" multiple onChange={(e) => this.setState({ ...this.state.accesChantier.push(e.target.files)})} />
                                            </button>
                                            <label htmlFor="acces" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{this.state.accesChantier.length == 0 ? "Accès au chantier *" : this.state.accesChantier.map((c) => {
                                                    let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(c[i].name, " / ")
                                                         }return arr})}</label>
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
                                                <input style={{display: 'none'}} type="file"  id="plan" placeholder="" multiple onChange={(e) => this.setState({ ...this.state.planProjet.push(e.target.files)})} />
                                            </button>
                                            <label htmlFor="plan" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{this.state.planProjet.length == 0 ? "Plan du chantier *" : this.state.planProjet.map((c) => {
                                                    let arr=[]
                                                    for(let i=0; i<c.length; i++){
                                                        arr.push(c[i].name, " / ")
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
                                                <input style={{display: 'none'}} type="file"  id="preparation" placeholder="" multiple onChange={(e) => this.setState({ ...this.state.preparationProjet.push(e.target.files)})} />
                                            </button>
                                            <label htmlFor="preparation" style={{cursor: 'pointer'}} className="formLabel w-100 h-100">{this.state.preparationProjet.length == 0 ? "Préparation du chantier *" : this.state.preparationProjet.map((c) => {
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
                                        <textarea className="form-control formControl bg-light border-0" id="remarques" rows="3" placeholder="" onChange={(e) => this.setState({remarques: e.target.value})}></textarea>
                                        <label htmlFor="remarques" className="formLabel">{"Remarques"}</label>
                                    </div>
                                </div>
                                </div>
                        </fieldset>
                        <fieldset className="step step-3">
                                <div className="row pt-4 px-4">
                                    <div className="col-md-12 d-flex justify-content-between">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="vitre" defaultChecked={this.state.vitre} onChange={() => this.setState({vitre: 1})} />
                                            <label className="form-check-label" htmlFor="vitre">Vitres</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="plante" defaultChecked={this.state.plante} onChange={() => this.setState({plante: 1})} />
                                            <label className="form-check-label" htmlFor="plante">Plantes</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="revetements" defaultChecked={this.state.revetements} onChange={() => this.setState({revetements: 1})} />
                                            <label className="form-check-label" htmlFor="revetements">Revêtements</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="facade" defaultChecked={this.state.facade} onChange={() => this.setState({facade: 1})} />
                                            <label className="form-check-label" htmlFor="facade">Façades</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="vegetation" defaultChecked={this.state.vegetation} onChange={() => this.setState({vegetation: 1})} />
                                            <label className="form-check-label" htmlFor="vegetation">Végétations</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row pt-4">
                                    <div className="form-group form-group position-relative mb-3">
                                        <textarea className="form-control formControl bg-light border-0" id="particularites" rows="3" placeholder="" onChange={(e) => this.setState({particularites: e.target.value})}></textarea>
                                        <label htmlFor="particularites" className="formLabel">{"Particularites Specifique"}</label>
                                    </div>
                                </div>
                        </fieldset>
                        <fieldset className="step step-4">
                                <div className="row pt-4 px-4">
                                    <div className="col-md-12 d-flex flex-column justify-content-between">
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="pompe" defaultChecked={this.state.pompe} onChange={() => this.setState({pompe: 1})} />
                                            <label className="form-check-label" htmlFor="pompe">Pompe</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="tapis" defaultChecked={this.state.tapis} onChange={() => this.setState({tapis: 1})} />
                                            <label className="form-check-label" htmlFor="tapis">Tapis</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="direct" defaultChecked={this.state.direct} onChange={() => this.setState({direct: 1})} />
                                            <label className="form-check-label" htmlFor="direct">Direct</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="dumper3" defaultChecked={this.state.dumper300} onChange={() => this.setState({dumper300: 1})} />
                                            <label className="form-check-label" htmlFor="dumper3">Dumper 300</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="dumper5" defaultChecked={this.state.dumper500} onChange={() => this.setState({dumper500: 1})} />
                                            <label className="form-check-label" htmlFor="dumper5">Dumper 500</label>
                                        </div>
                                        <div className="form-check py-2">
                                            <input type="checkbox" className="form-check-input" id="dumper8" defaultChecked={this.state.dumper800} onChange={() => this.setState({dumper800: 1})} />
                                            <label className="form-check-label" htmlFor="dumper8">Dumper 800</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <p className="my-4" style={{color: "#BBC9DC", fontWeight: 500}}>Option:</p>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="brouette" defaultChecked={this.state.brouette} onChange={() => this.setState({brouette: 1})} />
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
                    {this.state.currentStep === 1 ? '' : <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.state.currentStep === 4 ? this.onSubmit : previousStep}>{"Précédent"}</button>}
                    <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}} onClick={this.state.currentStep === 4 ? this.onSubmit : nextStep}>{this.state.currentStep === 4 ? "Valider" : "Suivant"}</button>
                </Modal.Footer>
            </Modal>
            {!this.state.isLoaded ? <Loader />
            :(<div className="main">
                <div className="container">
                    <div className="row first-row py-4">
                        <div className="col-md-10">
                            <h2 style={{color: "#25283D"}}>Calendrier</h2>
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
                
                    <div className="row py-4">
                        <div className="col-md-9">
                            <button type="button" className="btn btn-danger create-project" style={{backgroundColor: "#B84257"}} onClick={this.showModal}>+ Créer un projet</button>
                        </div>
                        <div className="col-md-3 d-flex align-items-center justify-content-between">      
                                        <AutoSuggest
                                            options={communes}
                                            handleChange={(e) => this.setState({commune: e})}
                                            value={this.state.commune}
                                            name="Communes"
                                        />
                            <span className="fa fa-search form-control-feedback" style={{position: 'absolute', right: '5%', marginTop: '10%'}}></span>
                        </div>
                    </div>
                </div>
                
                <div className="container px-3 pt-4 bg-white rounded">
                        <FullCalendar
                        weekNumbers={true}
                        locale={frLocale}
                        editable={true}
                        resizable={true}
                        defaultView="timeGridWeek"
                        headerToolbar={{
                        left: "title prev,next",
                        center: "",
                        right: "today dayGridMonth,timeGridWeek"
                        }}
                        header={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                        }}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        ref={this.calendarComponentRef}
                        weekends={this.state.calendarWeekends}
                        events={this.state.calendarEvents}   
                        // eventDidMount= {function(info) {
                        //     console.log(info.event._instance.range);
                        // }}
                        dateClick={this.showModal}
                        contentHeight={700}
                        eventDrop={(info) => {
                        //<--- see from here
                        const { start, end } = info.oldEvent._instance.range;
                        const {
                            start: newStart,
                            end: newEnd
                        } = info.event._instance.range;
                        const projectID = info.oldEvent._def.url.split('/').pop();
                        let events = [...this.state.calendarEvents];
                        let event;
                        
                        for(let i = 0; i < events.length; i++){
                            event = {...events[i]};
                            if(event.id == projectID){
                                event.start = newStart.toISOString().split("/").join("/").slice(0, 10);
                                //event.end = newEnd.toISOString().split("/").join("/").slice(0, 10);
                                event.end = newEnd.toISOString();
                            }
                            events[i] = event;
                        }
                        this.setState({calendarEvents: events});
                        if (new Date(start).getDate() === new Date(newStart).getDate()) {
                            info.revert();
                        }

                        var compareDate;

                        if(newStart.toISOString().split("/").join("/").slice(0, 10) != new Date().toJSON().slice(0,10)) {
                            compareDate = 3;
                        }else{
                            compareDate = this.state.etat_projet
                        }
                        
                        var data = qs.stringify({
                        'id': projectID,
                        'created_at': newStart.toISOString().split("/").join("/").slice(0, 10),
                        'dates_Livraison': newEnd.toISOString().split("/").join("/").slice(0, 10), 
                        'etat_projet': compareDate,    
                        });
                        var config = {
                          method: 'put',
                          url: 'http://192.168.100.232:3001/move-project',
                          headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          data : data
                        };
                        Axios(config)
                        .then(function (response) {
                          //console.log(JSON.stringify(response.data));
                        })
                        .catch(function (error) {
                          console.log(error);
                        });

                        }}

                        eventResize={(info) => {

                        //alert(info.event.title + " end is now " + info.event.end.toISOString());
                        //<--- see from here
                        const { start, end } = info.oldEvent._instance.range;
                        //console.log(start, end);
                        const newStart = info.event.start.toISOString();
                        const newEnd = info.event.end.toISOString();
                        //console.log(newStart, newEnd);

                        const projectID = info.oldEvent._def.url.split('/').pop();

                        //console.log(this.state.calendarEvents);
                        let events = [...this.state.calendarEvents];
                        let event;
                        
                        for(let i = 0; i < events.length; i++){
                            event = {...events[i]};
                            if(event.id == projectID){
                                event.start = start;
                                event.end = newEnd;
                            }
                            events[i] = event;
                            //console.log(event)
                        }
                        this.setState({calendarEvents: events});
                        //console.log(this.state.calendarEvents);

                            var data = qs.stringify({
                                'id': projectID,
                                'created_at': start,
                                'dates_Livraison': newEnd, 
                                });
                                var config = {
                                  method: 'put',
                                  url: 'http://192.168.100.232:3001/move-project',
                                  headers: { 
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                  },
                                  data : data
                                };
                                //console.log("move",data);
                                Axios(config)
                                .then(function (response) {
                                  //console.log(JSON.stringify(response.data));
                                })
                                .catch(function (error) {
                                  console.log(error);
                                });
                            
                        }}
                        eventContent = { () => {
                            //var date = document.querySelectorAll(".fc-daygrid-day")[0].getAttribute("data-date");
                            var newdate;

                            var divs = document.querySelectorAll('.fc-daygrid-day'), i;
                            var data_date = []; var new_dates = []; var list; var fullData;

                            for (i = 0; i < divs.length; ++i) {
                            var individualDate = divs[i].getAttribute("data-date"); 
                            data_date.push(individualDate);    
                            }

                            data_date.forEach((data) => {
                                newdate = data.split("-").reverse().join("/");
                                new_dates.push(newdate);
                            });

                            /*let result = this.state.weatherData.default.reduce((r, a) => {
                                // console.log("a", a);
                                // console.log('r', r);
                                r[a.jour] = [...r[a.jour] || [], a];
                                return r;
                            }, {});*/

                            const obj =  Object.entries(this.state.weatherData);
                            

                            //console.log(dates.default);

                            /*let result = dates.default.reduce((r, a) => {
                                // console.log("a", a);
                                // console.log('r', r);
                                r[a.jour] = [...r[a.jour] || [], a];
                                return r;
                            }, {});

                            const obj =  Object.entries(result);*/

                            obj.map( (date) => {

                                if(new_dates.length != 0){
                                    new_dates.map((data) => {
                                        if(date[0] === data && date[1][2] != undefined){
                                            fullData = data.split("/").reverse().join("-");
                                            if(date[1][2].picto.includes("ensoleillé")){
                                                list = document.querySelectorAll(".fc-daygrid-day[data-date='"+fullData+"'] .fc-daygrid-day-top");
                                                for (var i = 0; i < list.length; ++i) {
                                                    list[i].classList.remove('sunny', 'foggy', 'cloudy', 'faible', 'warn');
                                                    list[i].classList.add('sunny');
                                                }
                                            }else if(date[1][2].picto.includes("voilé")){
                                                list = document.querySelectorAll(".fc-daygrid-day[data-date='"+fullData+"'] .fc-daygrid-day-top");
                                                for (var i = 0; i < list.length; ++i) {
                                                    list[i].classList.remove('sunny', 'foggy', 'cloudy', 'faible', 'warn');
                                                    list[i].classList.add('foggy');
                                                }
                                            }else if(date[1][2].picto.includes("nuageux")){
                                                list = document.querySelectorAll(".fc-daygrid-day[data-date='"+fullData+"'] .fc-daygrid-day-top");
                                                for (var i = 0; i < list.length; ++i) {
                                                    list[i].classList.remove('sunny', 'foggy', 'cloudy', 'faible', 'warn');
                                                    list[i].classList.add('cloudy');
                                                }
                                            }else if(date[1][2].picto.includes("faible")){
                                                list = document.querySelectorAll(".fc-daygrid-day[data-date='"+fullData+"'] .fc-daygrid-day-top");
                                                for (var i = 0; i < list.length; ++i) {
                                                    list[i].classList.remove('sunny', 'foggy', 'cloudy', 'faible', 'warn');
                                                    list[i].classList.add('rainy', 'warn');
                                                }
                                            }
                                         }
                                    })
                                }

                            })

                        }}
                    />
                    <div className="calendar-legend px-4 py-3 d-flex">
                        <div className="legend-item d-flex align-items-center mr-4">
                            <i className="fas fa-square" style={{color: '#347CFF', fontSize: '20px'}}></i>
                            <p className="mb-0 ml-3">Chantiers à faire</p>
                        </div>
                        <div className="legend-item d-flex align-items-center mr-4">
                            <i className="fas fa-square" style={{color: '#FBB245', fontSize: '20px'}}></i>
                            <p className="mb-0 ml-3">Chantiers en cours</p>
                        </div>
                        <div className="legend-item d-flex align-items-center">
                            <i className="fas fa-square" style={{color: '#4CAF50', fontSize: '20px'}}></i>
                            <p className="mb-0 ml-3">Chantiers Terminés</p>
                        </div>
                    </div>
                </div>
            </div>)}
            </Auxiliary>
        );
    }

    toggleWeekends = () => {
        this.setState({
        // update a property
        calendarWeekends: !this.state.calendarWeekends
        });
    };

    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    };

    handleDateClick = (arg) => {
        const title = prompt("What's the name of the title");
        this.setState({
        // add new event data
        calendarEvents: this.state.calendarEvents.concat({
            // creates a new array
            title: title,
            start: arg.date,
            allDay: arg.allDay
        })
        });
    };
}

export default withRouter (Calendar);