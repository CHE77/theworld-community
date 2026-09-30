const normalizeBasePath = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed || trimmed === '/') return '';
  const withoutLeading = trimmed.replace(/^\/+/, '');
  const withoutTrailing = withoutLeading.replace(/\/+$/, '');
  return withoutTrailing ? `/${withoutTrailing}` : '';
};

module.exports = function (eleventyConfig) {
  const basePath = normalizeBasePath(process.env.SITE_BASE_PATH);

  eleventyConfig.addPassthroughCopy({
    'src/images': 'images',
    'src/css': 'css',
    'src/js': 'js'
  });

  // Source content uses root-relative links because the production custom domain
  // will live at /. GitHub project Pages lives under /theworld-community/, so
  // preview builds rewrite internal root-relative href/src attributes at build time.
  if (basePath) {
    eleventyConfig.addTransform('site-base-path', function (content, outputPath) {
      if (!outputPath || !outputPath.endsWith('.html')) return content;
      return content
        .replace(/\b(href|src)="\/(?!\/)/g, `$1="${basePath}/`)
        .replace(/\b(href|src)='\/(?!\/)/g, `$1='${basePath}/`);
    });
  }

  return {
    cleanOutputDir: true,
    pathPrefix: basePath || '/',
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data'
    }
  };
};
