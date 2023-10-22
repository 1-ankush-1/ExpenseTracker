const signupform = document.getElementById("signupform");
signupform.addEventListener("submit", registerUser);

function registerUser(e) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    let userdata = {}

    for (let [name, value] of formdata) {
        userdata[name] = value;
    }

    //password confirmation
    if (userdata.password != userdata.confirmpassword) {
        document.getElementById('passwordmessage').removeAttribute('hidden');
        return;
    } else {
        document.getElementById('passwordmessage').setAttribute('hidden', '');
    }
    //data except confirmpassword
    let { confirmpassword, ...updatedUserData } = userdata;
    axios.post("http://localhost:3000/auth/signup", updatedUserData).then((result) => {
        if (result.status === 200) {
            alert(result.data.message);
            window.location.href = "../../login/html/login.html";
        }
    }).catch(err => {
        console.log(err);
    })
}