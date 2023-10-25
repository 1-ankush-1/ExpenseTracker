const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const usertoken = localStorage.getItem("token");

async function onloadData() {
    try {
        if (!usertoken) {
            window.location.href = "../../login/html/login.html";
        }

        //add premium
        if (!userInfo.ispremiumuser) {
            window.location.href = "../html/home.html";
        }

        //get data
        const expenses = await axios.get(`http://localhost:3000/expense`, {
            headers: {
                Authorization: usertoken
            }
        });

        //check if data is empty
        if (expenses.data.data.length <= 0) {
            return;
        }

    } catch (err) {
        console.log(err);
        alert(err.response.data.message)
    }
}


//onload - fetch from server
window.addEventListener("DOMContentLoaded", onloadData);

//choose certain file
const chooseFile = document.getElementById("chooseFile")
chooseFile.addEventListener("change", (e) => {
    e.preventDefault();
    console.log(chooseFile.value)
})

//events listners
document.getElementById("dwnldFile").addEventListener("click", (e) => {
    e.preventDefault();
    TableToExcel.convert(document.getElementById("yearTable"))
});
document.getElementById("gotohome").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../html/home.html";
});
