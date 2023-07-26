const redis = require('redis');
const redisClient = redis.createClient();

(async () => {
	await redisClient.connect();
	console.log('Redis connected');
})();

const DEFAULT_EXPIRATION = 3600;

const getOrSetCache = async (key, cb) => {
	const cacheValue = await getCache(key);
	if (cacheValue) {
		return cacheValue;
	}
	const freshValue = await cb();

	await setCache(key, freshValue);
	return freshValue;
};

const getCache = async (key) => {
	const cacheValue = await redisClient.get(key);
	if (!cacheValue) {
		return null;
	}
	return JSON.parse(cacheValue);
};
const setCache = async (key, value="") => {
	return await redisClient.setEx(
		key,
		DEFAULT_EXPIRATION,
		JSON.stringify(value),
	);
};

module.exports = {
	getOrSetCache,
};
