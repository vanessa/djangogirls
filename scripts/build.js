const log = require("fancy-log");
const esbuild = require("esbuild");
const { program } = require("commander");
const { getBuildOptions, copyImages } = require("./utils");

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
    await Promise.all([
      esbuild.build(buildOptions),
      copyImages(buildOptions.outdir),
    ]);

    if (!isDevelopment) {
      log.info(`Static assets built successfully in ${buildOptions.outdir}`);
    }
  } catch (error) {
    log.error(error);
  }
};

main();
