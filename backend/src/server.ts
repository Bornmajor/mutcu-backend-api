import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/error.middleWare";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "./config/cors-config";
// import swaggerDocument from "../swagger.json" assert { type: "json" };
import { usersRouter, authRouter, contactUsRouter } from "./routes/index";
import { rateLimit } from "express-rate-limit";

const port = process.env.PORT || 5000;

const app = express();

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

app.use(limiter);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // hide tech stack
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// define route path
// auth
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/contact_us", contactUsRouter);

// swagger route
// app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
// Error handling middleware for Prisma errors
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
