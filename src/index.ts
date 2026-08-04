import 'dotenv/config';
import express from 'express';
import { BadRequestError, getCollections, getMatch, getMulti, getNewEn, getSearch, getSearchV2, getSingle } from './persistence';
const cors = require('cors');

function handleError(req, res, e) {
    console.error(`[${req.originalUrl}] ${e}`);
    if (e instanceof BadRequestError) {
        res.status(400).send({ msg: "Bad request." });
    } else {
        res.status(500).send({ msg: "An unexpected error occured." });
    }
}

function createRouter(route: string) {
    const router = express.Router();
    router.get('/', async (req, res) => {
        try {
            const result = await getMulti(route, req);
            res.status(200).send(result);
        } catch (e) {
            handleError(req, res, e);
        }
    });
    router.get('/search', async (req, res) => {
        try {
            const result = await getSearch(route, req);
            res.status(200).send(result);
        } catch (e) {
            handleError(req, res, e);
        }
    });
    router.get('/searchV2', async (req, res) => {
        try {
            const result = await getSearchV2(route, req);
            res.status(200).send(result);
        } catch (e) {
            handleError(req, res, e);
        }
    });

    // must be registered last
    router.get('/match/:id', async (req, res) => {
        try {
            const result = await getMatch(route, req);
            res.status(200).send(result);
        } catch (e) {
            handleError(req, res, e);
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const result = await getSingle(route, req);
            res.status(200).send(result);
        } catch (e) {
            handleError(req, res, e);
        }
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
        try {
            const result = await getNewEn(req);
            res.status(200).send(result);
        } catch (e) {
            handleError(req, res, e);
        }
    });
    app.use((_req, res) => {
        const obj = {
            msg: 'Invalid endpoint',
            endpoints: collections.concat('new').sort()
        };
        res.status(404).send(obj);
    });
    app.use((err, _req, res, next) => {
        res.status(500).send({ msg: "An unexpected error occured." });
        console.log(err);
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
}

main();
