import { callMessageModal, loadLoader } from "./common.js";
import { getAllForms, createFormCard} from "./formFunctions.js";

const createFormBtn = document.getElementById("create-form") || null;
const activeFormsBtn = document.getElementById("active-forms") || null;
const archivedFormsBtn = document.getElementById("archived-forms") || null;
const savedFormsBtn = document.getElementById("saved-forms") || null;

const createFormPage = document.getElementById("create-form-page") || null;
const activeFormsPage = document.getElementById("active-forms-page") || null;
const archivedFormsPage = document.getElementById("archived-forms-page") || null;
const savedFormsPage = document.getElementById("saved-forms-page") || null;

const createForm = document.getElementById("create-form-form") || null;

const activeFormsContainer = document.getElementById("active-forms-container") || null;
const archivedFormsContainer = document.getElementById("archived-forms-container") || null;
const savedFormsContainer = document.getElementById("saved-forms-container") || null;

const pages = {
    createFormPage,
    activeFormsPage,
    savedFormsPage,
    archivedFormsPage
}

const formsContainer = {
    active: {
        name: "Active",
        container: activeFormsContainer,
    },
    saved: {
        name: "Saved",
        container: savedFormsContainer,
    },
    archived: {
        name: "Archived",
        container: archivedFormsContainer,
    }
}

const buttons = [{
    btn: createFormBtn,
    page: "createFormPage",
},
{
    btn: activeFormsBtn,
    page: "activeFormsPage",
},
{
    btn: archivedFormsBtn,
    page: "archivedFormsPage",
},
{
    btn: savedFormsBtn,
    page: "savedFormsPage"
}];

const handleCreateForm = async (e) => {
    e.preventDefault();
    loadLoader.showLoader();
    const formTitle = document.getElementById("create-form-title") || null;
    const formDesc = document.getElementById("create-form-desc") || null;

    const body = {
        title: formTitle.value,
        description: formDesc.value,
    }

    if(body.title === "" || body.description === ""){
        loadLoader.hideLoader();
        callMessageModal("modal-error", "Try again!", "Title and Description is required");
        return;
    }

    try {
        
        const newForm = await axios.post("/form/create", body);
        if(newForm.status === 200){
            loadLoader.hideLoader();
            callMessageModal("modal-success", "Success", "Form created, redirecting you to edit your form");
            setTimeout(() => {
                const {formid} = newForm.data.form;
                window.location.replace(`/form/create?formid=${formid}`)
            }, 2000);
        } else throw new Error("Some error occured");
    } catch (error) {
        loadLoader.hideLoader();
        callMessageModal("modal-success", "Error", "Something bad has happened, please try again");
        console.log(error.message);
    }
}

const hideAllPages = () => {
    for(let page in pages){
        pages[page].style.display = "none";
    }
}

const buttonFunc = () => {
    buttons.forEach(button => {
        button.btn.onclick = () => {
            changeMainContent(button.page)
        }
    })
}

const changeMainContent = (currentPage) => {
    hideAllPages();
    pages[currentPage].style.display = "block";
}

const updateFormsContainer = async () => {
    const allForms = await getAllForms();
    if(allForms.length){
        allForms.forEach((form) => {
            if(form.is_published == "true" && form.is_disabled == "false"){
                activeFormsContainer.append(createFormCard(form));
            }
            if(form.is_published == "false" && form.is_disabled == "false"){
                savedFormsContainer.append(createFormCard(form));
            }
            if(form.is_published == "false" && form.is_disabled == "true"){
                archivedFormsContainer.append(createFormCard(form));
            }
        })
    } else {
        for(let container in formsContainer){
            formsContainer[container].container.innerHTML = `<center>You have no ${formsContainer[container].name} forms.</center>`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    hideAllPages();
    buttonFunc();
    pages["createFormPage"].style.display = "block";
    createForm.addEventListener("submit", (e) => handleCreateForm(e));
    updateFormsContainer()
})