const app = require("./app");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = process.env.PORT || 5000;
/*console.log('Port', process.env.PORT);
console.log('Mongo URI:', process.env.MONGODB_URI);*/


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
