## Mern Bootcamp Assignment One

Task Description: Develop a Express application with TypeScript as the programming language, integrating MongoDB with Mongoose for effective data management. Ensure data integrity through validation using Joi/Zod.

### For Run the project locally

-   reomove package-lock.json file
-   npm install
-   npm run start:dev

### Apllication Routes

-   Root route: https://mb-assignment-one.vercel.app/

#### Products Routes

-   Create product (POST): https://mb-assignment-one.vercel.app/api/products
-   Get all products (GET): https://mb-assignment-one.vercel.app/api/products
-   Search products (GET): https://mb-assignment-one.vercel.app/api/products?searchTerm=iphone
-   Get single product (GET): https://mb-assignment-one.vercel.app/api/products/6685ad29aa07391d4db79667
-   Update product (PATCH): https://mb-assignment-one.vercel.app/api/products/6685ad29aa07391d4db79667
-   Delete product (DELETE): https://mb-assignment-one.vercel.app/api/products/6685ad29aa07391d4db79667

#### Orders Routes

-   Create order (POST): https://mb-assignment-one.vercel.app/api/orders
-   Get al orders (GET): https://mb-assignment-one.vercel.app/api/orders
-   Get orders by user email (GET): https://mb-assignment-one.vercel.app/api/orders?email=tanvirch7575@gmail.com
