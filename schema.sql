CREATE DATABASE tree_structure;

USE tree_structure;

CREATE TABLE nodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    parent_node_id INT,
    ordering INT,
    FOREIGN KEY (parent_node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

INSERT INTO nodes (title, parent_node_id, ordering) VALUES ('Root Node', NULL, 1);
