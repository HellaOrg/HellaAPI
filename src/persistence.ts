import { Filter, FindOptions } from 'mongodb';
import getDb from './db';

export async function getCollections() {
    const collections = await (await getDb()).collections();
    return collections.map(collection => collection.collectionName);
}

// Gets all documents from a collection
// operator
export async function getMulti(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const pipeline = createPipeline(req, {});
    const result = await collection.aggregate(pipeline).toArray();
    return result;
}

// Gets a single document that has a key equal to the request id
// operator/char_188_helage
export async function getSingle(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const match = { keys: { $eq: req.params.id } };
    const pipeline = createPipeline(req, match);
    const result = await collection.aggregate(pipeline).toArray();
    return result[0] || {};
}

// Gets all documents whose keys contain the request id as a substring
// operator/match/helage
export async function getMatch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const match = { keys: { $regex: req.params.id, $options: 'i' } };
    const pipeline = createPipeline(req, match);
    const result = await collection.aggregate(pipeline).toArray();
    return result;
}

// Gets all documents where the document fields match the request params
// operator/search?data.subProfessionId=musha
export async function getSearch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const matchStage = {};

    for (const key in req.query) {
        if (['include', 'exclude', 'limit', 'sort'].includes(key)) continue;

        if (key.endsWith('>')) {
            const field = `value.${key.slice(0, -1)}`;
            matchStage[field] = matchStage[field] || {};
            matchStage[field].$gte = parseFloat(req.query[key]);
        }
        else if (key.endsWith('<')) {
            const field = `value.${key.slice(0, -1)}`;
            matchStage[field] = matchStage[field] || {};
            matchStage[field].$lte = parseFloat(req.query[key]);
        }
        else {
            matchStage[`value.${key}`] = { $eq: req.query[key] };
        }
    }

    const pipeline = createPipeline(req, matchStage);
    const result = await collection.aggregate(pipeline).toArray();
    return result;
}

const operatorMap = {
    '=': '$eq',
    'eq': '$eq',
    '!=': '$ne',
    'ne': '$ne',
    '>': '$gt',
    'gt': '$gt',
    '>=': '$gte',
    'ge': '$gte',
    '<': '$lt',
    'lt': '$lt',
    '<=': '$lte',
    'le': '$lte',
    'in': '$in',
    'nin': '$nin'
};

// Gets all documents that satisfy the request filter
// Symbols that are intended to be used in a filter must be URL encoded
// item/searchV2?filter={"data.subProfessionId":"musha"}
export async function getSearchV2(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const filter = JSON.parse(req.query.filter || '{}');
    const matchStage = {};

    for (const [field, condition] of Object.entries(filter)) {
        const mongoField = `value.${field}`;
        if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
            const mongoCondition = {};
            for (const [operator, value] of Object.entries(condition)) {
                const mapped = operatorMap[operator];
                if (mapped) mongoCondition[mapped] = value;
            }
            matchStage[mongoField] = mongoCondition;
        }
        else {
            matchStage[mongoField] = { $eq: condition };
        }
    }

    const pipeline = createPipeline(req, matchStage);
    const result = await collection.aggregate(pipeline).toArray();
    return result;
}

// Gets all documents that have been created during the last EN update
export async function getNewEn(req) {
    const includeColls = Array.isArray(req.query.include) ? req.query.include : [req.query.include];
    const excludeColls = Array.isArray(req.query.exclude) ? req.query.exclude : [req.query.exclude];

    const collections = await (await getDb()).collections();
    const commits = await fetch('https://api.github.com/repos/HellaOrg/HellaAssets/commits').then(res => res.json());
    const hash = commits.find(commit => commit.commit.message.includes('update: en')).sha;
    const filter = { 'meta.created': hash };
    const result = {};

    for (const collection of collections) {
        if (collection.collectionName === 'about') continue;
        if (collection.collectionName.startsWith('cn')) continue;
        if (!includeColls.includes(collection.collectionName)) continue;
        if (excludeColls.includes(collection.collectionName)) continue;

        const a = await collection.find(filter).toArray();
        result[collection.collectionName] = a;
    }

    return result;
}

function createPipeline(req, matchStage = {}) {
    const includeParams = req.query.include;
    const excludeParams = req.query.exclude;
    const pipeline = [];
    const projection = {};
    const limit = parseInt(req.query.limit) || 0;

    pipeline.push({ $match: matchStage });

    if (req.query.sort) {
        const sortParam = JSON.parse(req.query.sort);
        const sortStage = {};

        for (const [field, direction] of Object.entries(sortParam)) {
            // allow "asc"/"desc" or numeric 1/-1
            const dirValue =
                typeof direction === 'string'
                    ? direction.toLowerCase() === 'desc'
                        ? -1
                        : 1
                    : direction;
            sortStage[`value.${field}`] = dirValue;
        }

        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }
    }

    // mongodb does not support including and excluding fields at the same time
    if (includeParams) {
        projection['meta'] = 1;
        projection['canon'] = 1;
        projection['keys'] = 1;
        if (Array.isArray(includeParams)) {
            includeParams.forEach(include => projection[`value.${include}`] = 1);
        }
        else {
            projection[`value.${includeParams}`] = 1;
        }
    }
    else if (excludeParams) {
        if (Array.isArray(excludeParams)) {
            excludeParams.forEach(exclude => projection[`value.${exclude}`] = 0);
        }
        else {
            projection[`value.${excludeParams}`] = 0;
        }
    }

    if (Object.keys(projection).length) {
        pipeline.push({ $project: projection });
    }

    if (limit > 0) {
        pipeline.push({ $limit: limit });
    }

    return pipeline;
}
