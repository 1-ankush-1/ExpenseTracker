const { User, ForgotPasswordRequest } = require("../model/index.js")
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/generate-token.js");
const sendMail = require("../util/send-Mail.js");
const sequelize = require("../config/connect.js");

exports.signup = (req, res, next) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(404).json({
            message: "some field are empty",
        })
    }

    const user = { name, email, phone, password }

    User.findOne({
        where: {
            email: email
        }
    }).then((result) => {
        //no user create one
        if (!result) {
            //hash the password(salt - randomness)
            bcrypt.hash(user.password, parseInt(process.env.SALT), (err, hash) => {
                if (err) {
                    console.log(`${err} in signup`)
                    return res.status(500).json({
                        message: "failed to register user",
                    })
                }
                user.password = hash;
                User.create(user).then(result => {
                    res.status(200).json({
                        message: "registered successfully",
                        data: result
                    })
                }).catch(err => {
                    console.log(`${err} in signup`);
                    res.status(500).json({
                        message: "failed to register user",
                    })
                })
            });
        } else {
            res.status(404).json({
                message: "user already exist",
            })
        }
    }).catch(err => {
        console.log(`${err} in signup`);
        res.status(500).json({
            message: "failed to register user",
        })
    })
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({
            message: "some field is empty",
        })
    }

    //check if user exist
    User.findOne({
        where: {
            email: email,
        }
    }).then(user => {
        //not exist
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        //compare incoming password with saved hash
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(`${err} in login `)
                res.status(500).json({
                    message: "failed to login"
                })
            }
            if (result) {
                //except password send everything
                let { password: userPassword, ...userDataToSend } = user.dataValues;
                let token = generateToken(userDataToSend.id, userDataToSend.name);
                return res.status(200).json({
                    message: "User login sucessful", token: token, data: userDataToSend
                })
            } else {
                return res.status(401).json({
                    message: "incorrect password"
                })
            }
        });
    }).catch(err => {
        console.log(`${err} in login `)
        res.status(500).json({
            message: "failed to login"
        })
    })
}

exports.forgotPassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { email } = req.body;
        //to get userid
        const user = await User.findOne({
            where: {
                email
            }
        }, { transaction: t })

        if (!user) {
            throw new Error('User not found');
        }

        const forgotDetails = await ForgotPasswordRequest.create({ isactive: false, userId: user.id }, { transaction: t })

        //mail body to send
        const mailBody = {
            id: forgotDetails.id,
            receiver: email
        }

        const mailID = await sendMail(mailBody);
        // console.log(mailID);
        if (mailID) {
            await t.commit();
            return res.status(200).send({
                message: "reset mail successfully sended",
                data: mailBody
            });
        }
        throw new Error('Mail not sent');
    } catch (err) {
        await t.rollback();
        console.log(`${err} in forgotPassword`)
        res.status(500).json({
            message: "failed to send reset mail"
        })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { forgotid } = req.params;
        const forgotDetails = await ForgotPasswordRequest.findByPk(forgotid);

        if (!forgotDetails.isactive) {
            return res.status(200).send(formBodyHtml(forgotDetails.userId));
        }

        throw new Error('link expired');
    } catch (err) {
        console.log(`${err} in resetPassword`)
        res.status(500).send(`<script>alert("Link expired create another link")</script>`)
    }
}


exports.updatePassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { resetid } = req.params;
        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(404).json({
                message: "some field are empty",
            })
        }
        //encrpyt the password
        bcrypt.hash(password, parseInt(process.env.SALT), async (err, hash) => {
            if (err) {
                console.log(`${err} in hasing updatePassword`)
                return res.status(500).json({
                    message: "failed to change password",
                })
            }
            //update password
            await User.update({
                password: hash
            }, {
                where: {
                    id
                }
            }, { transaction: t });

            await ForgotPasswordRequest.update({
                isactive: true
            }, {
                where: {
                    id: resetid
                }
            }, { transaction: t });

            await t.commit();
            return res.status(200).json({
                message: "password sucessfully changed"
            })
        })

    } catch (err) {
        await t.rollback();
        console.log(`${err} in updatePassword`)
        res.status(500).json({
            message: "failed to change password"
        })
    }
}


const formBodyHtml = (userId) => {
    return `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>Expense Tracker</title>
    <link rel="icon" type="image/x-icon" href="./images/logo.png" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
      crossorigin="anonymous"
    />
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
      crossorigin="anonymous"
    ></script>
  </head>
  <body>
    <div class="vh-100">
      <div class="container">
        <div class="row d-flex justify-content-center align-items-center">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6 mt-5">
            <div class="card" style="border-radius: 15px">
              <div class="card-body p-5">
                <h2 class="text-uppercase text-center mb-5">Reset Password</h2>
                <form id="resetpasswordform">
                    <div class="form-outline mb-2">
                        <label for="id" class="form-check-label" hidden>
                            Id
                        </label>
                        <input
                        type="text"
                        id="id"
                        name="id"
                        value=${userId}
                        class="form-control form-control-md"
                        hidden
                        />
                    </div>
                    <div class="form-outline mb-2">
                        <label for="password" class="form-check-label">
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-control form-control-md"
                        required
                        />
                    </div>
                    <p class="text-danger mt-3 mb-0" id="passwordmessage" hidden>
                        password doesnot match confirm password
                    </p>
                    <div class="form-outline mb-2">
                        <label for="confirmpassword" class="form-check-label">
                        Confirm Password
                        </label>
                        <input
                        type="password"
                        id="confirmpassword"
                        name="confirmpassword"
                        class="form-control form-control-md"
                        required
                        />
                    </div>
                    <div class="d-flex justify-content-center gap-2">
                        <button
                        type="submit"
                        class="btn btn-md w-50 border-1 border-black"
                        >
                        Reset Password
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--JS-->
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
      crossorigin="anonymous"
    ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
    <script >
        const resetpasswordform = document.getElementById("resetpasswordform");
        resetpasswordform.addEventListener("submit", handelResetPassword);

        function handelResetPassword(e){
            e.preventDefault();
            const resetformdata = new FormData(e.target);
            const resetdata = {};
            for(let [name,value] of resetformdata){
                resetdata[name] = value
            }
            console.log(resetdata);

            //password confirmation
            if (resetdata.password != resetdata.confirmpassword) {
                document.getElementById('passwordmessage').removeAttribute('hidden');
                return;
            } else {
                document.getElementById('passwordmessage').setAttribute('hidden', '');
            }

            //data except confirmpassword
            let { confirmpassword , ...updatedresetdata } = resetdata;

            //get reset id
            let reseturl = window.location.pathname;
            let parts = reseturl.split("/");
            let resetid = parts[parts.length - 1];
            
            //add reset id in url
            const changepass = 'http://localhost:3000/auth/password/updatepassword/'+ resetid 

            axios.put(changepass, updatedresetdata ).then((result) => {
                    if (result.status === 200) {
                    alert(result.data.message);
                }
            }).catch(err => {
                console.log(err);
                alert(err.response.data.message)
            })
        }
    </script>
  </body>
</html>
`
}