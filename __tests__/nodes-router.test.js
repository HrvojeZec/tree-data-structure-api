"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const nodesRouter = require("../src/router/nodes-router"); // import tvojih ruta
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/nodes", nodesRouter);
describe("Nodes API", () => {
    // Test za GET sve nodove
    it("should get all nodes", async () => {
        const response = await (0, supertest_1.default)(app).get("/nodes");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Pretpostavljamo da response body treba biti niz
    });
    // Test za GET node po ID-u
    it("should get a node by id", async () => {
        const nodeId = 1; // test vrednost za ID
        const response = await (0, supertest_1.default)(app).get(`/nodes/${nodeId}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1); // Pretpostavljamo da vraća jedan node
    });
    // Test za POST novi node
    it("should add a new node", async () => {
        const newNode = {
            title: "Test Node",
            parent_node_id: 1,
        };
        const response = await (0, supertest_1.default)(app).post("/nodes/add").send(newNode);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Node added successfully");
    });
    // Test za PUT ažuriranje noda
    it("should update an existing node", async () => {
        const nodeId = 1; // test vrednost za ID
        const updatedNode = {
            title: "Updated Test Node",
        };
        const response = await (0, supertest_1.default)(app)
            .put(`/nodes/update/${nodeId}`)
            .send(updatedNode);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Node updated successfully");
    });
    // Test za DELETE node
    it("should delete a node by id", async () => {
        const nodeId = 2; // test vrednost za ID
        const response = await (0, supertest_1.default)(app).delete(`/nodes/delete/${nodeId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Node deleted successfully");
    });
});
