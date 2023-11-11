import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import StaticServer from '@dr.pogodin/react-native-static-server';
import RNFS from 'react-native-fs';
import WebView from 'react-native-webview';

// Constants
const SERVER_PORT: number = 9090;
const ASSETS_FOLDER_NAME: string = 'build';
const DOCUMENT_FOLDER_PATH: string = `${RNFS.DocumentDirectoryPath}/${ASSETS_FOLDER_NAME}`;
const LOCALHOST: string =
  Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;

// Helper function to copy assets
const copyAssetsFolderContents = async (
  sourcePath: string,
  targetPath: string,
): Promise<void> => {
  try {
    const items = await RNFS.readDirAssets(sourcePath);
    const targetExists = await RNFS.exists(targetPath);
    if (!targetExists) {
      await RNFS.mkdir(targetPath);
    }

    for (const item of items) {
      const sourceItemPath = `${sourcePath}/${item.name}`;
      const targetItemPath = `${targetPath}/${item.name}`;

      if (item.isDirectory()) {
        await copyAssetsFolderContents(sourceItemPath, targetItemPath);
      } else {
        await RNFS.copyFileAssets(sourceItemPath, targetItemPath);
      }
    }
  } catch (error) {
    console.error('Failed to copy assets folder contents:', error);
    throw error;
  }
};

function useStaticServer(folderWasCreated: boolean) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    let server: StaticServer | null = null;

    const startServer = async (): Promise<void> => {
      const path: string = `${LOCALHOST}/${ASSETS_FOLDER_NAME}`;
      server = new StaticServer(SERVER_PORT, path, {localOnly: true});

      try {
        const url = await server.start();
        setUrl(url);
      } catch (error) {
        console.error('Failed to start server:', error);
      }
    };

    if (folderWasCreated) {
      startServer();
    }

    return () => server?.stop();
  }, [folderWasCreated]);

  return url;
}

const App: React.FC = () => {
  const [folderWasCreated, setFolderWasCreated] = useState<boolean>(false);
  const url = useStaticServer(folderWasCreated);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setFolderWasCreated(true);
      return;
    }
    copyAssetsFolderContents(ASSETS_FOLDER_NAME, DOCUMENT_FOLDER_PATH)
      .then(() => {
        console.log('Build folder contents copied successfully.');
        setFolderWasCreated(true);
      })
      .catch(error => {
        console.error('Error copying build folder contents:', error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      {url ? (
        <WebView
          source={{uri: url}}
          style={styles.webView}
          onLoadStart={() => {
            console.log('WebView started loading.');
          }}
          onLoad={() => {
            console.log('WebView loaded.');
          }}
          onError={syntheticEvent => {
            console.error('WebView error:', syntheticEvent.nativeEvent);
          }}
          onHttpError={syntheticEvent => {
            console.error('HTTP error:', syntheticEvent.nativeEvent);
          }}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          allowFileAccess={true}
          debuggingEnabled={true}
        />
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  webView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
