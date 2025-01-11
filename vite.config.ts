import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import * as dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [solid()],
});
