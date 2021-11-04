const createFormBtn = document.getElementById("create-form") || null;
const activeFormsBtn = document.getElementById("active-forms") || null;
const archivedFormsBtn = document.getElementById("archived-forms") || null;

const createFormPage = document.getElementById("create-form-page") || null;
const activeFormsPage = document.getElementById("active-forms-page") || null;
const archivedFormsPage = document.getElementById("archived-forms-page") || null;

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
}]

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
    pages["createFormPage"].style.display = "block"
})