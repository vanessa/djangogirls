const fs = require("fs");
const esbuild = require("esbuild");
const { program } = require("commander");

const paths = {
  cssSourcePath: "static/source/css",
  jsSourcePath: "static/source/js/index.js",
  outdir: "static/build",
  devOutdir: "static/local",
  metafilePath: (outdir) => `${outdir}/metafile.json`,
};

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
    const result = await esbuild.build(buildOptions);
    if (!isDevelopment) {
      console.log(`JS files built to ${buildOptions.outdir}`);
    }
    fs.writeFileSync(
      paths.metafilePath(buildOptions.outdir),
      JSON.stringify(result.metafile, null, 2)
    );
  } catch (error) {
    console.error(error);
  }
};

const getBuildOptions = (isDevelopment) => {
  const cssFiles = fs
    .readdirSync(paths.cssSourcePath)
    .filter((file) => file.endsWith(".css"));

  const buildOptions = {
    entryPoints: [
      paths.jsSourcePath,
      ...cssFiles.map((file) => `${paths.cssSourcePath}/${file}`),
    ],
    entryNames: "[dir]/[name]-[hash]",
    outdir: isDevelopment ? paths.devOutdir : paths.outdir,
    minify: true,
    bundle: true,
    metafile: true,
    loader: {
      ".png": "file",
      ".jpg": "file",
    },
  };

  if (isDevelopment) {
    buildOptions.watch = {
      onRebuild(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("JS files built incrementally");
        }
      },
    };
  }

  return buildOptions;
};

main();
