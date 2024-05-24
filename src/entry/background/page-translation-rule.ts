import scIndexedDB from '../../public/sc-indexed-db';
import { matchPattern } from '../../public/utils';

export const getSpecifySelectors = async (hostAndPathname: string) => {
    const specifications = await scIndexedDB.getAll('page-translation-rule');

    let includeSelectors = '';
    let excludeSelectors = '';

    specifications.forEach(({ patterns, include, exclude }) => {
        patterns.split(',').map(v => v.trimStart().trimEnd()).forEach((pattern) => {
            if (matchPattern(pattern, hostAndPathname)) {
                if (include) {
                    includeSelectors += (includeSelectors && ',') + include;
                }

                if (exclude) {
                    excludeSelectors += (excludeSelectors && ',') + exclude;
                }
            }
        });
    });

    return {
        includeSelectors,
        excludeSelectors
    };
};