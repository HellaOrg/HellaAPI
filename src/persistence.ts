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
    const result = await collection.find({}, createOptions(req)).toArray();
    return result;
}

// Gets a single document that has a key equal to the request id
// operator/char_188_helage
export async function getSingle(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const result = await collection.findOne({ keys: { $eq: req.params.id } }, createOptions(req));
    return result;
}

// Gets all documents whose keys contain the request id as a substring
// operator/match/helage
export async function getMatch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    // Find matching keys through a regex match with case insensitivity
    const result = await collection.find({ keys: { $regex: req.params.id, $options: 'i' } }, createOptions(req)).toArray();
    return result;
}

// Gets all documents where the document fields match the request params
// operator/search?data.subProfessionId=musha
export async function getSearch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const filter: Filter<Document> = {};

    for (const key in req.query) {
        if (key.charAt(key.length - 1) === '>') {
            const field = `value.${key.slice(0, -1)}`;
            filter[field] = filter[field] || {};
            filter[field].$gte = parseInt(req.query[key]);
            continue;
        }
        else if (key.charAt(key.length - 1) === '<') {
            const field = `value.${key.slice(0, -1)}`;
            filter[field] = filter[field] || {};
            filter[field].$lte = parseInt(req.query[key]);
            continue;
        }
        else {
            if (['include', 'exclude', 'limit'].includes(key)) continue;
            filter[`value.${key}`] = { $eq: req.query[key] };
        }
    }

    const result = await collection.find(filter, createOptions(req)).toArray();
    return result;
}

const operatorMap = {
    '=': '$eq',
    '!=': '$ne',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    'in': '$in',
    'nin': '$nin'
};

// Gets all documents that satisfy the request filter
// Symbols that are intended to be used in a filter must be URL encoded
// item/searchV2?filter={"data.subProfessionId":"musha"}
export async function getSearchV2(collectionName: string, req) {
    const filter = JSON.parse(req.query.filter || '{}');
    const mongoFilter: Filter<Document> = {};

    for (const [field, condition] of Object.entries(filter)) {
        const mongoField = `value.${field}`;
        if (condition && typeof condition === 'object') {
            const mongoCondition = {};
            for (const [operator, value] of Object.entries(condition)) {
                if (operatorMap[operator]) {
                    mongoCondition[operatorMap[operator]] = value;
                }
            }
            mongoFilter[mongoField] = mongoCondition;
        }
        else {
            mongoFilter[mongoField] = { $eq: condition };
        }
    }

    const collection = (await getDb()).collection(collectionName);
    const result = await collection.find(mongoFilter, createOptions(req)).toArray();
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

function createOptions(req) {
    const includeParams = req.query.include;
    const excludeParams = req.query.exclude;
    const projection = {};
    const limit = parseInt(req.query.limit) ?? 0;

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

    const options: FindOptions = { projection, limit };
    return options;
}
