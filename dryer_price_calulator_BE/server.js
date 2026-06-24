const express = require("express");
const cors = require("cors");

const offerRoutes = require("./routes/offerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/offer", offerRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});