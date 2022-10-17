import connection from '../database.js';

export async function getUser(req, res) {
    const { user } = res.locals;

    try {
        const urls = await connection.query('SELECT users.id, users.name, SUM(shortenedurls."visitCount") FROM users JOIN shortenedurls ON users.id = shortenedurls."userId" WHERE users.id = ($1) GROUP BY users.id;', [user.id]);

        const links = await connection.query('SELECT shortenedurls.id, shortenedurls."shortUrl", shortenedurls.url, shortenedurls."visitCount" FROM shortenedurls WHERE shortenedurls."userId" = ($1);', [user.id]);

        const userData = { ...urls.rows[0], shortenedUrls: links.rows };

        res.status(200).send(userData);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};