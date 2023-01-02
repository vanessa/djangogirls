const { program } = require("commander");
const esbuild = require("esbuild");
const fs = require("fs");
const fse = require("fs-extra");
const log = require("fancy-log");

const paths = {
  cssSourcePath: "static/source/css",
  jsSourcePath: "static/source/js/index.js",
  imgSourcePath: "static/source/img",
  outdir: "static/build",
  imgOutdir: (outdir) => `${outdir}/img`,
  metafilePath: (outdir) => `${outdir}/metafile.json`,
};

program.option("-d, --dev", "Development mode", false);
program.parse();

const main = async () => {
  const { dev: isDevelopment } = program.opts();

  if (isDevelopment) {
    log.info("Started development server");
  } else {
    log.info("Building JS files...");
  }

  try {
    const buildOptions = getBuildOptions(isDevelopment);
    const result = await esbuild.build(buildOptions);

    if (!isDevelopment) {
      log.info(`JS files built to ${buildOptions.outdir}`);
    }

    // Write metafile to build directory so it can be picked up by Django
    fs.writeFileSync(
      paths.metafilePath(buildOptions.outdir),
      JSON.stringify(result.metafile, null, 2)
    );

    // Copy image files to build directory
    fse.copySync(paths.imgSourcePath, paths.imgOutdir(buildOptions.outdir));
  } catch (error) {
    log.error(error);
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
    outdir: paths.outdir,
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
      onRebuild(error) {
        if (error) {
          log.error(error);
        } else {
          log.info("JS files successfully built");
        }
      },
    };
  }

  return buildOptions;
};

main();
