const express = require("express");
const req = require("supertest");
const { connectDB, disconnectDB } = require("../db/connect");
const dbMiddleware = require("./db_middleware");
const ModelGenerator = require("./model_generator");
const _ = require("lodash");
const path = require('path')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
exports.prepare = (controller) => {
	return req(
		express().use(bodyParser.json())
        .use(dbMiddleware)
        .use(mockDBMiddleware())
        .use(controller)
	);
};

// mock db
let mockDb = {};
let modelGenerator;

exports.mockDb = (collection, data) => {
	if (!data) mockDb[collection] = [];
	else if (Array.isArray(data)) mockDb[collection] = data;
	else mockDb[collection] = [data];
};

const mockDBMiddleware = () => {
	return async (req, res, next) => {
		req.db = await prepareDb(req.db);
		next();
	};
};

const prepareDb = async (db) => {
	for (var x in mockDb) {
		if (!db[x]) throw new Error("incorrect mockDb name");
		try {
			mockDb[x] = await modelGenerator.generate(db[x], mockDb[x]);
		} catch (e) {
			if (!(e instanceof ValidationError) && !(e instanceof CastError))
				throw e;
		}
	}
	var ans = _.assign({}, db, mockDb);
	mockDb = {};
	return ans;
};

beforeAll(async () => {
    dotenv.config({ path : path.join(__dirname , '..' , '.env')})
	await connectDB();
	modelGenerator = new ModelGenerator();
});

afterAll(async () => {
	await modelGenerator.cleanUp().catch((a) => {});
	await disconnectDB();
});