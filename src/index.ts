import 'dotenv/config';
import express from 'express';
import { getCollections, getMatch, getMulti, getNewEn, getSearch, getSearchV2, getSingle } from './persistence';
const cors = require('cors');

function createRouter(route: string) {
    const router = express.Router();
    router.get('/', async (req, res) => {
        const result = await getMulti(route, req);
        if (!result) res.status(404).send({ msg: 'Not found' });
        else res.status(200).send(result);
    });
    router.get('/search', async (req, res) => {
        const result = await getSearch(route, req);
        if (!result) res.status(404).send({ msg: 'Not found' });
        else res.status(200).send(result);
    });
    router.get('/searchV2', async (req, res) => {
        const result = await getSearchV2(route, req);
        if (!result) res.status(404).send({ msg: 'Not found' });
        else res.status(200).send(result);
    });

    // must be registered last
    router.get('/match/:id', async (req, res) => {
        const result = await getMatch(route, req);
        if (!result) res.status(404).send({ msg: 'Not found' });
        else res.status(200).send(result);
    });
    router.get('/:id', async (req, res) => {
        const result = await getSingle(route, req);
        if (!result) res.status(404).send({ msg: 'Not found' });
        else res.status(200).send(result);
    });
    return router;
}

async function main() {
    const app = express();
    app.use(cors());
    const collections = await getCollections();
    for (const collection of collections) {
        app.use('/' + collection, createRouter(collection));
    }
    app.use('/new', async (req, res) => {
        const result = await getNewEn(req);
        res.status(200).send(result);
    });
    app.use((_req, res) => {
        const obj = {
            msg: 'Invalid endpoint',
            endpoints: collections.concat('new').sort()
        };
        res.status(404).send(obj);
    });
    app.use((err, _req, res, next) => {
        res.status(500).send("Uh oh! An unexpected error occured.");
        console.log(err);
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
}

main();
