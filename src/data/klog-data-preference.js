const getDefaultMarkdownPreference = () => {
    return {
        numberedHeading: 'auto',
        centeredHeading: 'false',
        overflowCode: 'true'
    };
};

const getDefaultPreference = () => {
    return {
        theme: 'time',
        themeColor: '#3f51b5',
        darkThemeDisabled: false,
        gestureDisabled: false,
        backdropBlurEnabled: false,
        defaultPage: 'timeline',
        bookmarks: [],
        markdown: getDefaultMarkdownPreference()
    };
};

export { getDefaultMarkdownPreference, getDefaultPreference };