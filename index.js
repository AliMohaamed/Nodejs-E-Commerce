import express from "express";
import dotenv from "dotenv";
import { appRouter } from "./src/app.router.js";
import { connectionDB } from "./DB/connection.js";
import { seedRoles } from "./src/seeding/seedRole.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
connectionDB();
await seedRoles();
appRouter(app, express);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
