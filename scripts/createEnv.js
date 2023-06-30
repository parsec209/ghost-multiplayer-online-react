import fs from "fs";

fs.writeFileSync(
  "../.env",
  `VITE_AUTH0_API_URL=${process.env.VITE_AUTH0_API_URL}\n 
  VITE_AUTH0_DOMAIN=${process.env.VITE_AUTH0_DOMAIN}\n
  VITE_AUTH0_SPA_CLIENT_ID=${process.env.VITE_AUTH0_SPA_CLIENT_ID}\n
  VITE_AUTH0_SPA_URL=${process.env.VITE_AUTH0_SPA_URL}\n
  VITE_AUTH0_CALLBACK_URL=${process.env.VITE_AUTH0_CALLBACK_URL}\n
  VITE_AUTH0_AUDIENCE=${process.env.VITE_AUTH0_AUDIENCE}\n`
);
