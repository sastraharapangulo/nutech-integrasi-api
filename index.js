import dotenv from "dotenv";
import app from "./app/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`Listening on http://localhost:${PORT}`);
});
