# Chrome extension for Asana links in Github

<b>Note: This is an experimental version of the extension</b>

# Installation

## Prerequistes

You need to have a "Disable Content-Security-Policy" extension installed in your browser.<br>
This is because we haven't spent the time to add this to our extension.

[https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden)

## Building and installing the extensino.

1. Start by creating a personal access token in Asana

2. Update the top line of the `src/index.js` file with your token

3. Run
```
yarn install
yarn build
```

4. Now open up [chrome://extensions](chrome://extensions) in your browser.

5. Make sure that the developer mode is enabled in the top right.

6. Open up the this source directory in a folder explorer (Explorer on windows, Nautilus on ubuntu ...)

7. Drag the extension folder from the folder explore to the chrome://extensions tab you should have open in your browser


# Usage

1. Go to Github
2. Make sure that the "Disable Content-Security-Policy" extension is on
3. Brows away. The extension should do it's work automatically.

## This doesn't work for me, what do I do?

1. Make sure the extension is installed
2. Make sure that "Disable Content-Security-Policy" is turned on
3. Refresh the page.