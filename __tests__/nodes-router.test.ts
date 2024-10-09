// nodes-router.test.ts
import request from "supertest";
import { app } from "../src/server"; // Import the app directly

describe("Nodes API", () => {
  // Test for GET all nodes
  it("should get all nodes", async () => {
    const response = await request(app).get("/nodes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Expect response body to be an array
  });

  // Test for GET a node by ID
  it("should get a node by id", async () => {
    const nodeId = 1; // Test value for ID
    const response = await request(app).get(`/nodes/${nodeId}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1); // Expect it to return one node
  });

  // Uncomment to test POST, PUT, and DELETE

  // Test for POST a new node
  it("should add a new node", async () => {
    const newNode = {
      title: "Test Node",
      parent_node_id: 1,
    };

    const response = await request(app).post("/nodes/add").send(newNode);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Node added successfully");
  });

  // Test for PUT update an existing node
  it("should update an existing node", async () => {
    const nodeId = 1; // Test value for ID
    const updatedNode = {
      title: "Updated Test Node",
    };

    const response = await request(app)
      .put(`/nodes/update/${nodeId}`)
      .send(updatedNode);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Node updated successfully"
    );
  });

  // Test for PUT move a node
  it("should move a node to a new parent node", async () => {
    const nodeId = 80; // ID čvora koji se premešta
    const newParentId = 56; // ID novog roditeljskog čvora
    const response = await request(app)
      .put(`/nodes/move/${nodeId}`)
      .send({ newParentId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Node successfully moved.");
  });

  // Test for PUT change node order
  it("should change the order of a node", async () => {
    const nodeId = 85; // ID čvora čiji se redosled menja
    const newOrdering = 1; // Novi redosled
    const response = await request(app)
      .put(`/nodes/reorder/${nodeId}`)
      .send({ newOrdering });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Node order successfully changed."
    );
  });

  // Test for DELETE a node
  it("should delete a node by id", async () => {
    const nodeId = 99; // Test value for ID
    const response = await request(app).delete(`/nodes/delete/${nodeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Node deleted successfully"
    );
  });
});
