import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import apiRouter from "../config/routes.js";
import { onError, onLost } from "./middlewares/errorHandler.js";
import swaggerDocument from "../openAPI.json" with {type: "json"};

const app = express();

// Install cors
app.use(cors());

/** Install request logger */
app.use(morgan("dev"));

/** Install JSON request parser */
app.use(express.json());

// Set Public Directory
app.use("/uploads", express.static("uploads"));

/** Install Router */
app.use(apiRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handlers
app.use(onLost);
app.use(onError);

export default app;
