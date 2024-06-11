import express from "express";
const app = express();
app.use(express.json());
app.post("/", (req, res) => {
  res.send("Response from the server 8083"); //Immediate response
});
app.listen(8083, () => console.log("Server 8083 running"));
