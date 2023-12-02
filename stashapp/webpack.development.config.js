const path = require("path");

module.exports = {
    entry: "./src/stashappLoader.js",
    mode: "development",
    output: {
        filename: "stashappLoader.js",
        path: path.resolve(__dirname, "dist"),
        library: "StashAppLoader",
        libraryTarget: "global",
        libraryExport: "default",
    },
};
