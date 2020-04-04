const getDefaultMarkdownPreference = () => {
  return {
    numberedHeading: 'auto',
    centeredHeading: 'false',
    overflowCode: 'true'
  }
};

const getDefaultPreference = () => {
  return {
    theme: 'time',
    darkThemeDisabled: false,
    gestureDisabled: false,
    backdropBlurEnabled: false,
    defaultPage: 'timeline',
    bookmarks: [],
    markdown: getDefaultMarkdownPreference()
  }
};

export { getDefaultMarkdownPreference, getDefaultPreference };