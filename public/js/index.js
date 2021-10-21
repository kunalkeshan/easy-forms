const signInForm = document.getElementById("index__signin") || null;
const signUpForm = document.getElementById("index__signup") || null;

const fetchData = async (url = "", method = "", data = {}) => {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    
    return response.json();
}

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
                
                const singin = await fetchData("/signin", "POST", body);
                alert(singin.message)
                
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