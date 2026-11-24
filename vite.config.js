// vite.config.js
// Tells Vite's bundler (Rollup) that each of these HTML files is a page of its own.
import { defineConfig } from "vite";
import { resolve } from "path";


export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index:    resolve(__dirname, "index.html"),
                login:    resolve(__dirname, "login.html"),
                main:     resolve(__dirname, "main.html"),
                discover:  resolve(__dirname, "discover.html"),
                addActivities: resolve(__dirname, "addActivities.html"),
                activity:  resolve(__dirname, "activity.html"),
                shareExperience:  resolve(__dirname, "shareExperience.html"),
                settings:  resolve(__dirname, "settings.html"),
                savedActivities:  resolve(__dirname, "savedActivities.html"),
                profile:  resolve(__dirname, "profile.html")
            }
        }
    }
});
