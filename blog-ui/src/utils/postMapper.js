const windowColors = ['bg-[#f472b6]', 'bg-[#fef08a]', 'bg-[#a7f3d0]', 'bg-[#bfdbfe]'];

export function getPostImage(title) {
  const normalizedTitle = (title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');

  if (normalizedTitle.includes('c#') && normalizedTitle.includes('generic')) {
    return 'computer.png';
  }

  if (
    normalizedTitle.includes('web') &&
    normalizedTitle.includes('api') &&
    normalizedTitle.includes('katman') &&
    normalizedTitle.includes('mimari')
  ) {
    return 'webapi.png';
  }

  if (
    normalizedTitle.includes('yapay') &&
    normalizedTitle.includes('zeka') &&
    normalizedTitle.includes('destekli') &&
    normalizedTitle.includes('blog')
  ) {
    return 'ai.png';
  }

  if (normalizedTitle.includes('sql') && normalizedTitle.includes('injection')) {
    return 'sql.png';
  }

  if (
    normalizedTitle.includes('asp.net') &&
    normalizedTitle.includes('service') &&
    normalizedTitle.includes('katman')
  ) {
    return 'asp.png';
  }

  if (
    normalizedTitle.includes('react') &&
    normalizedTitle.includes('component') &&
    normalizedTitle.includes('mantig')
  ) {
    return 'react.png';
  }

  return null;
}

export function getPostItems(response) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.items || response?.data || response?.posts || [];
}

export function formatPostDate(value, locale = 'tr-TR') {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function mapPostToArticle(post, index = 0, locale = 'tr-TR') {
  return {
    id: post.id,
    category: post.categoryName || 'GENEL',
    title: post.title,
    excerpt: post.content,
    content: post.content,
    date: formatPostDate(post.createdAt, locale),
    authorId: post.authorId,
    categoryId: post.categoryId,
    image: getPostImage(post.title),
    windowColor: windowColors[index % windowColors.length],
  };
}
