import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import Router from "./router";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for Telr webhook form data

// Enhanced CORS configuration for Flutter web apps
app.use(cors({
  origin: true, // Allow all origins with credentials support
  credentials: false, // Disable credentials to allow wildcard origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Expires',
    'Last-Modified',
    'If-Modified-Since'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Safety Zone",
    documentation: "Visit /api/doc for API documentation",
    version: "1.0.0"
  });
});


app.use('/api', Router);

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});