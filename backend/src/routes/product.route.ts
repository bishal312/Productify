import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller";
import { requireAuth } from "@clerk/express";

const router = Router();

//GET /api/products => get all products
router.get("/", getAllProducts);

//GET /api/products/my - get current user's products (protected)
router.get("/my", requireAuth(), getMyProducts);

//GET /api/products/:id - get single product by ID (Public)
router.get("/:id", getProductById);

//POST /api/products - create new products (protected)
router.post("/", requireAuth(), createProduct);

//PUT /api/products/:id - update product (Protected - owner only)
router.put("/:id", requireAuth(), updateProduct);

//DELETE /api/products -delete product(protected)
router.delete("/:id", requireAuth(), deleteProduct);

export default router;
