import { useContext, useMemo, useState } from 'react';
import TagSetContext from './TagSetContext';

const useTagSearchFiltered = (defaultSearch: string) => {
    const [tagSearch, setTagSearch] = useState(defaultSearch);

    const tagSet = useContext(TagSetContext);

    const filteredTags = useMemo(() => {
        const lowerCaseSearch = tagSearch.toLowerCase();

        return [...tagSet].filter(tagName => tagName.toLowerCase().includes(lowerCaseSearch));
    }, [tagSet, tagSearch]);

    return {
        tagSearch,
        setTagSearch,
        filteredTags,
        tagSet
    };
};

export default useTagSearchFiltered;