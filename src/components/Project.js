import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Project.css';
import Auxiliary from '../hoc/Auxiliary';

var userType = localStorage.getItem('roleUser');

class Project extends Component {

    render(){
        let status = "";
        let p = "";

        if(this.props.status === "0" || this.props.status === null){
            status = "En Cours";
            p = <p style={{color: "#FBB245", fontWeight: 500}}>{status}</p>;
        }
        else if(this.props.status === "1"){
            status = "Terminé";
            p = <p style={{color: "#2ECC71", fontWeight: 500}}>{status}</p>;
        }
        else if(this.props.status === "2"){
            status = "Archiver";
            p = <p style={{color: "#B84257", fontWeight: 500}}>{status}</p>
        }
        else if(this.props.status === "3"){
            status = "Faire";
            p = <p style={{color: "#347CFF", fontWeight: 500}}>{status}</p>
        }

    return (
        <Auxiliary>
            <div className="card rounded-3 border-0 p-0">
                            <div className="card-header bg-white d-flex justify-content-between" style={{borderColor: "#F5F6F8"}}>
                            <p className="m-0" style={{color:" #5C677B", fontWeight: 600}}>{this.props.name} - {this.props.client}</p>
                            
                            <Link 
                            className="m-0" 
                            style={{color: "#347CFF", fontWeight: 500, textDecoration: 'none'}}
                            to={{ pathname: '/project/' + this.props.projectNo}}>
                                Voir
                            </Link>
                            
                            </div>
                            <div className="card-body">
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p style={{color: "#5C677B"}}>Statut</p>
                                    {p}
                                </div>
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p style={{color: "#5C677B"}}>Date</p>
                                    <p style={{color: "#2D527C", fontWeight: 500}}>{this.props.date && this.props.date.split("-").join("/").slice(0, 10)}</p>
                                </div>
                                <div className="card-item d-flex flex-row justify-content-between">
                                    <p className="m-0" style={{color: "#5C677B"}}>Client</p>
                                    <p className="m-0" style={{color: "#2D527C", fontWeight: 500}}>{this.props.client}</p>
                                </div>
                            </div>
                        </div>                        
        </Auxiliary>
    );
    }
};


export default Project;