import request from "../utils/request.js";

export const listArticleService = (params) => {
  return request.get("/article", { params: params });
};
export const addArticleService = (articleModel) => {
  return request.post("/article", articleModel);
};
export const updateArticleService = (articleModel) => {
  return request.put("/article", articleModel);
};
export const deleteArticleService = (id) => {
  return request.delete("/article?id=" + id);
};
