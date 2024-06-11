import express from "express";
import ExpressFormidable from "express-formidable";
const app = express();
app.use(express.json());
app.post("/", ExpressFormidable() ,(req, res) => {
  setTimeout(() => res.send("Response from server 8082"), 500); // Simulate slow response
});
app.listen(8082, () => console.log("Server 8082 running"));
