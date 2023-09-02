const app = require("./app");
const host = process?.env?.HOST || "http://localhost";
const port = process?.env?.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`server has been startrd on ${host + ":" + port}`);
});
