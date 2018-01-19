# Chrome extension for Asana links in Github

<b>Note: This is an experimental version of the extension</b>

# Installation

## Building

1. Start by creating a personal access token in Asana
2. Update the top line of the `src/index.js` file with your token
3. Run

```
yarn install
yarn build
```

## Installing on Chrome

1. Now open up [chrome://extensions](chrome://extensions) in your browser.
2. Make sure that the developer mode is enabled in the top right.
3. Open up the this source directory in a folder explorer (Explorer on windows, Nautilus on ubuntu ...)
4. Drag the extension folder from the folder explore to the chrome://extensions tab you should have open in your browser

## Installing on Firefox

1. Now open up [about:debugging](about:debugging) in your browser.
2. Click the "Load Temporary Add-on" button
3. Navigate to the extension folder and choose the manifest file.

### Creating Asana persional access token

1. Login to asana
2. Open "My Profile Settings"
3. Go to to the Apps tab
4. Click the "Manage Developer Apps"
5. Click "Creat New Personal Access Token"

# Usage

1. Go to https://github.com
2. Browse away. The extension should do it's work automatically.

## This doesn't work for me, what do I do?

1. Make sure you updated the personal access token before building
2. Make sure the extension is installed and up to date
3. Refresh the page.