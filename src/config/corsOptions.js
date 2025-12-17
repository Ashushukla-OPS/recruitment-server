const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://recruitment-client-anshu-pandeys-projects.vercel.app", // main prod
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server, Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Local development
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }

    // Main production domain (exact match, with or without trailing slash)
    if (
      origin === "https://recruitment-client-anshu-pandeys-projects.vercel.app" ||
      origin === "https://recruitment-client-anshu-pandeys-projects.vercel.app/"
    ) {
      return callback(null, true);
    }

    // Allow all Vercel preview deployments
    // They follow pattern: https://recruitment-client-git-*.vercel.app
    if (
      origin.endsWith(".vercel.app") &&
      origin.includes("recruitment-client")
    ) {
      return callback(null, true);
    }

    // Block everything else
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};