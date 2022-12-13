import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ethers from "ethers";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/verify", async (req, res) => {
  res.json({ message: "hogehoge" });
});

app.post("/verify", async (req, res) => {
  const { message, address, signature } = req.body;
  console.log({ message, address, signature });

  if (message !== "hogehoge") {
    res.status(400).send("not match message");
    return;
  }

  const digest = ethers.utils.hashMessage(message);
  const actual = ethers.utils.recoverAddress(digest, signature);

  if (actual !== address) {
    res.status(400).send("not your sign");
    return;
  }

  res.json({ verified: true });
});

app.listen(process.env.PORT || 4000);
