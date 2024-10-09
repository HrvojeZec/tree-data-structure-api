import { RowDataPacket } from "mysql2";
import db from "../database/database";

interface Node {
  id: number;
  title: string;
  parent_node_id: number;
  ordering: number;
}

// Koristi RowDataPacket[] za tipizaciju rezultata iz SELECT upita
const isChild = async (id: number, newParentId: number): Promise<boolean> => {
  return id === newParentId;
};

const getNextOrdering = async (parent_node_id: number): Promise<number> => {
  const maxOrderingResult = await findMaxOrdering(parent_node_id);
  return (maxOrderingResult[0]?.maxOrdering || 0) + 1;
};

// Tipizacija za SELECT upite koristi RowDataPacket[]
const getAllNodes = async (): Promise<Node[]> => {
  const [results] = await db.query<RowDataPacket[]>("SELECT * FROM nodes");
  return results as Node[];
};

const getNode = async (id: number): Promise<Node[]> => {
  const [results] = await db.query<RowDataPacket[]>(
    "SELECT * FROM nodes WHERE id = ?",
    [id]
  );

  return results as Node[];
};

// findMaxOrdering koristi RowDataPacket[] za rezultate
const findMaxOrdering = async (
  parent_node_id: number
): Promise<{ maxOrdering: number }[]> => {
  const [maxOrderingResult] = await db.query<RowDataPacket[]>(
    "SELECT MAX(ordering) AS maxOrdering FROM nodes WHERE parent_node_id = ?",
    [parent_node_id]
  );
  return maxOrderingResult as { maxOrdering: number }[];
};

// INSERT upiti vraćaju OkPacket
const addNode = async (
  title: string,
  parent_node_id: number
): Promise<{ message: string }> => {
  const [parentNode] = await db.query<RowDataPacket[]>(
    "SELECT * FROM nodes WHERE id = ?",
    [parent_node_id]
  );

  if (parentNode.length === 0) {
    throw new Error("Cannot find parent node.");
  }

  const ordering = await getNextOrdering(parent_node_id);

  // INSERT vraća OkPacket
  const [results] = await db.query(
    "INSERT INTO nodes (title, parent_node_id, ordering) VALUES (?, ?, ?)",
    [title, parent_node_id, ordering]
  );

  await reorderNode(parent_node_id);

  // Vratite poruku o uspehu
  return { message: "Node added successfully" };
};

const updateNode = async (
  title: string,
  id: number
): Promise<{ message: string }> => {
  const [results] = await db.query("UPDATE nodes SET title = ? WHERE id = ?", [
    title,
    id,
  ]);
  return { message: "Node updated successfully" };
};

const deleteChildren = async (id: number): Promise<void> => {
  const [childrenNodes] = await db.query<RowDataPacket[]>(
    "SELECT id FROM nodes WHERE parent_node_id = ?",
    [id]
  );
  for (const child of childrenNodes as { id: number }[]) {
    await deleteChildren(child.id);
  }
  await db.query("DELETE FROM nodes WHERE id = ?", [id]);
};

const deleteNode = async (id: number): Promise<{ message: string }> => {
  if (id === 1) {
    throw new Error("Cannot delete the root node");
  }
  const findNode = await getNode(id);
  if (findNode.length === 0) {
    throw new Error("Cannot find node.");
  }
  await deleteChildren(id);
  const [results] = await db.query("DELETE FROM nodes WHERE id = ?", [id]);

  const parent_node_id = findNode[0].parent_node_id;

  await reorderNode(parent_node_id);
  return { message: "Node deleted successfully" };
};

const reorderNode = async (parent_node_id: number): Promise<void> => {
  const [nodes] = await db.query<RowDataPacket[]>(
    "SELECT id FROM nodes WHERE parent_node_id = ? ORDER BY ordering ASC",
    [parent_node_id]
  );

  for (let i = 0; i < nodes.length; i++) {
    const newOrdering = i + 1;
    await db.query("UPDATE nodes SET ordering = ? WHERE id = ?", [
      newOrdering,
      (nodes[i] as { id: number }).id,
    ]);
  }
};

const moveNode = async (
  newParentId: number,
  id: number
): Promise<{ message: string }> => {
  if (newParentId === 1) {
    throw new Error("Root node cannot be a new parent.");
  }
  const findNode = await getNode(id);
  if (findNode.length === 0) {
    throw new Error("Cannot find node.");
  }
  const findNewParentNode = await getNode(newParentId);
  if (findNewParentNode.length === 0) {
    throw new Error("Cannot find parent node.");
  }
  if (newParentId === id) {
    throw new Error("Node cannot be moved to itself.");
  }

  const isChildCheck = await isChild(id, findNewParentNode[0].parent_node_id);
  if (isChildCheck) {
    throw new Error("Node cannot be moved into one of its children.");
  }

  const newOrdering = await getNextOrdering(newParentId);

  await db.query(
    "UPDATE nodes SET parent_node_id = ?, ordering = ? WHERE id = ?",
    [newParentId, newOrdering, id]
  );

  await reorderNode(findNode[0].parent_node_id);

  return { message: "Node successfully moved." };
};

const changeNodeOrder = async (
  id: number,
  newOrdering: number
): Promise<{ message: string }> => {
  const nodeResults = await getNode(id);

  if (nodeResults.length === 0) {
    throw new Error("Node not found");
  }

  const node = nodeResults[0];
  const currentOrdering = node.ordering;
  const parentNodeId = node.parent_node_id;

  if (currentOrdering === newOrdering) {
    throw new Error("Node is already in wanted spot.");
  }

  if (currentOrdering > newOrdering) {
    await db.query(
      "UPDATE nodes SET ordering = ordering + 1 WHERE parent_node_id = ? AND ordering >= ? AND ordering < ?",
      [parentNodeId, newOrdering, currentOrdering]
    );
  } else {
    await db.query(
      "UPDATE nodes SET ordering = ordering - 1 WHERE parent_node_id = ? AND ordering > ? AND ordering <= ?",
      [parentNodeId, currentOrdering, newOrdering]
    );
  }

  await db.query("UPDATE nodes SET ordering = ? WHERE id = ?", [
    newOrdering,
    id,
  ]);

  await reorderNode(parentNodeId);
  return { message: "Node order successfully changed." };
};

export {
  getAllNodes,
  getNode,
  addNode,
  updateNode,
  deleteNode,
  moveNode,
  changeNodeOrder,
};
