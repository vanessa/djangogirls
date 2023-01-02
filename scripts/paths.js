module.exports = {
  cssSourcePath: "static/source/css",
  jsSourcePath: "static/source/js/index.js",
  imgSourcePath: "static/source/img",
  outdir: "static/build",
  imgOutdir: (outdir) => `${outdir}/img`,
  metafilePath: (outdir) => `${outdir}/metafile.json`,
};
