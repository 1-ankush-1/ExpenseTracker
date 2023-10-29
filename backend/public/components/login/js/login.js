const loginform = document.getElementById("loginform");
loginform.addEventListener("submit", Login);
const openforgotpassword = document.getElementById("openforgotpassword");
openforgotpassword.addEventListener("click", handelForgotPassword);

function Login(e) {
    e.preventDefault();

    const userformdata = new FormData(e.target);
    const userdata = {}

    for (let [name, value] of userformdata) {
        userdata[name] = value;
    }

    axios.post("http://localhost:3000/auth/login", userdata).then((result) => {
        if (result.status === 200) {
            alert(result.data.message);
            // console.log(result.data.data);
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("userInfo", JSON.stringify(result.data.data));
            window.location.href = "../../home/html/home.html";
        }
    }).catch(err => {
        console.log(err);
        if (err.response && (err.response.status === 401 || err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message)
        }
    })
}

function handelForgotPassword(e) {
    e.preventDefault();
    window.location.href = "../../login/html/forgot.html"
}