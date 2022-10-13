import connection from "../database.js";

export async function usersRanking(req, res) {

    try {
        const ranking = await connection.query('SELECT users.id, users.name, COUNT(shortenedurls."userId") as "linksCount", SUM(shortenedurls."visitCount") as "visitCount" FROM shortenedurls LEFT JOIN users ON shortenedurls."userId"=users.id GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;');

        res.status(200).send(ranking.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};