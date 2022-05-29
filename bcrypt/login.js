const bcrypt = require("./bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    async login(person, args) {
        if (!person) {
            return {
                result: "this email doesn't exist",
                status: "wrong_email",
            };
        } else {
            if (await bcrypt.checker(args.password, person.password)) {
                const token = await jwt.sign(
                    {
                        email: person.email,
                        password: person.password,
                    }, process.env.JWTSECRET, {expiresIn: "2d"}
                );
                return {
                    status: "logged",
                    token,
                };
            } else {
                return {
                    result: "password is wrong",
                    status: "wrong_password",
                };
            }
        }
    },
};