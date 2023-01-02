const fs = require("fs");
const esbuild = require("esbuild");
const { program } = require("commander");

const JS_FILES_PATH = "static/source/js";
const CSS_FILES_PATH = "static/source/css";

program.option("-d, --dev", "Development mode", false);
program.parse();

const main = async () => {
  const { dev: isDevelopment } = program.opts();

  if (isDevelopment) {
    console.log("Starting development server...");
  } else {
    console.log("Building JS files...");
  }

  try {
    const buildOptions = getBuildOptions(isDevelopment);
    await esbuild.build(buildOptions);
    if (!isDevelopment) {
      console.log("JS files built");
    }
  } catch (error) {
    console.error(error);
  }
};

const getBuildOptions = (isDevelopment) => {
  const javascriptFiles = fs
    .readdirSync(JS_FILES_PATH)
    .filter((file) => file.endsWith(".js"));

  const cssFiles = fs
    .readdirSync(CSS_FILES_PATH)
    .filter((file) => file.endsWith(".css"));

  const buildOptions = {
    entryPoints: [
      ...javascriptFiles.map((file) => `${JS_FILES_PATH}/${file}`),
      ...cssFiles.map((file) => `${CSS_FILES_PATH}/${file}`),
    ],
    outdir: "static/build",
  };

  if (isDevelopment) {
    buildOptions.outdir = "static/local";
    buildOptions.watch = {
      onRebuild(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("JS files built incrementally");
        }
      },
    };
  } else {
    buildOptions.minify = true;
  }

  return buildOptions;
};

main();
