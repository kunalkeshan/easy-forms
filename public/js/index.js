const signInForm = document.getElementById("index__signin") || null;
const signUpForm = document.getElementById("index__signup") || null;

const updateFormStyles = (singInFormStyle = "", signUpFormStyle = "") => {
    signInForm.style.display = singInFormStyle;
    signUpForm.style.display = signUpFormStyle;
}

const updateForm = () => {
    const currentForm = window.location.search;
    if(currentForm === ""){
        updateFormStyles("block", "none");
    } else if (currentForm === "?signup") {
        updateFormStyles("none", "block");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateForm();
})

if(signInForm){
    signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = document.getElementById("signin__user") || null;
        const password = document.getElementById("signin__password") || null;

        if(user || password){
            const checkEmail = user.value.includes("@");

            const body = {
                user: user.value,
                password: password.value,
                type: null
            }

            if(user.value === "") {
                alert("Username or Email cannot be empty");
                return;
            }
            if(password.value === ""){
                alert("Password Cannot be empty");
                return;
            }

            if(checkEmail) body.type = 0;
            else body.type = 1;

            try {
                
                const signin = await axios.post("/signin", body)
                console.log(signin)
                if(signin.status = 200){
                    window.location.replace("/home")
                }
                
            } catch (error) {
                console.log(error);
            }
        }

    })
}

if(signUpForm){
    signUpForm.addEventListener("submit", (event) => {
        event.preventDefault();
    })
}