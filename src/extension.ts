// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

//     // Use the console to output diagnostic information (console.log) and errors (console.error)
//     // This line of code will only be executed once when your extension is activated
//     console.log('Congratulations, your extension "chatextension" is now active!');

//     context.subscriptions.push(
//         vscode.commands.registerCommand('chatextension.openChat', () => {
//             const panel = vscode.window.createWebviewPanel(
//                 'chatPanel',
//                 'GPT-Pilot Chat',
//                 vscode.ViewColumn.One,
//                 { enableScripts: true }
//             )

//             panel.webview.html = getWebViewContent(panel);
//         })
//     )

//     // The command has been defined in the package.json file
//     // Now provide the implementation of the command with registerCommand
//     // The commandId parameter must match the command field in package.json
//     const disposable = vscode.commands.registerCommand('chatextension.helloWorld', () => {
//         // The code you place here will be executed every time your command is executed
//         // Display a message box to the user
//         vscode.window.showInformationMessage('Hello World from ChatExtension!');
//     });

//     context.subscriptions.push(disposable);
// }

// function getWebViewContent(panel: vscode.WebviewPanel): string {
//     return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Modern Chat</title>
//         <style>
//             body {
//                 margin: 0;
//                 font-family: Arial, sans-serif;
//                 background-color: #1A1C1B; /* Dark background */
//                 color: #F7F7F7; /* Light text */
//                 display: flex;
//                 flex-direction: column;
//                 height: 100vh;
//             }

//             #chat-container {
//                 display: flex;
//                 flex-direction: column;
//                 flex-grow: 1;
//                 justify-content: flex-end;
//                 padding: 10px;
//             }

//             #messages {
//                 flex-grow: 1;
//                 overflow-y: auto;
//                 padding: 10px;
//                 margin-bottom: 10px;
//                 border-radius: 5px;
//                 background-color: #2A2E2E; /* Secondary dark */
//                 display: flex;
//                 flex-direction: column;
//                 gap: 10px;
//             }

//             .message {
//                 margin-bottom: 10px;
//                 padding: 10px;
//                 border-radius: 8px;
//                 max-width: 70%;
//                 word-wrap: break-word;
//             }

//             .message.user {
//                 background-color: #FDF3E5; /* User message background */
//                 align-self: flex-end; /* Align to the right */
//                 color: #000;
//             }

//             .message.bot {
//                 background-color: #EA7100; /* Bot message background */
//                 align-self: flex-start; /* Align to the left */
//                 color: #FFF;
//             }

//             #input-container {
//                 display: flex;
//                 gap: 10px;
//                 align-items: center;
//             }

//             #input {
//                 flex-grow: 1;
//                 padding: 10px;
//                 border-radius: 8px;
//                 border: none;
//                 background-color: #2A2E2E;
//                 color: #F7F7F7;
//                 outline: none;
//                 font-size: 14px;
//             }

//             #send {
//                 padding: 10px 20px;
//                 border: none;
//                 border-radius: 8px;
//                 background-color: #EA7100; /* Button color */
//                 color: #FFF;
//                 cursor: pointer;
//                 font-size: 14px;
//             }

//             #send:hover {
//                 background-color: #D66300; /* Darker shade for hover */
//             }

//             #send:disabled {
//                 background-color: #555D58;
//                 cursor: not-allowed;
//             }
//         </style>
//     </head>
//     <body>
//         <div id="chat-container">
//             <div id="messages"></div>
//             <div id="input-container">
//                 <input id="input" type="text" placeholder="Type a message...">
//                 <button id="send">Send</button>
//             </div>
//         </div>
//         <script>
//             const vscode = acquireVsCodeApi();
//             const messagesDiv = document.getElementById('messages');
//             const inputBox = document.getElementById('input');
//             const sendButton = document.getElementById('send');

//             // Add a default welcome message
//             addMessage("Oi, bem vindo! Vamos desenvolver juntos?", 'bot');

//             // Handle send button click
//             sendButton.addEventListener('click', sendMessage);

//             // Handle Enter key press
//             inputBox.addEventListener('keydown', (event) => {
//                 if (event.key === 'Enter') {
//                     event.preventDefault(); // Prevent default form submission behavior
//                     sendMessage();
//                 }
//             });

//             // Send the message
//             function sendMessage() {
//                 const text = inputBox.value.trim();
//                 if (!text) return;
//                 vscode.postMessage({ text });
//                 addMessage(text, 'user');
//                 inputBox.value = '';

//                 // Add default bot reply for now
//                 setTimeout(() => {
//                     addMessage("Oi, bem vindo! Vamos desenvolver juntos?", 'bot');
//                 }, 1000);
//             }

//             // Add message to the chat
//             function addMessage(text, type) {
//                 const message = document.createElement('div');
//                 message.className = \`message \${type}\`;
//                 message.textContent = text;
//                 messagesDiv.appendChild(message);
//                 messagesDiv.scrollTop = messagesDiv.scrollHeight;
//             }
//         </script>
//     </body>
//     </html>`
// }

// // This method is called when your extension is deactivated
// export function deactivate() { }

import * as vscode from 'vscode'
import axios from 'axios'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

if (!OPENAI_API_KEY) {
    throw new Error('Please set OPENAI_API_KEY and OPENAI_API_URL in your .env file.')
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "chatextension" is now active!')

    context.subscriptions.push(
        vscode.commands.registerCommand('chatextension.openChat', () => {
            const panel = vscode.window.createWebviewPanel(
                'chatPanel',
                'GPT-Pilot Chat',
                vscode.ViewColumn.One,
                { enableScripts: true }
            )

            panel.webview.html = getWebViewContent(panel)

            // Listen for messages from the webview
            panel.webview.onDidReceiveMessage(async (message) => {
                if (message.text) {
                    const reply = await sendToOpenAI(message.text)
                    panel.webview.postMessage({ text: reply, type: 'bot' })
                }
            })
        })
    )

    const disposable = vscode.commands.registerCommand('chatextension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from ChatExtension!')
    });

    context.subscriptions.push(disposable)
}

// Function to send a message to OpenAI API using axios
async function sendToOpenAI(userMessage: string): Promise<string> {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        )
        return response.data.choices[0].message.content.trim();
    } catch (error: any) {
        console.error(error);
        return 'Sorry, there was an error communicating with the LLM.'
    }
}

function getWebViewContent(panel: vscode.WebviewPanel): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Modern Chat</title>
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #1A1C1B;
                color: #F7F7F7;
                display: flex;
                flex-direction: column;
                height: 100vh;
            }
            #chat-container {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                justify-content: flex-end;
                padding: 10px;
            }
            #messages {
                flex-grow: 1;
                overflow-y: auto;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 5px;
                background-color: #2A2E2E;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .message {
                margin-bottom: 10px;
                padding: 10px;
                border-radius: 8px;
                max-width: 70%;
                word-wrap: break-word;
            }
            .message.user {
                background-color: #FDF3E5;
                align-self: flex-end;
                color: #000;
            }
            .message.bot {
                background-color: #EA7100;
                align-self: flex-start;
                color: #FFF;
            }
            #input-container {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            #input {
                flex-grow: 1;
                padding: 10px;
                border-radius: 8px;
                border: none;
                background-color: #2A2E2E;
                color: #F7F7F7;
                outline: none;
                font-size: 14px;
            }
            #send {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                background-color: #EA7100;
                color: #FFF;
                cursor: pointer;
                font-size: 14px;
            }
            #send:hover {
                background-color: #D66300;
            }
        </style>
    </head>
    <body>
        <div id="chat-container">
            <div id="messages"></div>
            <div id="input-container">
                <input id="input" type="text" placeholder="Type a message...">
                <button id="send">Send</button>
            </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const messagesDiv = document.getElementById('messages');
            const inputBox = document.getElementById('input');
            const sendButton = document.getElementById('send');

            sendButton.addEventListener('click', sendMessage);
            inputBox.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    sendMessage();
                }
            });

            function sendMessage() {
                const text = inputBox.value.trim();
                if (!text) return;
                addMessage(text, 'user');
                vscode.postMessage({ text });
                inputBox.value = '';
            }

            window.addEventListener('message', (event) => {
                const message = event.data;
                if (message.type === 'bot') {
                    addMessage(message.text, 'bot');
                }
            });

            function addMessage(text, type) {
                const message = document.createElement('div');
                message.className = \`message \${type}\`;
                message.textContent = text;
                messagesDiv.appendChild(message);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        </script>
    </body>
    </html>`;
}

export function deactivate() { }
