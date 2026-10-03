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

  // Long articles get stable local navigation; tables scroll within their panel.
  eleventyConfig.addTransform('article-readability', function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html')) return content;
    let sectionNumber = 0;
    const sections = [];
    content = content.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, label) => {
      const id = 'section-' + (++sectionNumber);
      sections.push({ id, label: label.replace(/<[^>]*>/g, '') });
      return '<h2 id="' + id + '">' + label + '</h2>';
    });
    if (sections.length >= 4 && content.includes('lang="ru"')) {
      const toc = '<nav class="article-toc" aria-label="Содержание страницы"><strong>На этой странице</strong><ul>' +
        sections.map(section => '<li><a href="#' + section.id + '">' + section.label + '</a></li>').join('') +
        '</ul></nav>';
      content = content.replace(/<h2 id="section-1">/, toc + '<h2 id="section-1">');
    }
    return content.replace(/<table([\s\S]*?)<\/table>/g,
      '<div class="table-scroll" tabindex="0" role="region" aria-label="Таблица, прокрутка по горизонтали"><table$1</table></div>');
  });

  // Source content uses root-relative links because the production custom domain
  // will live at /. GitHub project Pages lives under /theworld-community/, so
  // preview builds rewrite internal root-relative href/src attributes at build time.
  if (basePath) {
    eleventyConfig.addTransform('site-base-path', function (content, outputPath) {
      if (!outputPath || !outputPath.endsWith('.html')) return content;
      return content
        .replace(/\b(href|src)="\/(?!\/)/g, `$1="${basePath}/`)
        .replace(/\b(href|src)='\/(?!\/)/g, `$1='${basePath}/`)
        .replace(/(http-equiv="refresh" content="[^"]*url=)\/(?!\/)/gi, `$1${basePath}/`);
    });
  }

  return {
    pathPrefix: basePath || '/',
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data'
    }
  };
};
