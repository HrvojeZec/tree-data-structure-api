# Tree Structure API

## Struktura baze podataka

- `id`: Primarni ključ čvora .
- `title`: Naziv čvora.
- `parent_node_id`: ID roditeljskog čvora.
- `ordering`: Redoslijed unutar istog roditeljskog čvora.

# API rute

- GET /nodes Dohvaća sve čvorove.
- GET /nodes/:id Dohvaća specifičan čvor.
- POST /nodes/add Dodaje novi čvor.
- PUT /nodes/update/:id Ažurira postojeći čvor.
- PUT /nodes/reorder/:id Mijenja redoslijed čvorova unutar istog roditeljskog čvora.
- PUT /nodes/move/:id Premješta čvor.
- DELETE /nodes/delete/:id Briše čvor.

# Pokretanje aplikacije

1. Klonirajte repozitorij.
2. Instalirajte pakete: npm install.
3. Kreirajte .env datoteku s postavkama za bazu podataka.
4. Pokrenite aplikaciju: npm run dev.
