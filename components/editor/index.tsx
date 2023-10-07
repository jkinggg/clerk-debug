import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

const defaultContent = {
    time: 1696651795976,
    blocks: [
        {
            id: "mhTl6ghSkV",
            type: "paragraph",
            data: {
                text: "Hey. Meet the new Editor. On this picture you can see it in action. Then, try a demo 🤓",
            },
        },
        {
            id: "l98dyx3yjb",
            type: "header",
            data: {
                text: "Key features",
                level: 3,
            },
        }
    ],
};

const EditorComponent = ({ initialContent = defaultContent }) => {
    const webviewRef = useRef(null);
    const [editorContent, setEditorContent] = useState(initialContent);

    const handleMessage = event => {
        // Handle messages from WebView content here
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === 'contentUpdate') {
                setEditorContent(message.data);
            }
        } catch (e) {
            console.error('Failed to parse message from WebView:', e);
        }
    };

    useEffect(() => {
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
    }, [editorContent]);

    return (
        <WebView
            source={require('./editor.html')}
            ref={webviewRef}
            onMessage={handleMessage}
            startInLoadingState={true}
            javaScriptEnabled={true}
        />
    );
};

export default EditorComponent;