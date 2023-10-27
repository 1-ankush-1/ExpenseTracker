const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const usertoken = localStorage.getItem("token");
async function onloadData() {
    try {
        if (!usertoken) {
            window.location.href = "../../login/html/login.html";
        }
        //add premium
        if (userInfo.ispremiumuser) {
            document.getElementById("Premium").removeAttribute("hidden");
            document.getElementById("openleaderboard").removeAttribute("hidden");
            document.getElementById("gotoIncomeNExpense").removeAttribute("hidden");
            buyPremium.setAttribute("hidden", "");
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
        //setting data in localstorage
        localStorage.setItem("expenses", JSON.stringify(expenses.data.data));

        //adding data in table
        for (let e of expenses.data.data) {
            createRow(e)
        }
    } catch (err) {
        console.log(err);
        if (err.response && (err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message)
        }
    }
}


//onload - fetch from server
window.addEventListener("DOMContentLoaded", onloadData);


function addExpense(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const expense = {};

    //put all data in data object
    for (let [name, value] of formData) {
        expense[name] = value;
    }

    axios.post("http://localhost:3000/expense/add", expense, {
        headers: {
            Authorization: usertoken
        }
    }).then((res) => {
        //when get response from backend add it in localstorage
        if (Object.keys(res?.data.data).length > 0) {
            //add the new expense in array
            let expenses = JSON.parse(localStorage.getItem("expenses")) ?? [];
            expenses.push(res?.data.data);

            //add the object in localstorage
            localStorage.setItem("expenses", JSON.stringify(expenses));

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
    const cato = document.createElement("td");
    cato.textContent = data.catogary;
    cato.setAttribute("style", "--bs-table-bg-type: white !important;");
    const desc = document.createElement("td");
    desc.textContent = data.desc;
    desc.setAttribute("style", "--bs-table-bg-type: white !important;");
    const amt = document.createElement("td");
    amt.textContent = data.amt;
    amt.setAttribute("style", "--bs-table-bg-type: white !important;");
    //buttons container
    let operations = document.createElement('td');
    operations.setAttribute("style", "--bs-table-bg-type: white !important;");
    let btndel = document.createElement('button');
    btndel.className = "btn btn-danger delete";
    btndel.textContent = "Delete";
    let editbtn = document.createElement("button");
    editbtn.className = "btn btn-primary me-2 edit"
    editbtn.textContent = "Edit";
    //add button in one container
    operations.appendChild(editbtn);
    operations.appendChild(btndel);

    //adding btn and td in row
    row.appendChild(cato);
    row.appendChild(desc);
    row.appendChild(amt);
    row.append(operations);
    const tbody = document.getElementById("tablebody");
    row.id = data.id;
    //add row in body
    tbody.appendChild(row);
}


function deleteNEditExpense(e) {
    e.preventDefault();

    //check if any class contains delete
    if (e.target.classList.contains("delete")) {
        let row = e.target.parentElement.parentElement;
        removeChild(row)
    }

    //check if any class contains edit
    if (e.target.classList.contains("edit")) {
        //get row and all celll data
        let row = e.target.parentElement.parentElement;
        let catogary = row.cells[0].innerText;
        let desc = row.cells[1].innerText;
        let amt = row.cells[2].innerText;
        removeChild(row)
        //putting values in input fields
        document.getElementById('catogary').value = catogary;
        document.getElementById('amt').value = amt;
        document.getElementById('desc').value = desc;
    }
}

function removeChild(row) {
    //delete item from server and localstorage
    axios.delete(`http://localhost:3000/expense/delete/${row.id}`, {
        headers: {
            Authorization: usertoken
        }
    }).then((res) => {
        //when item get deleted
        if (res.status === 200) {
            tbody.removeChild(row);

            //get expense from localstorage
            let expenses = JSON.parse(localStorage.getItem("expenses"));

            //filter data in localstorage
            const result = expenses.filter((e) => {
                return e.id !== parseInt(row.id)
            })

            //set the data again
            localStorage.setItem("expenses", JSON.stringify(result));
        }
    }).catch(err => {
        console.log(err);
        if (err.response && (err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message);
        }
    });
}

function leaderBoardHandler(e) {
    e.preventDefault();
    if (e.target.textContent.includes("LeaderBoard")) {
        leaderboardtable.removeAttribute("hidden");
        expensetable.setAttribute("hidden", "");
        e.target.textContent = "My Expense";
        fetchLeaderBoardResult();
    } else if (e.target.textContent.includes("My Expense")) {
        expensetable.removeAttribute("hidden");
        leaderboardtable.setAttribute("hidden", "");
        e.target.textContent = "LeaderBoard"
    }
}

function leaderBoardHtml(user) {
    //row 
    const row = document.createElement("tr");
    row.className = "bg-light"

    //td
    const name = document.createElement("td");
    name.textContent = user.name;
    name.setAttribute("style", "--bs-table-bg-type: white !important;");
    const ttlexpense = document.createElement("td");
    ttlexpense.textContent = user.totalexpenses ?? 0;

    //adding td in row
    row.appendChild(name);
    row.appendChild(ttlexpense);

    const tbody = document.getElementById("leaderboardtablebody");
    row.id = user.id;

    //add row in body
    tbody.appendChild(row);
}

function fetchLeaderBoardResult() {
    axios.get(`http://localhost:3000/premium/leaderboard`, {
        headers: {
            Authorization: usertoken
        }
    }).then(results => {
        if (results.status === 200) {
            const leaderboardtablebody = document.getElementById("leaderboardtablebody");
            while (leaderboardtablebody.firstChild) {
                leaderboardtablebody.removeChild(leaderboardtablebody.firstChild);
            }
            const users = results.data.data;
            for (let user of users) {
                leaderBoardHtml(user)
            }
        }
    }).catch(err => {
        console.log(`${err} fetchLeaderBoardResult`);
        alert(err.response.data.message);
    })
}

function toRazorPay(e) {
    e.preventDefault();
    axios.get(`http://localhost:3000/purchase/buypremium`, {
        headers: {
            Authorization: usertoken
        }
    }).then(res => {
        console.log(res);
        if (res.status === 201) {
            let options = {
                //order detail we get from backend so noone manuplate them directly
                "key": res.data.data.key_id,
                "order_id": res.data.data.order.id,
                //this will handel the response after the payment(update the order table)
                "handler": (result) => {
                    console.log(result);
                    axios.post(`http://localhost:3000/purchase/updatetransactionstatus`, {
                        order_id: options.order_id,
                        payment_id: result.razorpay_payment_id
                    }, {
                        headers: {
                            Authorization: usertoken
                        }
                    }).then(() => {
                        alert("you are a premium user now")
                        document.getElementById("Premium").removeAttribute("hidden");
                        buyPremium.setAttribute("hidden", "");
                        document.getElementById("openleaderboard").removeAttribute("hidden");
                        document.getElementById("gotoIncomeNExpense").removeAttribute("hidden");
                    }).catch(err => {
                        console.log(err);
                        alert(err.response.data.message);
                    });
                }
            }
            //create new object of razor pay
            const payrazor = new window.Razorpay(options);
            //open modal of razorpay
            payrazor.open();
            //call a modal to hide default behavior
            e.preventDefault();
            //if payment 
            payrazor.on('payment.failed', (response) => {
                // console.log(response);
                console.log(response);
                axios.post(`http://localhost:3000/purchase/failedtransaction`, {
                    order_id: response.error.metadata.order_id,
                    payment_id: response.error.metadata.payment_id
                }, {
                    headers: {
                        Authorization: usertoken
                    }
                }).then(() => {
                    alert("TRANSACTION FAILED.")
                }).catch(err => {
                    console.log(err);
                    alert(err.response.data.message);
                });
            })
        }
    }).catch(err => {
        console.log(err);
        if (err.response && (err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message);
        }
    });
}

//variables
const tbody = document.getElementById("tablebody");
const form = document.getElementById("MainForm");
const logout = document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "../../login/html/login.html";
})
const buyPremium = document.getElementById("buy_premium");
const openleaderboard = document.getElementById("openleaderboard")
const gotoIncomeNExpense = document.getElementById("gotoIncomeNExpense")
const DisplaySide = document.getElementById("DisplaySide");
const expensetable = document.getElementById("expensetable");
const leaderboardtable = document.getElementById("leaderboardtable");

//event listeners
tbody.addEventListener("click", deleteNEditExpense);
form.addEventListener("submit", addExpense);
buyPremium.addEventListener("click", toRazorPay);
openleaderboard.addEventListener("click", leaderBoardHandler);
gotoIncomeNExpense.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../html/incomeNexpense.html";
});
gotoIncome.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "../html/income.html";
})