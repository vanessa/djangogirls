const log = require("fancy-log");
const esbuild = require("esbuild");
const { program } = require("commander");
const { getBuildOptions, copyImages, writeMetafile } = require("./utils");

program.option("-d, --dev", "Development mode", false);
program.parse();

const main = async () => {
  const { dev: isDevelopment } = program.opts();

  if (isDevelopment) {
    log.info("Started development server!");
  } else {
    log.info("Building static assets...");
  }

  try {
    const buildOptions = getBuildOptions(isDevelopment);
    const result = await esbuild.build(buildOptions);

    if (!isDevelopment) {
      log.info(`Static assets built successfully in ${buildOptions.outdir}`);
    }

    await Promise.all([
      copyImages(buildOptions.outdir),
      writeMetafile(result.metafile, buildOptions.outdir),
    ]);
  } catch (error) {
    log.error(error);
  }
};

main();
