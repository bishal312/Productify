import api from "./axios";
interface userType {
  email: string | undefined;
  name: string | null;
  imageUrl: string;
}

interface productType {
  title: string;
  description: string;
  imageUrl: string;
}

//user sync
export const syncUser = async (userData: userType) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

// products api
export const getAllProducts = async () => {
  const { data } = await api.get("/products");
  return data.products;
};

export const getProductById = async (id: string) => {
  const { data } = await api.get(`products/${id}`);
  return data;
};

export const getMyProducts = async () => {
  const { data } = await api.get("/products/my");
  return data;
};

export const createProduct = async (productData: productType) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async ({ id, ...productData }: { id: string }) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`products/${id}`);
  return data;
};

//comment api
export const createComment = async ({
  productId,
  content,
}: {
  productId: string;
  content: string;
}) => {
  const { data } = await api.post(`/comments/${productId}`, { content });
  return data;
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  const { data } = await api.delete(`/comment/${commentId}`);
  return data;
};
