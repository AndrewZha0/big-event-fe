import request from "../utils/request.js";

export const listCategoryService = () => {
  return request.get("/category");
};

export const addCategoryService = (categoryModel) => {
  return request.post("/category", categoryModel);
};

export const updateCategoryService = (categoryModel) => {
  return request.put("/category", categoryModel);
};
export const deleteCategoryService = (id) => {
  return request.delete("/category?id=" + id);
};
