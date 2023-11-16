export const getAllProducts = (req, res, next) => {
  res.status(200).json({ message: "All products" });
};
export const getAllProductsStatic = (req, res, next) => {
  res.status(200).json({ message: "All products static" });
};
