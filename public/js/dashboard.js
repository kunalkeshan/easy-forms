import { getAllForms, createFormCard } from "./common.js";

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
    activeFormsContainer,
    savedFormsContainer, 
    archivedFormsContainer,
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
    const formTitle = document.getElementById("create-form-title") || null;
    const formDesc = document.getElementById("create-form-desc") || null;

    const body = {
        title: formTitle.value,
        description: formDesc.value,
    }

    if(body.title === "" || body.description === ""){
        alert("Title and Descrition is required!");
        return;
    }

    try {
        
        const newForm = await axios.post("/form/create", body);
        if(newForm.status === 200){
            const {formid} = newForm.data.form;
            window.location.replace(`/form/create?formid=${formid}`)
        } else throw new Error();

    } catch (error) {
        console.log(error);
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
    console.log(allForms)
    allForms.forEach((form) => {
        if(form.is_published == "true" && form.is_disabled == "false"){
            activeFormsContainer.innerHTML += createFormCard(form);
        }
        if(form.is_published == "false" && form.is_disabled == "false"){
            savedFormsContainer.innerHTML += createFormCard(form);
        }
        if(form.is_published == "false" && form.is_disabled == "true"){
            archivedFormsContainer.innerHTML += createFormCard(form);
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    hideAllPages();
    buttonFunc();
    pages["createFormPage"].style.display = "block";
    createForm.addEventListener("submit", (e) => handleCreateForm(e));
    updateFormsContainer()
})