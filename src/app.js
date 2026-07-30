const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const {
 apiLimiter
}
=
require(
"./middleware/rateLimit.middleware"
);
const swaggerUi =
require(
"swagger-ui-express"
);

const swaggerSpec =
require(
"./config/swagger"
);

const errorHandler =
require(
"./middleware/error.middleware"
);
const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());
app.use(apiLimiter);
app.use(
 errorHandler
);

app.use(morgan("dev"));

app.use(

 "/api-docs",

 swaggerUi.serve,

 swaggerUi.setup(
   swaggerSpec
 )

);

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

app.use(
 "/api/notifications",
 require(
 "./routes/notification.routes"
 )
);

app.use(
"/api/banners",
require(
"./routes/banner.routes"
)
);

app.use(
"/api/offers",
require(
"./routes/offer.routes"
)
);

app.use(
"/api/reports",
require(
"./routes/report.routes"
)
);

app.use(
"/api/fitness-profile",
require(
"./routes/fitnessProfile.routes"
)
);

app.use(
"/api/exercises",
require(
"./routes/exercise.routes"
)
);

app.use(
"/api/user-workouts",
require(
"./routes/userWorkout.routes"
)
);

app.use(
"/api/workout-sessions",
require(
"./routes/workoutSession.routes"
)
);

app.use(
"/api/user-diets",
require(
"./routes/userDiet.routes"
)
);

app.use(
"/api/progress",
require(
"./routes/progress.routes"
)
);

app.use(
"/api/diet-progress",
require(
"./routes/dietProgress.routes"
)
);
app.use(
"/api/categories",
require(
"./routes/category.routes"
)
);

app.use(
"/api/products",
require(
"./routes/product.routes"
)
);

app.use(
"/api/cart",
require(
"./routes/cart.routes"
)
);

app.use(
"/api/orders",
require(
"./routes/order.routes"
)
);

app.use(
"/api/analytics",
require(
"./routes/analytics.routes"
)
);

app.use(
"/api/advanced-reports",
require(
"./routes/reports.routes"
)
);
module.exports = app;