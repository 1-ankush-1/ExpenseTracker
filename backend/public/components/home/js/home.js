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
        //default page 1
        expensePagination(1);
    } catch (err) {
        console.log(err);
        if (err.response && (err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.message)
        }
    }
}


//onload - fetch from server
window.addEventListener("DOMContentLoaded", onloadData);

async function expensePagination(pageno) {
    const rowperpage = localStorage.getItem("rowperpage");
    const expensesData = await axios.get(`http://34.204.107.19/expense/get?page=${pageno}&rowperpage=${rowperpage}`, {
        headers: {
            Authorization: usertoken
        }
    });
    const { expenses, ...pageControllers } = expensesData.data
    showExpense(expenses);
    showPageControllers(pageControllers);
}

function showExpense(expenses) {
    //setting data in localstorage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    while (tbody.children[0]) {
        tbody.removeChild(tbody.children[0]);
    }

    //adding data in table
    for (let e of expenses) {
        createRow(e)
    }
}

function showPageControllers(pageControllers) {

    const div = document.getElementById("paginationController");
    const rowperpage = localStorage.getItem("rowperpage");
    //clear
    while (div.children[0]) {
        div.removeChild(div.children[0])
    }

    // Previous button
    if (pageControllers.hasPreviousPage) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Prev";
        prevBtn.classList.add('page-link'); // Add Bootstrap page-link class
        const prevItem = document.createElement("li");
        prevItem.classList.add('page-item'); // Add Bootstrap page-item class
        prevItem.appendChild(prevBtn);
        div.append(prevItem);
        prevItem.addEventListener("click", () => expensePagination(parseInt(pageControllers.currrentPage) - 1))
    }

    // Page number buttons
    for (let i = 1; i <= Math.min(pageControllers.lastPage, 5); i++) { //  5 page 
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add('page-link');
        const pageItem = document.createElement("li");
        pageItem.classList.add('page-item');
        if (i === pageControllers.currrentPage) {
            pageItem.classList.add('active');   // Highlight the current page 
        }
        pageItem.appendChild(pageBtn);
        div.append(pageItem);
        pageItem.addEventListener("click", () => expensePagination(i))
    }

    // Next button
    if (pageControllers.hasNextPage) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.classList.add('page-link');
        const nextItem = document.createElement("li");
        nextItem.classList.add('page-item');
        nextItem.appendChild(nextBtn);
        div.append(nextItem);
        nextItem.addEventListener("click", () => expensePagination(parseInt(pageControllers.currrentPage) + 1))
    }

    DisplaySide.appendChild(div);
}

//no of rows to show
document.getElementById("noOfExpenseSelection").addEventListener("change", selectNoOfExpenses);
function selectNoOfExpenses(e) {
    e.preventDefault();
    localStorage.setItem("rowperpage", e.target.value);
    console.log(e.target.value)
    expensePagination();
}

function addExpense(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const expense = {};

    //put all data in data object
    for (let [name, value] of formData) {
        expense[name] = value;
    }

    axios.post("http://34.204.107.19/expense/add", expense, {
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
    axios.delete(`http://34.204.107.19/expense/delete/${row.id}`, {
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
    const div = document.getElementById("paginationController");

    if (e.target.textContent.includes("LeaderBoard")) {
        div.setAttribute("hidden", "");
        leaderboardtable.removeAttribute("hidden");
        expensetable.setAttribute("hidden", "");
        e.target.textContent = "My Expense";
        fetchLeaderBoardResult();
    } else if (e.target.textContent.includes("My Expense")) {
        div.removeAttribute("hidden", "");
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
    axios.get(`http://34.204.107.19/premium/leaderboard`, {
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
    axios.get(`http://34.204.107.19/purchase/buypremium`, {
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
                    axios.post(`http://34.204.107.19/purchase/updatetransactionstatus`, {
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
                axios.post(`http://34.204.107.19/purchase/failedtransaction`, {
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