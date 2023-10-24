const forgotform = document.getElementById("forgotform");
forgotform.addEventListener("submit", forgotPassword);

function forgotPassword(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = {}
    for (let [name, value] of formData) {
        user[name] = value;
    }
    console.log(user);

    axios.post("http://localhost:3000/auth/password/forgotpassword", user).then((res) => {
        console.log(res);
    }).catch(err => {
        console.log(err);
        alert(err.response.data.message)
    })
}