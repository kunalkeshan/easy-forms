import { callMessageModal, loadLoader } from "./common.js";

//Toggle buttons
const profileDetailsToggle = document.querySelector(".profile__details") || null;
const profilePasswordToggle = document.querySelector(".profile__password") || null;

//animation toggle, shows which one is currently selected
const profileDetailsActive = document.querySelector(".profile__details .profile__active") || null;
const profilePasswordActive = document.querySelector(".profile__password .profile__active") || null;

//forms
const profileDetailsForm = document.getElementById("profile__details-form") || null;
const profilePasswordForm = document.getElementById("profile__password-form") || null;

//input fields - user edit details input
const detailsName = document.getElementById("details__name") || null;
const detailsUsername = document.getElementById("details__username") || null;;
const detailsEmail = document.getElementById("details__email") || null;;
const detailsPassword = document.getElementById("details__password") || null;;

//input fields - user password editing inputs
const passwordOld = document.getElementById("password__old-password") || null;;
const passwordNew = document.getElementById("password__new-password") || null;;

//all input fields
const allInputs = document.querySelectorAll(".index__input");

//error modals
const usernameError = document.getElementById("username-error") || null;
const emailError = document.getElementById("email-error") || null;
const passwordError = document.getElementById("password-error") || null;

let timeout = null;

// backend variables for existing username or email
let changeFor = 0;
let isSaved = 0;


const hideAllForms = () => {
    profileDetailsForm.style.display = "none";
    profilePasswordForm.style.display = "none";
}

const hideInputErrors = () => {
    detailsUsername.style.border = "";
    detailsEmail.style.border = "";
    passwordNew.style.border = "";
    passwordOld.style.border = "";
    usernameError.style.animation = "";
    emailError.style.animation = "";
    passwordError.style.animation = "";
    usernameError.style.display = "";
    emailError.style.display = "none";
    passwordError.style.display = "none";
}

const showUsernameError = () => {
    detailsUsername.style.border = "1px solid red"
    usernameError.style.display = "block";
    usernameError.style.animation = "slideOut 1.5s ease-in-out forwards";
}

const removeUsernameError = () => {
    usernameError.style.animation = "slideIn 1.5s ease-in-out forwards";
    usernameError.style.display = "block";
}

const showEmailError = () => {
    detailsEmail.style.border = "solid 2px red";
    emailError.style.display = "block";
    emailError.style.animation = "slideOut 1.5s ease-in-out forwards";
}

const removeEmailError = () => {
    emailError.style.animation = "slideIn 1.5s ease-in-out forwards";
    emailError.style.display = "block";
}

const addAnimation = (type) => {
    if(type === "rise") return "rise 500ms ease-in-out forwards";
    else if(type === "sink") return "sink 500ms ease-in-out forwards";
    else return "";
}

const showForm = (form) => {
    hideAllForms();
    if(form === "details"){
        profileDetailsForm.style.display = "block";
        profileDetailsActive.style.animation = addAnimation("rise");
        profilePasswordActive.style.animation = addAnimation("sink");
        detailsUsername.focus();
    }
    else {
        profilePasswordForm.style.display = "block";
        profileDetailsActive.style.animation = addAnimation("sink");
        profilePasswordActive.style.animation = addAnimation("rise");
        passwordOld.focus();
    }
}

allInputs.forEach((input, index) => {
    
    let name, username, email, password, newPassword;
    name= username= email = password= newPassword = "";
        input.addEventListener("keyup", () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                if(index == 0) username = input.value;
                if(index == 1) name = input.value;
                if(index == 2) email = input.value;

                let body = {name, username, email, password, newPassword, changeFor, isSaved}

                try {
                    const response = await axios.post(`/profile/edit`, body);
                    let check = response.data.detailsExist;

                    hideInputErrors();
                    if(check.username) showUsernameError();
                    else removeUsernameError();

                    if(check.email) showEmailError();
                    else removeEmailError();

                } catch (error) {
                    console.log(error);
                }
            }, 300)
        })
})

const handleEditDetails = async (e) => {
    e.preventDefault();
    const data = new FormData(profileDetailsForm);
    const name = data.get("name");
    const email = data.get("email");
    const username = data.get("username");
    const password = data.get("password");
    const newPassword = "";
    isSaved = 1;

    const body = {
        name, email, username, password, newPassword, changeFor, isSaved
    }
    

    try {
        
        const response = await axios.post("/profile/edit", body);
        loadLoader.showLoader();
        if(response.status === 200){
            setTimeout(() => {
                loadLoader.hideLoader();
                callMessageModal("modal-success", "Success", "Detials Edited Successfully");

                detailsUsername.value = username;
                detailsEmail.value = email;
                detailsName.value = name;
                document.getElementById("username").innerHTML = name;
                
            }, 500);
        }
    } catch (error) {
        loadLoader.hideLoader();
        callMessageModal("modal-error", "Error", "Some error has occured");
        console.log(error);
    }
    
    
}

const handleChangePassword = async (e) => {
    e.preventDefault();
    const data = new FormData(profilePasswordForm);
    const password = data.get("old-password");
    const newPassword = data.get("new-password");
    let name, email, username;
    name = email = username = "";
    changeFor = 1;
    isSaved = 1;

    const body = {
        name, email, username, password, newPassword, changeFor, isSaved
    }

    try {
        
        const response = await axios.post("/profile/edit", body);
        console.log(response);
        loadLoader.showLoader();
        if(response.status === 200 && !response.data.detailsExist){
            setTimeout(() => {
                loadLoader.hideLoader();
                callMessageModal("modal-success", "Success", response.data.message);
                passwordOld.value = "";
                passwordNew.value = "";

            }, 500);
        } else {
            loadLoader.hideLoader();
            callMessageModal("modal-error", "Try Again", "New password cannot be same as old Password")
            passwordNew.value = "";
        }


    } catch (error) {
        loadLoader.hideLoader();
        callMessageModal("modal-error", "Error", "Incorrect Password");
    }
}

profileDetailsToggle.onclick = () => showForm("details");
profilePasswordToggle.onclick = () => showForm();

document.addEventListener("DOMContentLoaded", () => {
    showForm("details");
    hideInputErrors();
    profileDetailsForm.addEventListener("submit", (e) => handleEditDetails(e) );
    profilePasswordForm.addEventListener("submit", (e) => handleChangePassword(e));
})

