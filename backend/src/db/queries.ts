import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type NewUser,
  type NewComments,
  type NewProduct,
} from "./schema";

//user queries//
//create user
export const createUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
        updatedAt: new Date(),
      },
    })
    .returning();
  return user;
};

//find user
export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

//update user
export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

//upsert user
export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({ target: users.id, set: data })
    .returning();
  return user;
};

//product queries//
//create product
export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

//find all products
export const getAllProducts = async () => {
  return await db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)], //latest product first
    //THe square brackets are required because Drizzle ORM's orderBy expects an array, even for a single column.
  });
};

//find product
export const getProductById = async (id: string) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};

//find products by userid
export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: {
      user: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

//update product
export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};

//delete products
export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }
  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

//comment queries//
//create comment
export const createComment = async (data: NewComments) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

//delete comment
export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }
  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

//getCommetById
export const getCommentById = async (id: string) => {
  return await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};
