import { loadLoader, callMessageModal, durationTime } from "./common.js";

let timeout = null;

/* 
* Create a card function for the dashboard
* @params {string} formid
* @params {string} title
* @params {string} description
* @params {string} created_at
* @params {string} is_disabled
* @params {string} is_published
*/

const createFormCard = ({formid, title, description, created_at, is_disabled, is_published}) => {
    // const formCard = `
    // <div class="card flex items-center w-3/5 rounded p-2 m-2">
    //     <i class="fas fa-sticky-note form-icon text-xl md:text-2xl mx-2 md:mx-5"></i>
    //     <div class="card__text w-2/5 md:w-3/5 mx-auto">
    //         <p class="card__title overflow-ellipsis overflow-hidden whitespace-nowrap">${title}</p>
    //         <p class="card__description overflow-ellipsis overflow-hidden whitespace-nowrap">${description}</p>
    //     </div>
    //     <div class="card__container ml-auto">
    //         <div class="card__cta text-xl md:text-2xl flex justify-center">
    //             <a href="/form/edit?formid=${formid}" title="Edit Form"><i class="fas fa-edit edit-icon mr-2 md:mr-5"></i></a>
    //             <a href="#" title="View Responses"><i class="fas fa-chart-line response-icon mr-2 md:mr-5"></i></a>
    //             <a href="#" title="Delete Form"><i class="fas fa-trash-alt delete-icon"></i></a>
    //         </div>
    //         <p class="card__created text-sm"><strong class="min-w-max">Created at: </strong><p class="text-xs min-w-max">${created_at}</p></p>
    //     </div>
    // </div>`;

    const formCard = document.createElement("div");
    const formIcon = document.createElement("i");
    const cardText = document.createElement("div");
    const cardTitle = document.createElement("p");
    const cardDescription = document.createElement("p");
    const cardContainer = document.createElement("div");
    const cardCta = document.createElement("div");
    const editLink = document.createElement("a");
    const responseLink = document.createElement("a");
    const deleteLink = document.createElement("a");
    const editIcon = document.createElement("i");
    const responseIcon = document.createElement("i");
    const deleteIcon = document.createElement("i");
    const cardCreated = document.createElement("p");
    const strongCreated = document.createElement("strong");
    const createdContainer = document.createElement("p");

    createdContainer.innerHTML = created_at;
    createdContainer.className = "text-xs min-w-max";
    strongCreated.innerHTML = "Created at:";
    strongCreated.className = "min-w-max";

    cardCreated.append(strongCreated, createdContainer);

    editIcon.className = "fas fa-edit edit-icon mr-2 md:mr-5";
    responseIcon.className = "fas fa-chart-line response-icon mr-2 md:mr-5";
    deleteIcon.className = "fas fa-trash-alt delete-icon";


    editLink.href = `/form/edit?formid=${formid}`;
    editLink.title = "Edit Form";
    responseLink.onclick = () => {console.log("yet to be implemented")}
    responseLink.title = "View Responses";
    deleteLink.onclick = () => {doDelete(formid)}
    deleteLink.title = "Delete Form";

    
    editLink.append(editIcon);
    responseLink.append(responseIcon);
    deleteLink.append(deleteIcon);

    if(is_published == "true" && is_disabled == "false"){
        cardCta.append(editLink, responseLink, deleteLink);
    }
    if(is_published == "false" && is_disabled == "false"){
        cardCta.append(editLink, deleteLink);
    }
    if(is_published == "false" && is_disabled == "true"){
        cardCta.append(editLink, responseLink, deleteLink);
    }

    cardCta.className = "card__cta text-xl md:text-2xl flex justify-center";

    cardContainer.className = "card__container ml-auto";
    cardContainer.append(cardCta, cardCreated);

    cardTitle.className = "card__title overflow-ellipsis overflow-hidden whitespace-nowrap";
    cardDescription.className = "card__description overflow-ellipsis overflow-hidden whitespace-nowrap"
    cardTitle.innerHTML = title;
    cardDescription.innerHTML = description;

    cardText.className = "card__text w-2/5 md:w-3/5 mx-auto";
    cardText.append(cardTitle, cardDescription);

    formIcon.className = "fas fa-sticky-note form-icon text-xl md:text-2xl mx-2 md:mx-5";
    formCard.className = "card flex items-center w-3/5 rounded p-2 m-2";
    formCard.id = formid;

    formCard.append(formIcon, cardText, cardContainer);

    const doDelete = async (id) => {
        loadLoader.showLoader();
        try {
            const response = await axios.delete(`form/delete?formid=${id}`);
            if(response.status === 200){
                loadLoader.hideLoader();
                callMessageModal("modal-success", "Success", `${title} deleted successfully`)
                setTimeout(() => {
                    const card = document.getElementById(formid);
                    card.style.display = "none";
                    card.remove();
                }, durationTime * 1000);
            }
        } catch (error) {
            loadLoader.hideLoader();
            callMessageModal("modal-error", "Error", "something wrong has happened")
            console.log(error)
        }
    }

    return formCard;
}

const sectionCard = ({sectionid, title, description, formid}) => {
    // const card = `
    // <div class="form__section flex flex-col rounded my-2 p-1" id="${sectionid}">
    //     <input type="text" value="${title}" class="mb-2"/>
    //     <input type="text" value="${description} class="mb-2" />
    //     <div class="section__cta flex items-center justify-between">
    //         <i class="fas fa-trash-alt delete-section-btn text-sm text-bold cursor-pointer text-red-300" title="Delete Section"></i>
    //         <i class="far fa-plus-square new-question-btn text-sm text-bold cursor-pointer text-green-300" title="Add new Question"></i>
    //     </div>
    // </div>
    // `

    const section = document.createElement("div");
    const sectionTitle = document.createElement("input");
    const sectionDescription = document.createElement("input");
    const sectionCta = document.createElement("div");
    const deleteIcon = document.createElement("i");
    const addIcon = document.createElement("i")

    addIcon.className = "far fa-plus-square new-question-btn text-sm text-bold cursor-pointer text-green-300";
    addIcon.title = "Add New Question";
    deleteIcon.className = "fas fa-trash-alt delete-section-btn text-sm text-bold cursor-pointer text-red-300";
    deleteIcon.title = "Delete Section";

    deleteIcon.onclick = () => doDelete();

    sectionCta.className = "section__cta flex items-center justify-between";
    sectionCta.append(deleteIcon, addIcon);

    sectionDescription.value = description;
    sectionDescription.type = "text";
    sectionDescription.className = "section-description mb-2";

    sectionTitle.value = title;
    sectionTitle.type = "text";
    sectionTitle.className = "section-title mb-2";

    
    section.className = "form__section flex flex-col rounded my-2 p-1";
    section.id = sectionid;
    section.append(sectionTitle, sectionDescription, sectionCta);
    
    const doDelete = async () => {
        try {
            
            const deleteSection = await axios.delete(`/form/delete/section/${sectionid}/${formId}`);
            if(deleteSection.status === 200){
                const allSections = document.querySelectorAll(".form__section");
                const  lastId = allSections[allSections.length - 1].id;
                if(lastId === sectionid){
                    const addSectionBtn = document.getElementById("add-section-btn") || null;
                    addSectionBtn.style.display = "none";
                    addSectionBtn.remove();
                    allSections.forEach((sec, index) => {
                        sec.classList.remove("last-section");
                        if(index === allSections.length - 2){
                            sec.classList.add("last-section");
                            sec.append(addSectionBtn);
                            addSectionBtn.style.display = "block";
                        }
                    });
                }
                callMessageModal("modal-success", "Success", "Section deleted successfully");
                section.style.display = "none";
                section.remove();
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    
    const updateSectionDetails = async ()  => {
        const title = sectionTitle.value;
        const description = sectionDescription.value;
        const body = {title, description}
        console.log(body);
        try {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                await axios.patch(`/form/edit/section/${sectionid}/${formid}`, body);
            }, 800);
        } catch (error) {
            console.log(error);
        }
    }
    
    sectionTitle.addEventListener("keyup", updateSectionDetails);
    sectionDescription.addEventListener("keyup", updateSectionDetails);

    return section;
}

/* 
* Gets all forms of that specific user.
*/

const getAllForms = async () => {
    
    try {
        let userForms = await axios.get("/forms");
        userForms = userForms.data;
        return userForms;
        
    } catch (error) {
        console.log(error);
    }
}

export{
    createFormCard, 
    sectionCard,
    getAllForms,
}