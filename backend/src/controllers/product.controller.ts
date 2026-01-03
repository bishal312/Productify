import type { Response, Request } from "express";

import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

//all products
export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await queries.getAllProducts();
    return res.status(200).json({ message: "All Products: ", products });
  } catch (error) {
    console.error("Error occurs while fetcing products: ", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

//single product by id(public)
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await queries.getProductById(id);

    if (!product) return res.status(404).json({ error: "product not found" });

    return res.status(200).json({ message: "Product: ", product });
  } catch (error) {
    console.error("Error getting product: ", error);
    return res.status(500).json({ error: "Failed to get Product" });
  }
}

//Get product by current user(protected)
export async function getMyProducts(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    const products = await queries.getProductsByUserId(userId);
    return res.status(200).json({ error: "your all products: ", products });
  } catch (error) {
    console.error("Error finding products", error);
    return res.status(500).json({ error: "Failed to get user's products" });
  }
}

//create product(protected)
export async function createProduct(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Title, description and image is required!" });
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });
    return res
      .status(201)
      .json({ message: "product created successfully: ", product });
  } catch (error) {
    console.error("Error occured while creating product: ", error);
    return res.status(500).json({ error: "Failed to create a product" });
  }
}

//update product (Protected - owner only)
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized!" });

    const existingProduct = await queries.getProductById(id);
    if (!existingProduct) {
      return res.status(400).json({ error: "product not found!" });
    }
    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own products" });
    }
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Title, description and image is required!" });
    }
    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl,
    });
  } catch (error) {
    console.error("Error occured while updating product: ", error);
    return res.status(500).json({ error: "Failed to update a product" });
  }
}

//delete product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized!" });

    const existingProduct = await queries.getProductById(id); //only owner can delete product
    if (!existingProduct) {
      return res.status(404).json({ error: "product not found!" });
    }
    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own products" });
    }
    const product = await queries.deleteProduct(id);
    return res
      .status(200)
      .json({ message: "product deleted successfully: ", product });
  } catch (error) {
    console.error("Error occured while deleting product: ", error);
    return res.status(500).json({ error: "Failed to delete a product" });
  }
}
