const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require('path');

const app = express();

let corsOptions = {
  //origin: "https://localhost:3000"
  origin:"https://testpam123.herokuapp.com/"

};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/*  Static Assets  */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

const db = require("./models");
const Role = db.role;
const User = db.user;

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

db.mongoose
  .connect(`mongodb://admin:Password@ds151753.mlab.com:51753/heroku_hz3sshnp`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "teacher"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'teacher' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    };
    initialusers();
  });
}

function initialusers() {
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new User ({
        username: "adminuser",
        first: "admin",
        last: "admin",
        email: "admin@unlockit.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["5eb3bed88bb16d38c8810435"]
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to user collection");
      });

    };
  });
}


// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Lock It!." });
});

/*  Server Port Configuration */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});