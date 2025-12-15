const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://recruitment-client-anshu-pandeys-projects.vercel.app",
  "https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"
];

export const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server / Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
