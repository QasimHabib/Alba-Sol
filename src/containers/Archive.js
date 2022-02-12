import React, { Component } from 'react';
import Auxiliary from '../hoc/Auxiliary';
import { FileIcon, defaultStyles } from 'react-file-icon';


import folder from '../images/folder.png';

import './Archive.css';

import { Dropdown, Modal } from 'react-bootstrap';
import Axios from 'axios';

import { pdfjs, Document, Page } from "react-pdf";
import {useHistory} from 'react-router'

import Dropzone from "react-dropzone";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

var qs = require('qs');

class Archive extends Component {

    constructor(props) {
    super(props)
    this. state = {
        first_name: "",
        last_name: "",
        selectedFile: "",
        isFileSelected: false,
        file: null,
        showFile: false,
        showDeleteModal: false,
        showDeleteModalAdmin: false,
        showDeleteModalAlbamat: false,
        showFilee: false,
        nom: "",
        description: "",
        filename: "",
        files: [], 
        filesAdmin: [], 
        filesAlbamat: [],
        path: "",
        ext: "",
        document: "",
        selectedFileAdmin: "",
        fileId: "",
        showFileeAdmin: false,
        accepteFiles: [], 
        showAlbasolution: true,
        showAdmin: false,
        showAlbamat: false,
        reload: false
    }
    this.toggleStateAlbasolution = this.toggleStateAlbasolution.bind(this);
    this.toggleStateAdmin = this.toggleStateAdmin.bind(this);
    this.toggleStateAlbamat = this.toggleStateAlbamat.bind(this);
    }    

    toggleStateAlbasolution() {
        this.setState({ showAlbasolution: true });
        this.setState({ showAdmin: false });
        this.setState({ showAlbamat: false });
    }

    toggleStateAdmin() {
        this.setState({ showAlbasolution: false });
        this.setState({ showAdmin: true });
        this.setState({ showAlbamat: false });
    }

    toggleStateAlbamat() {
        this.setState({ showAlbasolution: false });
        this.setState({ showAdmin: false });
        this.setState({ showAlbamat: true });
    }

    componentDidMount(){
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

        this.getFiles();

    }

    _updateFileState(roleFile, file) {
        let files = this.state[roleFile];
        files.push(file)
        this.setState({[roleFile]: files})
    }

    _deleteFile(roleFile) {
        let files = this.state[roleFile];
        const index = files.findIndex(file => file.id === this.state.fileId)
        if (index > -1) {
            files.splice(index, 1)
            this.setState({[roleFile]: files})
        }
        
    }

    logout = () => {
        localStorage.removeItem("loginToken");
        //this.props.history.push('/');
        window.location.href = '/';
    }

    changeHandler = (e) => {
        this.setState({selectedFile: e.target.files[0], file: URL.createObjectURL(e.target.files[0])});
        console.log(this.state.selectedFile);
    }

    showFile = () => {
        this.setState({showFile: true});
        //this.setState({showFileeAlbamat: true})
    }

    hideFile = () => {
        this.setState({showFile: false});
    }

    showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    };
    showDeleteModalAdmin = () => {
        this.setState({ showDeleteModalAdmin: true });
    };
    showDeleteModalAlbamat = () => {
        this.setState({ showDeleteModalAlbamat: true });
    };

    hideDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    };
    hideDeleteModalAdmin = () => {
        this.setState({ showDeleteModalAdmin: false });
    };
    hideDeleteModalAlbamat = () => {
        this.setState({ showDeleteModalAlbamat: false });
    };

    showFilee = (event, file, id) => {
        console.log(event.target);
        console.log(file);
        console.log(id);
        console.log("qasiM habib")
        //this.setState({showFile: true});
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        console.log("DOC",this.state.document)
        this.setState({fileId: id});
        this.setState({showFilee: true});
    }

    showFileeAdmin = (event, file, id) => {
        console.log(event.target);
        console.log(file);
        console.log(id);
        //this.setState({showFile: true});
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFileeAdmin: true});
    }

    showFileeAlbamat = (event, file, id) => {
        console.log(event.target);
        console.log(file);
        console.log(id);
        //this.setState({showFile: true});
        this.setState({document: "https://desibucket.s3.amazonaws.com/"+file});
        this.setState({fileId: id});
        this.setState({showFileeAlbamat: true});
    }

    hideFilee = () => {
        this.setState({showFilee: false});
        this.setState({showFileeAdmin: false});
        this.setState({showFileeAlbamat: false})
    }

    uploadFile = () => {
        let formData = new FormData();    //formdata object

        formData.append('nom', this.state.selectedFile.name);   //append the values with key, value pair
        formData.append('description', "");
        formData.append('fichier', this.state.selectedFile);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-dossier-technique", formData, config)
        .then(response => {
            this._updateFileState('files', response.data)
        })
        .catch(error => {
            console.log(error);
        });

    }

    uploadFileAdmin = (acceptedFiles, rejectedFiles) => {
        
        let formData = new FormData();    //formdata object

        formData.append('nom', acceptedFiles[0].name);   //append the values with key, value pair
        formData.append('description', "");
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-dossier-admin", formData, config)
        .then(response => {
            this._updateFileState('filesAdmin', response.data)
        })
        .catch(error => {
            console.log(error);
        });

    }

    uploadFileAlbamat = (acceptedFiles, rejectedFiles) => {
        
        let formData = new FormData();    //formdata object

        formData.append('nom', acceptedFiles[0].name);   //append the values with key, value pair
        formData.append('description', "");
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-dossier-albamat", formData, config)
        .then(response => {
            this._updateFileState('filesAlbamat', response.data)
        })
        .catch(error => {
            console.log(error);
        });

    }

    getFiles = () => {
        
        Axios.get("http://192.168.100.232:3001/projects-dossier-technique").then((response) => {
            this.setState({files: response.data});
            // setProjectsList(response.data);
            //setShow(!show);  
            //console.log(response.data);
        }  
        );

        Axios.get("http://192.168.100.232:3001/projects-dossier-admin").then((response) => {
            this.setState({filesAdmin: response.data});
            // setProjectsList(response.data);
            //setShow(!show);  
            //console.log(response.data);
        }  
        );

        Axios.get("http://192.168.100.232:3001/projects-dossier-albamat").then((response) => {
            this.setState({filesAlbamat: response.data});
            // setProjectsList(response.data);
            //setShow(!show);  
            //console.log(response.data);
        }  
        );

    }

    deleteDoc = (event, id) => {
        console.log(this.state.fileId);
        Axios.delete('http://192.168.100.232:3001/delete-dossier-technique', { data: {id: this.state.fileId } }).then((response) => {
        // this only runs on success
        console.log("RESPONSE FROM POST", response.data);
        this._deleteFile('files')
        }, (err) => {
        // this only runs on error
        console.log("Error While Posting Data", err);
        });
        this.setState({showFilee: false});
        this.setState({showDeleteModal: false});
        // this.props.history.push('/');
    }
//=====

deleteDocAdmin = (event, id) => {
    console.log(this.state.fileId);
    Axios.delete('http://192.168.100.232:3001/delete-dossier-admin', { data: {id: this.state.fileId } }).then((response) => {
    // this only runs on success
    console.log("RESPONSE FROM POST", response.data);
    this._deleteFile('filesAdmin')
    //this.props.history.go(0)
   
    }, (err) => {
    // this only runs on error
    console.log("Error While Posting Data", err);
    });
    this.setState({showFileeAdmin: false});
    this.setState({showDeleteModalAdmin: false});
    // this.props.history.push('/');
}
    // deleteDocAdmin = (event, id) => {
    // var data = qs.stringify({
    // 'id': this.state.fileId 
    // });
    // var config = {
    // method: 'delete',
    // url: 'http://192.168.100.232:3001/delete-dossier-admin',
    // headers: { 
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // },
    // data : data
    // };

    // Axios(config)
    // .then(function (response) {
    // console.log(JSON.stringify(response.data));
    // this._deleteFile('filesAdmin')
   
    // })
    // .catch(function (error) {
    // console.log(error);
    // });
    // this.setState({showFileeAdmin: false});
    // this.setState({showDeleteModalAdmin: false}); 
    // // this.props.history.push('/');
    // }

    //===================
    deleteDocAlbamat = (event, id) => {
        console.log(this.state.fileId);
        Axios.delete('http://192.168.100.232:3001/delete-dossier-albamat', { data: {id: this.state.fileId } }).then((response) => {
        // this only runs on success
        console.log("RESPONSE FROM POST", response.data);
        this._deleteFile('filesAlbamat')
        //this.props.history.go(0)
       // this.setState({reload: true})
        }, (err) => {
        // this only runs on error
        console.log("Error While Posting Data", err);
        });
        this.setState({showFileeAlbamat: false});
        this.setState({showDeleteModalAlbamat: false});
        // this.props.history.push('/');
    }
//=====

    // deleteDocAlbamat = (event, id) => {
    //         var data = qs.stringify({
    //         'id': this.state.fileId 
    //         });
    //         var config = {
    //         method: 'delete',
    //         url: 'http://192.168.100.232:3001/delete-dossier-albamat',
    //         headers: { 
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         data : data
    //         };
        
    //         Axios(config)
    //         .then(function (response) {
    //         console.log(JSON.stringify(response.data));
    //         this._deleteFile('filesAlbamat')
    //         window.location.reload();
    //         })
    //         .catch(function (error) {
    //         console.log(error);
    //         });
    //         //window.location.reload();
    // this.setState({showFileeAlbamat: false});
    // this.setState({showDeleteModalAlbamat: false}); 
    // // this.props.history.push('/');
    // }

    handleOnDrop = (acceptedFiles, rejectedFiles) => {
        console.log("Accepted Files: ", acceptedFiles);
        console.log("Rejected Files: ", rejectedFiles);
        let formData = new FormData();    //formdata object

        formData.append('nom', acceptedFiles[0].name);   //append the values with key, value pair
        formData.append('description', "");
        formData.append('fichier', acceptedFiles[0]);

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        Axios.post("http://192.168.100.232:3001/upload-dossier-technique", formData, config)
        .then(response => {
            this._updateFileState('files', response.data)
        })
        .catch(error => {
            console.log(error);
        });

        // window.location.href = '/calendar';
      };

    render() {

        // const url = `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=85e869189557cc65a0e9268dcd266053`;
        // fetch(url)
        // .then((resp) => resp.json())
        // .then((data) => {
        //     const weatherObj = {
        //     weather: data.weather,
        //     city: data.name,
        //     temp: data.main.temp,
        //     imgUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        //     };
        //     this.setState({
        //     weatherData: weatherObj})
            // console.log('Weather', data.weather);
            // console.log('City', data.name);
            // console.log("Temp", Math.round(data.main.temp - 273.15));
            // console.log('Icon', data.weather[0].icon);
            // const imgUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            // console.log(imgUrl);
        // })

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

            const onError = e => {
                console.log(e, "error in file-viewer");
            };

            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(this.state.document)[1];
        

        return (
            <Auxiliary>
                <Modal show={this.state.showFilee} onHide={this.hideFilee} className="doc-modal">
                    <Modal.Body>
                        {/* <iframe src={doc}></iframe> */}
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a> 
                                <button className="btn p-0"><i className="fas fa-print mx-2"></i></button> 
                                <button className="btn p-0" onClick={this.showDeleteModal} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button> 
                            </div>
                        </div>
                        {ext === "pdf"  ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            <iframe width="100%" height="100%" frameborder="0" src={this.state.document}></iframe>
                            
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteModal} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModal}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deleteDoc(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFileeAdmin} onHide={this.hideFilee} className="doc-modal">
                    <Modal.Body>
                        {/* <iframe src={doc}></iframe> */}
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a> 
                                <button className="btn p-0"><i className="fas fa-print mx-2"></i></button> 
                                <button className="btn p-0" onClick={this.showDeleteModalAdmin} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button> 
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            <iframe width="100%" height="100%" frameborder="0" src={this.state.document}></iframe>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalAdmin} onHide={this.hideDeleteModalAdmin} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalAdmin}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deleteDocAdmin(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFileeAlbamat} onHide={this.hideFilee} className="doc-modal">
                    <Modal.Body>
                        {/* <iframe src={doc}></iframe> */}
                        <div className="file-controls d-flex align-items-center justify-content-between p-2">
                            <p className="mb-0">{this.state.document.split("/").pop()}</p>
                            <div className="control-icons d-flex align-items-center">
                                <a href={this.state.document} className="btn p-0" download><i className="fas fa-download mx-2" style={{color: "#347CFF"}}></i></a> 
                                <button className="btn p-0"><i className="fas fa-print mx-2"></i></button> 
                                <button className="btn p-0" onClick={this.showDeleteModalAlbamat} ><i className="fas fa-trash-alt mx-2" style={{color: "#B84257"}}></i></button> 
                            </div>
                        </div>
                        {ext === "pdf" ? (
                            <Document file={this.state.document}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            <iframe width="100%" height="100%" frameborder="0" src={this.state.document}></iframe>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteModalAlbamat} onHide={this.hideDeleteModalAlbamat} className="delete-modal">
                    <Modal.Body>
                        <h5>Supprimer le fichier</h5>
                        <p>Voulez-vous vraiment supprimer ce fichier?</p>
                        <div className="d-flex">
                            <button type="button" className="btn px-4" style={{backgroundColor: "#F5F6F8"}} onClick={this.hideDeleteModalAlbamat}>Non</button>
                            <button type="button" className="btn text-white ml-3 px-4" style={{backgroundColor: "#B84257"}} id={this.state.fileId} onClick={(e) => this.deleteDocAlbamat(this.state.fileId,e)}>Oui</button>
                        </div>
                    </Modal.Body>
                </Modal>
                <div className="main" style={{width: '100vw'}}>
                    <div className="container">
                        <div className="row pt-4">
                            <div className="col-md-10">
                                <h2>Archiver</h2>
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
                    
                        {/*<div className="row pt-4">
                            <div className="col-md-9">
                                <button type="button" className="btn btn-danger" style={{backgroundColor: "#B84257"}}>+ Créer le dossier</button>
                            </div>
                        </div>*/}
                    </div>
                    <div className="container py-4">
                        <div className="row py-4">
                            <div className="col-md-12 nav d-flex align-items-center">
                                <button type="button" className="btn active" onClick={this.toggleStateAlbasolution}>Albasolutions</button>
                                <button type="button" className="btn" onClick={this.toggleStateAdmin}>Admin</button>
                                <button type="button" className="btn" onClick={this.toggleStateAlbamat}>Albamat</button>
                            </div>
                        </div>
                        <div className="row" style={{ display: (this.state.showAlbasolution ? 'block' : 'none') }}>
                            <h3 className="mx-4">Dossier Albasolutions</h3>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-archive"></i>
                                <p className="my-0 mx-2">Fichiers</p>
                                {/* <p className="mb-0 ml-auto"><a style={{textDecoration: "none", fontWeight: 600}} href="">View All</a></p> */}
                            </div>
                        </div>
                        <div className="row py-5 pl-2" style={{ display: (this.state.showAlbasolution ? 'block' : 'none') }}>
                            <div className="col-md-8 d-flex align-items-center">
                                { 
                                    this.state.files.map(file => {
                                        var re = /(?:\.([^.]+))?$/;
                                        var ext = re.exec(file.fichier)[1];
                                        //console.log(file.fichier);
                                        return (
                                        <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                            this.showFilee(e, file.fichier, file.id)
                                       }}><FileIcon key={file.id} link={file.fichier} extension={ext} {...defaultStyles.pdf} />{file.fichier}</button>
                                       )
                                    })
                                }
                                {/*<div className="add">
                                        <label htmlFor="upload">
                                            <div className="text"> 
                                                <span>+</span>
                                                <br />
                                                Ajouter
                                            </div>
                                            
                                            <input type="file" name="file" id="upload" style={{display: 'none'}} onChange={this.changeHandler} />
                                            
                                        </label>
                                </div>
                            <button onClick={this.uploadFile}>Upload</button>*/}
                            <Dropzone onDrop={this.handleOnDrop}>
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
                        </div>
                        <div className="row" style={{ display: (this.state.showAdmin ? 'block' : 'none') }}>
                            <h3 className="mx-4">Dossier Admin</h3>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-archive"></i>
                                <p className="my-0 mx-2">Fichiers</p>
                                {/* <p className="mb-0 ml-auto"><a style={{textDecoration: "none", fontWeight: 600}} href="">View All</a></p> */}
                            </div>
                        </div>
                        <div className="row py-5 pl-4" style={{ display: (this.state.showAdmin ? 'block' : 'none') }}>
                            <div className="col-md-8 d-flex align-items-center">
                            { 
                                    this.state.filesAdmin.map(file => {
                                        var re = /(?:\.([^.]+))?$/;
                                        var ext = re.exec(file.fichier)[1];
                                        //console.log(file.fichier);
                                        return <button className="file-btn btn p-3 bg-white mr-4 rounded" onClick={(e) => {
                                            this.showFileeAdmin(e, file.fichier, file.id)
                                    }}><FileIcon key={file.id} link={file.fichier} extension={ext} {...defaultStyles.pdf} />{file.fichier}</button>
                                    })
                                }
                                {/*<div className="add">
                                        <label htmlFor="upload">
                                            <div className="text"> 
                                                <span>+</span>
                                                <br />
                                                Ajouter
                                            </div>
                                            
                                            <input type="file" name="file" id="uploadAdmin" style={{display: 'none'}} onChange={this.changeHandler} />
                                            
                                        </label>
                                </div>
                            <button onClick={this.uploadFileAdmin}>Upload</button>*/}
                            <Dropzone onDrop={this.uploadFileAdmin}>
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
                        </div>
                        <div className="row" style={{ display: (this.state.showAlbamat ? 'block' : 'none') }}>
                            <h3 className="mx-4">Dossier Albamat</h3>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-archive"></i>
                                <p className="my-0 mx-2">Fichiers</p>
                                {/* <p className="mb-0 ml-auto"><a style={{textDecoration: "none", fontWeight: 600}} href="">View All</a></p> */}
                            </div>
                        </div>
                        <div className="row py-5 pl-4" style={{ display: (this.state.showAlbamat ? 'block' : 'none') }}>
                            <div className="col-md-8 d-flex align-items-center">
                                { 
                                    this.state.filesAlbamat.map(file => {
                                        var re = /(?:\.([^.]+))?$/;
                                        var ext = re.exec(file.fichier)[1];
                                        //console.log(file.fichier);
                                        return <button className="file-btn btn p-3 bg-white mr-4" onClick={(e) => {
                                            this.showFileeAlbamat(e, file.fichier, file.id)
                                       }}><FileIcon key={file.id} link={file.fichier} extension={ext} {...defaultStyles.pdf} />{file.fichier}</button>
                                    })
                                }
                                {/*<div className="add">
                                        <label htmlFor="upload">
                                            <div className="text"> 
                                                <span>+</span>
                                                <br />
                                                Ajouter
                                            </div>
                                            
                                            <input type="file" name="file" id="uploadAlbamat" style={{display: 'none'}} onChange={this.changeHandler} />
                                            
                                        </label>
                                </div>
                            <button onClick={this.uploadFileAlbamat}>Upload</button>*/}
                            <Dropzone onDrop={this.uploadFileAlbamat}>
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
                        </div>
                    </div>
                </div>
            </Auxiliary>
        );
    }
}

export default Archive;
