import {storageLoad  as storage} from './storage.js'

const initialPageLoad = (() => {
    
    const resets = () => {
        const allButtons = document.querySelectorAll('.delete-button');
        allButtons.forEach(element => element.removeEventListener('click', deleteTas));
        
        const allTheTrTags = document.querySelectorAll('.jobs-detail');
        for (let i = 0; i < allTheTrTags.length; i++){
            const allTheTrTag = document.querySelector('.jobs-detail');
            allTheTrTag.remove();
        }
        const allTheArrs = document.querySelectorAll('.arr');
        for (let i = 0; i < allTheArrs.length; i++){
            const allTheArr = document.querySelector('.arr');
            allTheArr.remove();
        }
        const allTheTags = document.querySelectorAll('td');
        for (let i = 0; i < allTheTags.length; i++){
            const allTheTag = document.querySelector('td');
            allTheTag.remove();
        }
    }
    
    const getCurrentProject = ()=>{
        const dropDown = document.querySelector('.drop-down');
        return dropDown.value;
    }

    function deleteTas(e){
        let activeBox = document.querySelector('.active');
        console.log(e.target.parentNode.parentNode.rowIndex - 1);
        storage.deleteTaskFromLocalStorage(e.target.parentNode.parentNode.rowIndex - 1, getCurrentProject());
        render(getCurrentProject(), activeBox.classList[0]);
    }


    function changeStatusofTask(e, i, key, completition){
        const temp = storage.getObjFromList(getCurrentProject(), i, key);
        temp.pop();
        if(completition == 'incomplete'){
            storage.deleteTaskFromLocalStorage(e.target.parentNode.parentNode.rowIndex - 1, getCurrentProject());
            storage.pushToSessionStorageComplete(temp, getCurrentProject());
            render(getCurrentProject(), 'incomplete');
        }
        else if(completition == 'complete'){
            storage.deleteTaskFromLocalStorage(e.target.parentNode.parentNode.rowIndex - 1, getCurrentProject());
            storage.pushToSessionStorage(temp, getCurrentProject());
            render(getCurrentProject(), 'complete');
        }
       
    }

    const render = (chooseProject, completitionStat='incomplete') => {
        resets();
        const allElementsFromStorage = storage.getItemsSessionStorage(chooseProject);
        if (allElementsFromStorage != false){
            let availKeys = storage.getKeysFromList(chooseProject);
            let totalRows = allElementsFromStorage.length;
            let tableContainer = document.querySelector('.jobs-details');
            for (let i = 0; i < totalRows; i++){
                let newRow = document.createElement('tr');
                newRow.classList.add('jobs-detail');
                let newDetail = document.createElement('td');
                let newArrow = document.createElement('i');
                newArrow.classList.add('fas','fa-arrow-circle-right', 'arrow');
                newDetail.appendChild(newArrow);
                const newDetails = document.createElement('tr');
                    newDetails.classList.add('arr');
                    newDetails.innerHTML=`
                    <div class='task-title task-text'>Title</div>
                    <input type="text" class='title-box' placeholder="Your Task" autocomplete='off' value=${allElementsFromStorage[i][availKeys[i]][0]} disabled>
                    <div class='task-description task-text'>Description</div>
                    <textarea name="" class="description-box" cols="30" rows="10" autocomplete='off'  disabled>${allElementsFromStorage[i][availKeys[i]][1]}</textarea>
                    <div class='task-date task-text'>Date</div>
                    <input name='date' id='date' type="date" class='date-box' autocomplete='off' value=${allElementsFromStorage[i][availKeys[i]][2]} disabled >
                    <div class='task-priority task-text'>Priority</div>
                    <select name="" class="priority-box" autocomplete='off' value=${allElementsFromStorage[i][availKeys[i]][3]} disabled >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <div class='task-note task-text'>Note</div>
                    <textarea placeholder="Notes for task" name="" class="note-box" cols rows="10" autocomplete='off' ="30" disabled>${allElementsFromStorage[i][availKeys[i]][4]}</textarea>
                
                    `;
                
                newArrow.addEventListener('click', ()=>{
                    newDetails.classList.toggle('show');
                    
                })
               
                let newTitle = document.createElement('td');
                newTitle.innerHTML = allElementsFromStorage[i][availKeys[i]][0];
                let newDate = document.createElement('td');
                newDate.innerHTML = allElementsFromStorage[i][availKeys[i]][2];
                let newPriority = document.createElement('td');
                newPriority.innerHTML = allElementsFromStorage[i][availKeys[i]][3];
                let newStatus = document.createElement('td');
                if (allElementsFromStorage[i][availKeys[i]][5] == 'incomplete'){
                    let newStatusInput = document.createElement('input');
                    newStatusInput.classList.add('check-box');
                    newStatusInput.type = 'checkbox';
                    newStatusInput.addEventListener('click', function(e){changeStatusofTask(e, i, availKeys[i], 'incomplete')});                    
                    newStatus.appendChild(newStatusInput);
                }
                else if (allElementsFromStorage[i][availKeys[i]][5] == 'complete'){
                    let newStatusInput = document.createElement('input');
                    newStatusInput.classList.add('check-box');
                    newStatusInput.checked = true;
                    newStatusInput.type = 'checkbox';
                    newStatusInput.addEventListener('click', function(e){changeStatusofTask(e, i, availKeys[i], 'complete')});
                    newStatus.appendChild(newStatusInput);
                }
                let newDelete = document.createElement('td');
                let newButton = document.createElement('button');
                newButton.classList.add('delete-button');
                newButton.innerHTML = 'X';
                newDelete.appendChild(newButton);
                
                newRow.appendChild(newDetail);
                newRow.appendChild(newTitle);
                newRow.appendChild(newDate);
                newRow.appendChild(newPriority);
                newRow.appendChild(newStatus);
                newRow.appendChild(newDelete);
                if(allElementsFromStorage[i][availKeys[i]][5] == completitionStat || completitionStat == 'all-tasks'){
                    tableContainer.appendChild(newRow);
                    tableContainer.appendChild(newDetails);
                    
                }
                newButton.addEventListener('click', deleteTas);

                
            }
        }
        
    };

    

    const deleteTask = () =>{
        const deleteButton = document.querySelector('.header-text');
        function reset(){
            storage.deleteTasksFromLocalStorage();
        }
        deleteButton.addEventListener('click', reset);
    };

    const addTask = (()=>{
       
        const taskForm = document.querySelector('.task-form');
        const addTaskButton = document.querySelector('.add-task-button'); 
        const cancelTask = document.querySelector('.cancel');
        const submitButton = document.querySelector('.submit');

        const middleContainer = document.querySelector('.middle-container');
        const taskTitle = document.querySelector('.title-box');
        const taskDescription = document.querySelector('.description-box');
        const taskDate = document.querySelector('.date-box');
        const taskPriority = document.querySelector('.priority-box');
        const taskNote = document.querySelector('.note-box');
        const taskProject = document.querySelector('.project-box');

        function cancelTasks(){
            if(taskForm.classList.contains('show')){
                taskForm.classList.remove('show');
                middleContainer.classList.add('show');
                taskTitle.value = '';
                taskDescription.value = '';
                taskDate.value = '';
                taskPriority.value = 'Low';
                taskNote.value = '';
            }
        }
       

        function submitTasks(){
            if(taskForm.classList.contains('show')){
                storage.pushToSessionStorage([taskTitle.value, taskDescription.value, taskDate.value, taskPriority.value, taskNote.value], taskProject.value);
                let activeBox = document.querySelector('.active');
                taskForm.classList.remove('show');
                middleContainer.classList.add('show');
                render(taskProject.value, activeBox[0]);
            }
        }
        function openTask(){
            if (getCurrentProject() == ""){
                alert('Please enter a project first.');
                return;
            }
            if(!taskForm.classList.contains('show')){
                taskForm.classList.add('show');
                middleContainer.classList.remove('show');
                cancelTask.addEventListener('click', cancelTasks, {once: true});
                submitButton.addEventListener('click', submitTasks, {once: true});
                const chooseProject = (()=>{
              
                    if (storage.temporaryProject.length > 0){
                        if(document.querySelectorAll('.temp') != null){
                            const tempLen = document.querySelectorAll('.temp');
                            for (let i = 0; i < tempLen.length; i++){
                                const tempLe = document.querySelector('.temp');
                                tempLe.remove();
                            }
                        }
                        for (let j = 0; j < storage.temporaryProject.length; j++){
                            
                            let newOpt = document.createElement('option');
                            newOpt.classList.add('temp');
                            newOpt.value = storage.temporaryProject[j];
                            newOpt.innerHTML = storage.temporaryProject[j];
                            taskProject.appendChild(newOpt);
                        }
                        
                    }
                    
                })();
            }
        }
       

        
        addTaskButton.addEventListener('click',openTask)
    });
    
    const loadAllProject = () => {
        const cleanPrevious = document.querySelectorAll('.drop-down-content');
        for (let i = 0; i < cleanPrevious.length; i++){
            const cleanPrev = document.querySelector('.drop-down-content');
            cleanPrev.remove();
        }
        let loadLocalStorage = storage.getKeysFromLocaLStorage();
        let option = document.querySelector('.drop-down');
        if (loadLocalStorage != null){
            for (let i = 0; i < loadLocalStorage.length; i++){
                let newOpt = document.createElement('option');
                newOpt.classList.add('drop-down-content');
                newOpt.innerHTML = loadLocalStorage[i];
                option.appendChild(newOpt);
            }
            render(getCurrentProject(), 'incomplete');
        }
    }

    const changingProject = () => {
        const changeProjectButton = document.querySelector('.drop-down');
        const addProject = document.querySelector('.pop-up-class');
        const addProjectButton = document.querySelector('.add-project');
        const mainPage = document.querySelector('main');
        const headerPage = document.querySelector('header');
        const changeCurrentPro = (() =>{
            let dropDownContent = document.querySelectorAll('.drop-down-content');
            function changePro(e){
                render(e.target.value, getCurrentProject());
            }
            if (dropDownContent.length > 0){
                dropDownContent.forEach(elem => elem.addEventListener('click', changePro))

            }
            return {changePro};
        })();
        function newProject(){
            if(!mainPage.classList.contains('blur') && !headerPage.classList.contains('blur')){
                mainPage.classList.add('blur');
                headerPage.classList.add('blur');
                addProject.classList.add('show');
                const popUpButton = document.querySelector('.pop-up-button');
                const exitButton  = document.querySelector('.exit');
                exitButton.addEventListener('click', ()=>{
                    mainPage.classList.remove('blur');
                    headerPage.classList.remove('blur');
                    addProject.classList.remove('show');
                }, {once: true})
                popUpButton.addEventListener('click', () =>{
                    const newProjectName = document.querySelector('.new-project-name'); 
                    let newProject = document.createElement('option');
                    newProject.innerHTML = newProjectName.value;
                    newProject.classList.add('drop-down-content');
                    changeProjectButton.append(newProject);
                    mainPage.classList.remove('blur');
                    headerPage.classList.remove('blur');
                    addProject.classList.remove('show');
                    storage.temporaryProject.push(newProjectName.value);
                    changeCurrentPro.changePro();
                }, {once: true})
            }
        }
        

        const changeCurrentProject = (()=>{
            const incomplete = document.querySelector('.incomplete');
            const complete = document.querySelector('.complete');
            const allTasks = document.querySelector('.all-tasks');

            function changeWorkingProject(e){
                if (incomplete.classList.contains('active')){
                    incomplete.classList.remove('active');
                }
                else if (complete.classList.contains('active')){
                    complete.classList.remove('active');
                }
                else if (allTasks.classList.contains('active')){
                    allTasks.classList.remove('active');
                }
                if(!e.target.classList.contains('active')){
                    render(getCurrentProject(),e.target.classList[0]);
                    e.target.classList.add('active');
                }
                

            }
            incomplete.addEventListener('click', changeWorkingProject);
            complete.addEventListener('click', changeWorkingProject);
            allTasks.addEventListener('click', changeWorkingProject);
        })();


        addProjectButton.addEventListener('click', newProject);
    }

    

    const init = (() =>{
        loadAllProject();
        render(getCurrentProject());
        changingProject();
        addTask();
        deleteTask();
        
        
    })();

});
export{initialPageLoad};
