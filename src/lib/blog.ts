import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'vi';
export type Post = CollectionEntry<'blog'>;

export const langs: Lang[] = ['en', 'vi'];
export const langNames: Record<Lang, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};

export const postLang = (post: Post): Lang =>
  post.id.startsWith('vi/') ? 'vi' : 'en';
export const postSlug = (post: Post) => post.id.replace(/^(en|vi)\//, '');
export const blogHref = (lang: Lang) =>
  lang === 'en' ? '/blog/' : '/vi/blog/';
export const postHref = (lang: Lang, slug: string) =>
  `${blogHref(lang)}${slug}/`;

export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', (post) => postLang(post) === lang);
  return posts.sort((a, b) => b.data.updated.localeCompare(a.data.updated));
}

/** Same guide in the other language, when a translation exists. */
export async function getTranslation(post: Post): Promise<Post | undefined> {
  const other: Lang = postLang(post) === 'en' ? 'vi' : 'en';
  const slug = postSlug(post);
  return (await getPosts(other)).find((item) => postSlug(item) === slug);
}

export function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  });
}
