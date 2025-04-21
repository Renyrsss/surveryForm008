import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// const withMT = require("@material-tailwind/react/utils/withMT");

import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), react()],
});
