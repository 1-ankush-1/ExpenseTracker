const loginform = document.getElementById("loginform");
loginform.addEventListener("submit", Login);

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
            console.log(result.data.data);
            localStorage.setItem("userInfo", JSON.stringify(result.data.data));
            window.location.href = "../../home/html/home.html";
        }
    }).catch(err => {
        console.log(err);
        if (err.response && err.response.status === 401) {
            alert(err.response.data.message)
        } else if (err.response && err.response.status === 404) {
            alert(err.response.data.message)
        } else if (err.response && err.response.status === 500) {
            alert(err.response.data.message)
        }
    })
}