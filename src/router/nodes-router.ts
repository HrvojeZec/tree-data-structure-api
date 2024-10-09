import express, { Request, Response, NextFunction } from "express";
import {
  getAllNodes,
  getNode,
  addNode,
  updateNode,
  deleteNode,
  changeNodeOrder,
  moveNode,
} from "./nodes-service";
const {
  CustomBadRequest,
  CustomInternalServerError,
  CustomNotFound,
} = require("../middleware/CustomError");

const router = express.Router();

// GET all nodes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getAllNodes();
    if (!response) {
      throw new CustomNotFound("No nodes found");
    }
    res.json(response);
  } catch (error: any) {
    console.error("Error fetching nodes: ", error);
    next(error);
  }
});

// GET a specific node by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new CustomBadRequest("Invalid node ID"));
  }

  try {
    const response = await getNode(id);
    if (!response) {
      throw new CustomNotFound(`Node with ID ${id} not found`);
    }
    res.json(response);
  } catch (error: any) {
    console.error("Error fetching node: ", error);
    next(error);
  }
});

// POST add a new node
router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  const { title, parent_node_id } = req.body;
  if (!title || isNaN(parent_node_id)) {
    return next(
      new CustomBadRequest("Title and valid parent_node_id are required")
    );
  }

  try {
    const response = await addNode(title, parent_node_id);
    res.json(response);
  } catch (error: any) {
    console.error("Error adding node: ", error);
    next(new CustomInternalServerError("Failed to add node", error));
  }
});

// PUT update an existing node by ID
router.put(
  "/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!title || isNaN(id)) {
      return next(new CustomBadRequest("Valid title and node ID are required"));
    }

    try {
      const response = await updateNode(title, id);
      if (!response) {
        throw new CustomNotFound(`Node with ID ${id} not found`);
      }
      res.json(response);
    } catch (error: any) {
      console.error("Error updating node: ", error);
      next(error);
    }
  }
);

// PUT move a node to a new parent node
router.put(
  "/move/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { newParentId } = req.body;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || isNaN(newParentId)) {
      return next(
        new CustomBadRequest("Valid node ID and new parent ID are required")
      );
    }

    try {
      const response = await moveNode(newParentId, id);
      if (!response) {
        throw new CustomNotFound(`Node with ID ${id} not found`);
      }
      res.json(response);
    } catch (error: any) {
      console.error("Error moving node: ", error);
      next(error);
    }
  }
);

// PUT reorder a node
router.put(
  "/reorder/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { newOrdering } = req.body;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || isNaN(newOrdering)) {
      return next(
        new CustomBadRequest("Valid node ID and new ordering are required")
      );
    }

    try {
      const response = await changeNodeOrder(id, newOrdering);
      if (!response) {
        throw new CustomNotFound(`Node with ID ${id} not found`);
      }
      res.json(response);
    } catch (error: any) {
      console.error("Error reordering node: ", error);
      next(error);
    }
  }
);

// DELETE a node by ID
router.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(new CustomBadRequest("Invalid node ID"));
    }

    try {
      const response = await deleteNode(id);
      if (!response) {
        throw new CustomNotFound(`Node with ID ${id} not found`);
      }
      res.json(response);
    } catch (error: any) {
      console.error("Error deleting node: ", error);
      next(error);
    }
  }
);

export default router;
