import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----------------------------------
   SECURITY: BLOCK DIRECT ACCESS
---------------------------------- */
app.use((req, res, next) => {
  const ua = req.headers["user-agent"] || "";

  // Allow ONLY requests from your cPanel proxy
  if (!ua.includes("MainSiteProxy")) {
    return res.status(403).send("Access denied");
  }

  next();
});

/* ----------------------------------
   STATIC FILES
---------------------------------- */
app.use(express.static(path.join(__dirname, "public"), {
  extensions: ["html"]
}));

/* ----------------------------------
   FALLBACK (SPA / direct paths)
---------------------------------- */
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ----------------------------------
   START SERVER
---------------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Render static site running on port", PORT);
});
