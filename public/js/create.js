import {loadLoader, loadMiniLoader,  callMessageModal, loadOverlay} from "./common.js";
import {sectionCard,  createNewOption, createQuestionCard} from "./formFunctions.js";

let timeout = null;
const formTitle = document.getElementById("form__title") || null;
const formDescription = document.getElementById("form__description") || null;
const formBody = document.querySelector(".form__body")

const allSections = document.querySelectorAll(".form__section") || null;
const sectionTitles = document.querySelectorAll(".section-title") || null;
const sectionDescriptions = document.querySelectorAll(".section-description") || null;
const addSectionBtn = document.getElementById("add-section-btn") || null;
const deleteSectionBtns = document.querySelectorAll(".delete-section-btn") || null;

const newQuestionBtns = document.querySelectorAll(".new-question-btn") || null;
const deleteQuestionBtns = document.querySelectorAll(".delete-question-btn") || null;
const questionsModal = document.getElementById("questions__modal") || null;
const closeQuestionModalBtn = document.getElementById("add-question-close-btn") || null;
const createQuestionModal = document.getElementById("question-cta") || null;
const closeCreateQuestionModal = document.getElementById("close-new-question") || null;

const createOptionBtn = document.getElementById("add-option") || null;
const optionsContainer = document.getElementById("options-container") || null;
const typeOfQuestionsBtns = document.querySelectorAll(".questions__card") || null;

let type = null;

/* 
* Function to update Form title and description asynchronously without reloading the page. 
*/

const updateFormDetails = () => {
    loadMiniLoader.showLoader();
    const title = formTitle.value;
    const description = formDescription.value;
    const body = {title, description}
    try {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await axios.patch(`/form/edit/${formId}`, body);
            loadMiniLoader.hideLoader();
        }, 800);
    } catch (error) {
        loadMiniLoader.hideLoader();
        console.log(error);
    }
}

/* 
* Function to update section title and description asynchronously without reloading the page.
* @params (HTMLElement) section - The particular section to update.
* @params (number) index - index associated with that section
*/

const updateSectionDetails = (section, index)  => {
    loadMiniLoader.showLoader();
    const sectionid = section.parentElement.id;
    const title = allSections[index].children[0].value;
    const description = allSections[index].children[1].value;
    const body = {title, description}
    try {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await axios.patch(`/form/edit/section/${sectionid}/${formId}`, body);
            loadMiniLoader.hideLoader();
        }, 800);
    } catch (error) {
        loadMiniLoader.hideLoader();
        console.log(error);
    }
}

/* 
* Function to create a new section asynchronously without reloading. 
*/

const createSection = async () => {
    try {
        const newSection = await axios.post(`/form/create/section/${formId}`);
        if(newSection.status !== 200) throw new Error("Something bad happened")
        formBody.append(sectionCard(newSection.data.Section, createQuestion));
        addSectionBtn.style.display = "none";
        addSectionBtn.remove();
        const allSections = document.querySelectorAll(".form__section");

        allSections.forEach((section, index) => {
            section.classList.remove("last-section");
            if(index === allSections.length - 1){
                section.classList.add("last-section");
                section.append(addSectionBtn);
                addSectionBtn.style.display = "block";
            }
        });
        
    } catch (error) {
        console.log(error);
    }
}

/* 
* Function to delete a specific section, when the delete section button is clicked.
* @params (Event Object) e - the button that is clicked.
*/

const deleteSection = (e) => {
    loadMiniLoader.showLoader();
    const section = e.target.parentElement.parentElement;
    const sectionid = section.id;

    try {
        
        setTimeout(async () => {
            const deleteSection = await axios.delete(`/form/delete/section/${sectionid}/${formId}`);
            if(deleteSection.status !== 200) throw new Error("Something bad happended!")
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
            section.style.display = "none";
            section.remove();
            loadMiniLoader.hideLoader();
            
        }, 800)

    } catch (error) {
        loadMiniLoader.hideLoader();
        callMessageModal("modal-error", "Error", "Some error has Occured");
        console.log(error);
    }
}

/* 
* Opens the question modal, when called, or closes it.
* @params (string) method - whether to open or close the modal.
* @params (HTMLElement) container - associated with which section the question should be added to. 
*/

const handleQuestionsModal = (method, container) => {
    if(method === "open"){
            questionsModal.classList.remove("slide-left");
            questionsModal.classList.add("slide-right");
            typeOfQuestionsBtns.forEach((btn, index) => {
                switch (index) {
                    case 0:
                        type = "text"
                        break;
                    case 1:
                        type = "descriptive"
                        break;
                    case 2:
                        type = "mcq"
                        break;
                    case 3:
                        type = "box"
                        break;
                    case 4: 
                        type = "image"
                        break;
                    default:
                        break;
                }
                btn.addEventListener("click", () => {
                    createQuestion(container, type);
                    questionsModal.classList.remove("slide-right")
                    questionsModal.classList.add("slide-left");
                    optionsContainer.innerHTML = "";
                })
            })
        } else {
            type = null;
            questionsModal.classList.remove("slide-right");
            questionsModal.classList.add("slide-left");
            loadLoader.hideLoader();
            createQuestionModal.style.display="none";
            optionsContainer.innerHTML = "";
        }
}

/* 
* Function to create a new question.
* @params (HTMLElement) container - parent section container.
* @params (string) type - type of question being created.
*/

const createQuestion = (container, type) => {
    createQuestionModal.style.display = "flex";
    const sectionid = container.id;
    const createQuestionBtn = document.getElementById("create-new-question") || null;
    const question_description = document.getElementById("qcta__description") || null;
    const is_required = document.getElementById("is_required");
    const typeDivs = Array.from(createQuestionModal.getElementsByTagName("div"));
    loadOverlay.addClick(createQuestionModal, () => {
        finishCreateQuestion();
    })

    const hideAll = () => {
        typeDivs.forEach((div) => {
            div.style.display = "none"
        })
    }

    const finishCreateQuestion = () => {
        type = null;
        questionsModal.classList.remove("slide-right");
        questionsModal.classList.add("slide-left");
        createQuestionModal.style.display = "none";
        optionsContainer.innerHTML = "";
        loadOverlay.hideOverlay();
    }

    hideAll();
    question_description.value = ""
    is_required.checked = false;
    question_description.focus();

    typeDivs.forEach((div) => {
        if(Array.from(div.classList).includes(type)){
            div.style.display = "flex";
        }
    });
    loadOverlay.showOverlay();
    if(type === "box" || type === "mcq"){
        optionsContainer.innerHTML = "";
        createOptionBtn.addEventListener("click", () => createOption(type));
    }

    createQuestionBtn.addEventListener("click", async () => {
        try {

            loadMiniLoader.showLoader();
            if(question_description.value.length <= 0) {
                loadMiniLoader.hideLoader();
                question_description.value = "";
                question_description.focus();
                throw new Error(JSON.stringify({title: "Question Required", message: "A question description is required!"}))
            }

            let body = {
                question_description: question_description.value,
                is_required: is_required.checked,
                type,
            }

            const optionValues = Array.from(document.querySelectorAll(".option__value-new")) || null;

            if(!optionValues.length){
                if(type === "box" || type === "mcq"){
                    throw new Error(JSON.stringify({title: "Options required", message: "At least one option is required for an mcq type."}))
                }
            } else {
                const options = optionValues.map(option => option.value);
                console.log(JSON.stringify(options))
                body.options = options;
            }

            const newQuestion = await axios.post(`/form/create/question/${sectionid}/${formId}`, body);
            if(newQuestion.status !== 200) throw new Error("Something bad happened!")
            console.log(newQuestion.data)
            const questionsContainer = container.querySelector(".form__question");
            clearTimeout(timeout)
            timeout = setTimeout( () => {
                questionsContainer.append(createQuestionCard(newQuestion.data.question))
                loadMiniLoader.hideLoader();
                finishCreateQuestion();
            }, 800)

            } catch (error) {
                error.message = JSON.parse(error.message);
                callMessageModal("modal-error", error.message.title, error.message.message)
                loadMiniLoader.hideLoader();

            }
    })
}

/* 
*
*/

const deleteQuestion = (questionCard) => {
    loadMiniLoader.showLoader();
    const questionid = questionCard.id;

    try {
        
        setTimeout(async () => {
            const deleteQuestion = await axios.delete(`/form/delete/question/${questionid}/${formId}`);
            if(deleteQuestion.status !== 200) throw new Error("something bad happened!")
                questionCard.style.display = "none";
                questionCard.remove();
                loadMiniLoader.hideLoader();
            
        }, 500);

    } catch (error) {
        loadMiniLoader.hideLoader();
        callMessageModal("modal-error", "Error", "Some error has Occured");
        console.log(error);
    }
}

/* 
*
*/

const createOption = (type) => {
    console.log("here")
    let optionType = null;
    if(type === "box"){
        optionType = "checkbox";
    } else {
        optionType = "radio";
    }
    optionsContainer.append(createNewOption(optionType))
}


document.addEventListener("DOMContentLoaded", () => {
    formTitle.addEventListener("keyup", updateFormDetails);
    formDescription.addEventListener("keyup", updateFormDetails);
    
    addSectionBtn.addEventListener("click", createSection);
    sectionTitles.forEach((section, index) => {
        section.addEventListener("keyup", () => updateSectionDetails(section, index));
    });
    sectionDescriptions.forEach((section, index) => {
        section.addEventListener("keyup", () => updateSectionDetails(section, index));
    });
    deleteSectionBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => deleteSection(e))
    });
    newQuestionBtns.forEach((newBtn) => {
        const container = newBtn.parentElement.parentElement;
        newBtn.addEventListener("click", () => {
            handleQuestionsModal("open", container);
        });
    });
    deleteQuestionBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            const questionCard = deleteBtn.parentElement.parentElement;
            deleteQuestion(questionCard);
        })
    })
    closeQuestionModalBtn.addEventListener("click", () => handleQuestionsModal());
    closeCreateQuestionModal.addEventListener("click", () => handleQuestionsModal());
})