import { Redis } from "ioredis";
import productsModel from "../model/productsModel.js";

// redis client: automatically hits port 6379
const redis = new Redis();

export const getAllProducts = async (req, res, next) => {
  try {
    let {
      productName,
      company,
      rating,
      feature,
      price,
      sort,
      fields,
      numericFilter,
    } = req.query;

    // Creating redis key to find / create data by
    let redisKey = JSON.stringify(req.query);
    // Fetching data from redis
    const cachedData = await redis.get(redisKey);
    // Returning data from redis if present and ending req-res cycle
    if (cachedData)
      return res.status(200).json({
        data: JSON.parse(cachedData),
        count: JSON.parse(cachedData).length,
      });

    const filterObject = {};

    if (productName) {
      // Add regex pattern with a case insensitive option
      filterObject["productName"] = { $regex: productName, $options: "i" };
    }
    if (company) {
      filterObject["company"] = company;
    }
    if (rating) {
      filterObject["rating"] = rating;
    }
    if (feature) {
      filterObject["feature"] = feature;
    }
    if (price) {
      filterObject["price"] = price;
    }

    if (numericFilter) {
      // step1 : numericFilter = price>40,rating<5
      let operatorMap = {
        ">": "$gt",
        "<": "$lt",
        ">=": "$gte",
        "<=": "$lte",
        "=": "$eq",
      };
      // step2 : numericFilter = price-$gt-40,rating-$lt-5
      Object.keys(operatorMap).map((op) => {
        if (numericFilter.includes(op)) {
          numericFilter = numericFilter.replace(op, `-${operatorMap[op]}-`);
        }
      });
      // valid allowed fields
      let options = ["price", "rating"];
      // inserting records in filterObject
      numericFilter.split(",").forEach((filter) => {
        let [field, operator, value] = filter.split("-");
        if (options.includes(field)) {
          filterObject[field] = {
            [operator]: Number([value]),
          };
        } else {
          res.status(400).json({ message: "Field is not supported" });
        }
      });
      // step3 : filterObject = { price: { $gt: 30000 }, rating: { $lt: 10 } }
    }

    let result = productsModel.find(filterObject);

    if (sort) {
      let sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    if (fields) {
      // Getting the fields we want to include ( either inclusive or exclusive )
      // cannot have "field1 -field2" either "-field1 -field2" or "field1 field2"
      let fieldString = fields.split(",").join(" ");
      result = result.select(fieldString);
    }

    let page = +req.query.page || 1;
    let limit = +req.query.limit || 10;
    let skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    let data = await result;

    // Storing data in redis with key according to the stringified query parameters
    await redis.set(redisKey, JSON.stringify(data));
    // Setting expiry time on the key ( 10 seconds )
    await redis.expire(redisKey, 10);

    res.status(200).json({ data, count: data.length });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsStatic = (req, res, next) => {
  res.status(200).json({ message: "All products static" });
};
