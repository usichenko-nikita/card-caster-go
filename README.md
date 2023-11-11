# Card-Caster-Go
## Overview
Card-Caster-Go is a React Native mobile application designed to synchronize with the [card-caster-web](https://github.com/usichenko-nikita/card-caster-web) project. 
This app extends the unique card animations and AI-generated visuals from the web to the mobile platform.  
Card-Caster-Go showcases how advanced web functionalities can be harmoniously integrated into a mobile app environment.

One of the key features of Card-Caster-Go is its use of react-native-static-server. 
This enables the app to locally host and display the dynamic content and animations 
developed for the web, ensuring a seamless and responsive user experience on mobile 
devices.

![Card Animations](assets/card-caster-go.png)


## Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
