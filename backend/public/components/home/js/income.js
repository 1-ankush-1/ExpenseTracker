/**
 * localstore 
*/
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const usertoken = localStorage.getItem("token");

//check for premium
async function onloadData() {

    try {
        if (!usertoken) {
            window.location.href = "../../login/html/login.html";
        }

        //premium
        if (userInfo.ispremiumuser) {
            enablePremium();
        }
        console.log("in")

        //get data
        const incomes = await axios.get(`http://34.204.107.19/income`, {
            headers: {
                Authorization: usertoken
            }
        });

        //check if data is empty
        if (incomes.data.data.length <= 0) {
            return;
        }
        //setting data in localstorage
        localStorage.setItem("incomes", JSON.stringify(incomes.data.data));

        //adding data in table
        for (let e of incomes.data.data) {
            createRow(e)
        }

    } catch (err) {
        console.log(err);
        alert(err.response.data.message)
        // window.location.href = "../html/home.html";
    }
}

/**
 * onload - fetch from server
*/
window.addEventListener("DOMContentLoaded", onloadData);

/**
 * Extra variable 
*/


/**
 * Add income
*/
const incomeForm = document.getElementById("incomeForm");
incomeForm.addEventListener("submit", AddIncomeForm);

function AddIncomeForm(e) {
    e.preventDefault();
    const incomeFormData = new FormData(e.target);
    const incomeDataTosend = {}
    for (let [name, value] of incomeFormData) {
        incomeDataTosend[name] = value;
    }

    axios.post("http://34.204.107.19/income/add", incomeDataTosend, {
        headers: {
            Authorization: usertoken
        }
    }).then((res) => {

        //when get response from backend add it in localstorage
        if (Object.keys(res?.data.data).length > 0) {
            //add the new income in array
            let incomes = JSON.parse(localStorage.getItem("incomes")) ?? [];
            incomes.push(res?.data.data);

            //add the object in localstorage
            localStorage.setItem("incomes", JSON.stringify(incomes));

            //call method
            createRow(res?.data.data);

            //reset the input field data
            form.reset();
        }
    }).catch(err => {
        console.log(err)
        if (err.response && (err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message)
        }
    });
}


function createRow(data) {
    //row 
    const row = document.createElement("tr");
    row.className = "bg-light"

    //td
    const amt = document.createElement("td");
    amt.textContent = data.amt;
    amt.setAttribute("style", "--bs-table-bg-type: white !important;");
    const desc = document.createElement("td");
    desc.textContent = data.desc;
    desc.setAttribute("style", "--bs-table-bg-type: white !important;");
    //buttons container
    let operations = document.createElement('td');
    operations.setAttribute("style", "--bs-table-bg-type: white !important;");
    let btndel = document.createElement('button');
    btndel.className = "btn btn-danger delete";
    btndel.textContent = "Delete";
    //add button in one container
    operations.appendChild(btndel);

    //adding btn and td in row
    row.appendChild(amt);
    row.appendChild(desc);
    row.append(operations);
    const tbody = document.getElementById("tablebody");
    row.id = data.id;
    //add row in body
    tbody.appendChild(row);
}


/**
 * 
 * delete income
 */
const tbody = document.getElementById("tablebody");
tbody.addEventListener("click", deleteincome);

function deleteincome(e) {
    e.preventDefault();

    //check if any class contains delete
    if (e.target.classList.contains("delete")) {
        let row = e.target.parentElement.parentElement;
        removeChild(row)
    }
}

function removeChild(row) {
    //delete item from server and localstorage
    axios.delete(`http://34.204.107.19/income/delete/${row.id}`, {
        headers: {
            Authorization: usertoken
        }
    }).then((res) => {
        //when item get deleted
        if (res.status === 200) {
            tbody.removeChild(row);

            //get income from localstorage
            let incomes = JSON.parse(localStorage.getItem("incomes"));

            //filter data in localstorage
            const result = incomes.filter((e) => {
                return e.id !== parseInt(row.id)
            })

            //set the data again
            localStorage.setItem("incomes", JSON.stringify(result));
        }
    }).catch(err => {
        console.log(err);
        if (err.response && (err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message);
        }
    });
}

/**
 * enable premium feature
 */
function enablePremium() {
    document.getElementById("Premium").removeAttribute("hidden");
    document.getElementById("gotoReport").removeAttribute("hidden");
}

/**
 * logout
*/
const logout = document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "../../login/html/login.html";
})

/**
 * Redirect to home
 */
document.getElementById("gotohome").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../html/home.html";
});
