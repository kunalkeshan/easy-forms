const createFormBtn = document.getElementById("create-form") || null;
const activeFormsBtn = document.getElementById("active-forms") || null;
const archivedFormsBtn = document.getElementById("archived-forms") || null;

const createFormPage = document.getElementById("create-form-page") || null;
const activeFormsPage = document.getElementById("active-forms-page") || null;
const archivedFormsPage = document.getElementById("archived-forms-page") || null;

const createForm = document.getElementById("create-form-form") || null;

const pages = {
    createFormPage,
    activeFormsPage,
    archivedFormsPage
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
            const {formid, sectionid} = newForm.data.form;
            window.location.replace(`/form/create?formid=${formid}&sectionid=${sectionid}`)
        } else throw new Error();

    } catch (error) {
        console.log(error);
    }
}

const getAllForms = async () => {
    const formsCount = {
        active: 0,
        archived: 0
    }
    try {
        let userForms = await axios.get("/forms");
        userForms = userForms.data;
        userForms.forEach((form, index) => {
            if(form.is_disabled) formsCount.archived++;
            else formsCount.active++;
        });

        activeFormsPage.innerHTML += "You have " + formsCount.active + " active forms";
        archivedFormsPage.innerHTML += "You have " + formsCount.archived + " archived forms";
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

document.addEventListener("DOMContentLoaded", () => {
    hideAllPages();
    buttonFunc();
    pages["createFormPage"].style.display = "block";

    createForm.addEventListener("submit", (e) => handleCreateForm(e));
    getAllForms();
})