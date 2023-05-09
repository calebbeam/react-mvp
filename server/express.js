const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.CONNECTION_STRING });

pool.connect();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));
// app.use(express.static("client"));
// app.use(express.static(path.join(__dirname, "client/src")));

app.get("/", (req, res) => {
  //Line 9
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT"); //Line 10
});

app.get("/api/powerlifters", (req, res) => {
  pool
    .query(`SELECT * FROM powerlifter`)
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    });
});

app.post("/api/powerlifters", async (req, res) => {
  console.log(req.body)
  let gender = req.body.gender;
  let bodyWeight = req.body.bodyWeight;
  let squat = req.body.squat;
  let bench = req.body.bench;
  let deadlift = req.body.deadlift;
  let isEquipped = req.body.isEquipped;
  pool
    .query(
      `insert into powerlifter(gender, weight, squat, bench, deadlift, equipped) values ('${gender}', ${bodyWeight}, ${squat}, ${bench}, ${deadlift}, ${isEquipped}) RETURNING *;`
    )
    .then((result) => {
      res.send(result.rows[0]);
    });
});

app.delete("/api/powerlifters/:id", (req, res) => {
  let id = req.params.id
  pool.query(
    `DELETE FROM powerlifter WHERE id = ${id} RETURNING *`
  ).then((response) => {
    res.send(response.rows);
  });
});

// app.get('*', (req,res) =>{
//     res.sendFile(path.join('/home/caleb/mcsp/10-week/react-mvp/client/index.html'));
// });
app.listen(port, () => console.log(`listening on port: ${port}`));
