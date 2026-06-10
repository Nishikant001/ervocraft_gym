const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(
  "/api/auth",
  require("./routes/auth.routes")
);
app.use(
  "/api/branches",
  require("./routes/branch.routes")
);

app.use(
  "/api/subscriptions",
  require("./routes/subscription.routes")
);

app.use(
"/api/payments",
require(
"./routes/payment.routes"
)
);

app.use(
"/api/user-subscriptions",
require(
"./routes/userSubscription.routes"
)
);

app.use(
 "/api/admin",
 require(
 "./routes/admin.routes"
 )
);

app.use(
"/api/trainers",
require("./routes/trainer.routes")
);

app.use(
"/api/goals",
require("./routes/goal.routes")
);

app.use(
"/api/workouts",
require("./routes/workout.routes")
);

app.use(
"/api/diets",
require("./routes/diet.routes")
);

module.exports = app;