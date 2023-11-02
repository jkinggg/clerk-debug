import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { YStack, Text } from 'tamagui';

const EditorComponent = ({ initialContent, onContentChange }) => {
    console.log('EditorComponent rendered');
    const webviewRef = useRef(null);
    const [editorContent, setEditorContent] = useState(initialContent);

    const handleMessage = event => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === 'contentUpdate') {
                onContentChange(message.data);
            }
        } catch (e) {
            console.error('Failed to parse message from WebView:', e);
        }
    };

    const injectJavaScript = () => {
        console.log('Injecting JavaScript');
        // Stringify the editorContent and escape newline and quote characters
        const stringifiedContent = JSON.stringify(editorContent)
            .replace(/\n/g, '\\n')
            .replace(/'/g, "\\'");

        // Construct a JavaScript string to initialize Editor.js with the content
        const injectedJavaScript = `
            window.editor = new EditorJS({
                holder: 'editorjs',
                data: ${stringifiedContent},
                // ... other options ...
                onChange: () => {
                    // Debounce updates to once every 500ms to avoid overwhelming React Native
                    if (window.lastUpdate && Date.now() - window.lastUpdate < 500) {
                        return;
                    }
                    window.lastUpdate = Date.now();
                    editor.save().then((outputData) => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'contentUpdate',
                            data: outputData
                        }));
                    }).catch((error) => {
                        console.error('Failed to save editor data:', error);
                    });
                }
            });
            true; // Note: this line is important to avoid some issues with WebView
        `;

        // Inject the JavaScript into the WebView
        webviewRef.current?.injectJavaScript(injectedJavaScript);
    };

    return (
        <WebView
            source={require('./editor.html')}
            ref={webviewRef}
            onMessage={handleMessage}
            startInLoadingState={true}
            javaScriptEnabled={true}
            onLoadStart={() => console.log('WebView is loading')}
            onLoad={() => {
                console.log('WebView has loaded');
                injectJavaScript();
            }}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
            }}
            renderError={(error) => {
                console.warn('WebView renderError: ', error);
                return (
                    <YStack>
                        <Text>An error occurred: {error}</Text>
                    </YStack>
                );
            }}
        />
    );
};

export default EditorComponent;