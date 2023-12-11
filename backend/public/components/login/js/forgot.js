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

    axios.post("http://34.229.6.78:4000/auth/password/forgetpassword", user).then((res) => {
        if (res.status === 200) {
            alert("check you mail successfully sended")
        }
    }).catch(err => {
        console.log(err);
        alert(err.response.data.message)
    })
}