import connection from '../database.js';

export async function getUser(req, res) {
    const { user } = res.locals;

    try {
        // const urls = await connection.query('SELECT * FROM 

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};