import connection from "../database.js";

export async function hasUser(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) { return res.sendStatus(401) };

    try {
        const session = await connection.query('SELECT * FROM sessions WHERE token = ($1)', [token]);
        if (session.rows.length === 0) { return res.sendStatus(401) };

        const user = await connection.query('SELECT * FROM users WHERE id = ($1)', [session.rows[0].userId]);
        if (user.rows.length === 0) { return res.sendStatus(404) };

        res.locals.user = user;

        next();
    } catch (error) {
        return res.sendStatus(500);
    };
};