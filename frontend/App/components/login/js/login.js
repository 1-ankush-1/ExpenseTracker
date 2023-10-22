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
            window.location.href = "../../home/html/home.html";
        }
    }).catch(err => {
        alert("something went wrong");
        console.log(err);
    })
}