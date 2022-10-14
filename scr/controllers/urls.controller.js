import { nanoid } from 'nanoid';
import connection from '../database.js';

export async function postShorten(req, res) {
    const { url } = req.body;
    const { user } = res.locals;

    try {
        const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

        const validUrl = httpRegex.test(url);
        if (validUrl === false) { return res.sendStatus(422) };

        const shortUrl = nanoid(8, url.id);
        await connection.query('INSERT INTO shortenedurls ("userId", url, "shortUrl","visitCount", "createdAt") VALUES ($1, $2, $3, $4, NOW())', [user.id, url, shortUrl, 0]);

        return res.status(201).send({ shortUrl: shortUrl });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};

export async function getSpecificShorten(req, res) {
    const { id } = req.params;

    try {
        const shortUrl = await connection.query('SELECT shortenedurls.id, shortenedurls."shortUrl", shortenedurls.url FROM shortenedurls WHERE id = ($1)', [id]);
        if (shortUrl.rows.length === 0) { return res.sendStatus(404) };
        return res.status(200).send(shortUrl.rows[0]);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
}

export async function redirectShorten(req, res) {
    const { shortUrl } = req.params;

    try {
        const url = await connection.query('SELECT shortenedurls.url FROM shortenedurls WHERE "shortUrl" = ($1)', [shortUrl]);
        if (shortUrl.rows.length === 0) { return res.sendStatus(404) };

        await connection.query('UPDATE shortenedurls SET "visitCount"= ("visitCount" + $1) WHERE "shortUrl" = ($2);', [1, shortUrl]);

        return res.redirect(url);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

export async function deleteShorten(req, res) {
    const { id } = req.params;
    const { user } = res.locals;

    try {
        const existingUrl = await connection.query('SELECT * FROM shortenedurls WHERE "shortUrl" = ($1)', [id]);
        if (existingUrl.rows.length === 0) { return res.sendStatus(404) };

        const validUrl = await connection.query('SELECT * FROM shortenedurls WHERE "shortUrl" = ($1) AND "userId" = ($2)', [id, user.id]);
        if (validUrl.rows.length === 0) {
            return res.sendStatus(401);
        } else {
            await connection.query('DELETE FROM shortenedurls WHERE id = ($1)', [id]);
            return res.sendStatus(204);
        };
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};