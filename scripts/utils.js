const fs = require("fs-extra");
const log = require("fancy-log");

const paths = require("./paths");

/**
 * Get build options for esbuild.
 * @param {boolean} isDevelopment - Whether the build is for development (has `-d` or `--dev` flag).
 */
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
          log.info("Static assets rebuilt successfully");
        }
      },
    };
  }

  return buildOptions;
};

/**
 * Copy image files to build directory.
 * @param {string} outdir - The build directory.
 */
const copyImages = (outdir) =>
  fs
    .copy(paths.imgSourcePath, paths.imgOutdir(outdir))
    .then(() => {
      log.info(
        `Images copied from ${paths.imgSourcePath} to ${paths.imgOutdir(
          outdir
        )}`
      );
    })
    .catch((error) => log.error(error));

/**
 * Write metafile to build directory so it can be picked up by Django.
 *
 * **Note:** This is not needed right now as we're not hashing file names yet.
 *
 * @param {string} content - The metafile content.
 * @param {string} outdir - The build directory.
 */
const writeMetafile = (content, outdir) =>
  fs
    .writeFile(paths.metafilePath(outdir), JSON.stringify(content, null, 2))
    .then(() => log.info(`Metafile written to ${paths.metafilePath(outdir)}`))
    .catch((error) => log.error(error));

module.exports = { getBuildOptions, copyImages, writeMetafile };
