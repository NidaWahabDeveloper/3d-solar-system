import cache from "../config/cache.js";


export const cacheRoute = (keyPrefix) => (req, res, next) => {
  
  const key = `${keyPrefix}:${req.originalUrl}`;

  const cachedBody = cache.get(key);
  if (cachedBody) {
   
    res.set("X-Cache", "HIT");
    return res.status(200).json(cachedBody);
  }

  
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body); 
    res.set("X-Cache", "MISS");
    return originalJson(body);
  };

  next(); 
};


export const clearCacheByPrefix = (prefix) => {
  const keys = cache.keys().filter((k) => k.startsWith(prefix));
  cache.del(keys);
};