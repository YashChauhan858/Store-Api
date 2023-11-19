import productsModel from "../model/productsModel.js";

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
    res.status(200).json({ data, count: data.length });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsStatic = (req, res, next) => {
  res.status(200).json({ message: "All products static" });
};
