import connection from "../database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { registerSchema, loginSchema } from "../schemas/schema.js";

export async function postSignUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    const register = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    const validation = registerSchema.validate(register, { abortEarly: false });

    if (validation.error) {
        return res
            .status(422)
            .send(validation.error.details.map(detail => detail.message));
    };

    try {
        const passwordHash = bcrypt.hashSync(password, 10);

        const existingUser = await connection.query('SELECT email FROM users WHERE email = ($1)', [email]);
        if (existingUser.rows.length !== 0) { return res.sendStatus(409) };

        await connection.query('INSERT INTO users (name, email, password, "createdAt") VALUES ($1, $2, $3, NOW())', [name, email, passwordHash]);
        return res.sendStatus(201);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

export async function postSignIn(req, res) {
    const { email, password } = req.body;

    const validation = loginSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res
            .status(422)
            .send(validation.error.details.map(detail => detail.message));
    };

    try {
        const existingUser = await connection.query('SELECT * FROM users WHERE email = ($1)', [email]);
        if (existingUser.rows.length === 0) { return res.sendStatus(401) };


        if (existingUser.rows.length !== 0 && bcrypt.compareSync(password, existingUser.rows[0].password)) {

            const token = uuid();

            const newSession = await connection.query('SELECT * FROM sessions WHERE "userId"=($1)', [existingUser.rows[0].id]);

            if (newSession.rows[0].length === 0) {
                await connection.query('INSERT INTO sessions ("userId", token, "createdAt") VALUES ($1, $2, NOW());', [existingUser.rows[0].id, token]);
            } else {
                await connection.query('UPDATE sessions SET token=($1), "createdAt"=NOW() WHERE "userId" = ($2);', [token, existingUser.rows[0].id]);
            }

            res.status(200).send({ token: token });
        } else {
            res.sendStatus(401);
        };

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };

};