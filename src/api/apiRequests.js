import api from './api'

export const retriveClients= async ()=> {
    const response= await api.get('/clients');
    return response.data;

}

export const retriveTotalProjects= async ()=> {
     const response= await api.get('/projects-no-limit');
     return response.data;
}

export const retriveUsers= async ()=>{
    const response= await api.get('/users');
    return response.data;
}

export const retriveProject= async (firstName) =>{
    const response = await api.get('/user-projects/'+firstName);
    return response.data;
}