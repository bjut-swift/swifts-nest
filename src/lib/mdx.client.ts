import countBy from 'lodash/countBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';

import {
  Frontmatter,
  FrontmatterWithDate,
  FrontmatterWithTags,
} from '@/types/frontmatters';

export function sortDateFn<T extends FrontmatterWithDate>(
  contentA: T,
  contentB: T
) {
  // Safely parse dates by ensuring proper format
  const getDateValue = (content: T) => {
    const dateStr = content.lastUpdated ?? content.publishedAt;
    // Handle potential dot format
    const safeDateStr = dateStr.replace(/\./g, '-');
    // Ensure T separator for ISO format if needed
    const isoDateStr = safeDateStr.includes(' ')
      ? safeDateStr.replace(' ', 'T')
      : safeDateStr;
    return new Date(isoDateStr).valueOf();
  };

  return getDateValue(contentB) - getDateValue(contentA);
}

export function sortByDate<T extends FrontmatterWithDate>(contents: Array<T>) {
  return contents.sort(sortDateFn);
}

export function sortTitleFn<T extends Frontmatter>(contentA: T, contentB: T) {
  return contentA.title.localeCompare(contentB.title);
}

export function sortByTitle<T extends Array<Frontmatter>>(contents: T): T {
  return contents.sort((a, b) =>
    a.title > b.title ? 1 : b.title > a.title ? -1 : 0
  );
}

/**
 * Get tags of each post and remove duplicates
 */
export function getTags<T extends Array<FrontmatterWithTags>>(contents: T) {
  const tags = contents.reduce(
    (accTags: string[], content) => [...accTags, ...content.tags.split(',')],
    []
  );

  return map(sortBy(toPairs(countBy(tags)), 1), 0).reverse();
}
