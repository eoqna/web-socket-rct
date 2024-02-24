const privateMsg = require("./privateMsg");
const groupMsg = require("./groupMsg");
const common = require("./common");
const mongoose = require("mongoose");

const uri = "Mongo DB URI";
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongDB Connected..."))
  .catch((err) => console.log(err));

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

common.commoninit(io);
groupMsg.groupMsginit(io);
privateMsg.privateMsginit(io);