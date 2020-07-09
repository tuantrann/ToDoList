const storageLoad = (() => {
    let localStorage = window.localStorage;
    let sessionStorage = [];
    let len = 0;
    let temporaryProject = [];
    const convertToSessionStorage = (projectt) => {
        if(localStorage.length > 0){
            sessionStorage = JSON.parse(localStorage.getItem(projectt));
            if (sessionStorage == null){
                len = 0;
                sessionStorage = [];
            }
            else{
                len = sessionStorage.length;
            }
        }
        
    }
    
   
    const pushToSessionStorage = (obj, project) => {
        const temp = {[len] :[...obj, 'incomplete']};
        sessionStorage.push(temp);
        localStorage.removeItem(project);
        localStorage.setItem(project, JSON.stringify(sessionStorage));
    };

    const getObjFromList = (project, keys, key) =>{
        convertToSessionStorage(project);
        if(len != 0){
            return sessionStorage[keys][key];
        }
        else{
            return false;
        }
       
    }; 
    

    const pushToSessionStorageComplete = (obj, project) => {
        const temp = {[len] :[...obj, 'complete']};
        sessionStorage.push(temp);
        localStorage.removeItem(project);
        localStorage.setItem(project, JSON.stringify(sessionStorage));
    };

    const getKeysFromLocaLStorage = () =>{
        
        for(let i = 0; i < localStorage.length; i++){
            if (!temporaryProject.includes(localStorage.key[i])){
                temporaryProject.push(localStorage.key(i));
            }
            
        }
        return temporaryProject;
    }

    const getItemsSessionStorage = (project) => {
        convertToSessionStorage(project);
        if(len != 0){
            return sessionStorage;
        }
        else{
            return false;
        }
       
    }; 

    const getKeysFromList = (project) =>{
        convertToSessionStorage(project);
        
        const temp = [];
        sessionStorage.forEach(elem => {
            const key = Object.keys(elem);
            temp.push(key[0]);
        });
        return temp;
    }

    const deleteTaskFromLocalStorage = (index, project) =>{
        convertToSessionStorage(project);
        if(len != 0){
            sessionStorage.splice(index, 1);
            localStorage.removeItem(project)
            localStorage.setItem(project, JSON.stringify(sessionStorage));
        }
    }

    const deleteTasksFromLocalStorage = () =>{
        localStorage.clear();
        location.reload();
    }

    return {pushToSessionStorage, getItemsSessionStorage, deleteTasksFromLocalStorage, deleteTaskFromLocalStorage, getKeysFromList, pushToSessionStorageComplete, getObjFromList, getKeysFromLocaLStorage, temporaryProject};
})();

export{storageLoad};