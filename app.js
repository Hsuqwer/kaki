// 初始化 GUN
const gun = Gun({
    peers: ['https://gun-manhattan.herokuapp.com/gun'] // 使用公共 relay peer
});

// 建立一個示範資料節點
const data = gun.get('myApp');

// 顯示區域
const content = document.getElementById('content');

// 建立基本的 UI 元素
const createUI = () => {
    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = '輸入訊息...';
    messageInput.style.width = '100%';
    messageInput.style.padding = '8px';
    messageInput.style.marginBottom = '10px';

    const sendButton = document.createElement('button');
    sendButton.textContent = '送出';
    sendButton.style.padding = '8px 16px';
    sendButton.style.marginBottom = '20px';

    const messageList = document.createElement('div');
    messageList.id = 'messageList';

    content.appendChild(messageInput);
    content.appendChild(sendButton);
    content.appendChild(messageList);

    // 處理送出訊息
    sendButton.onclick = () => {
        if (messageInput.value.trim()) {
            const message = {
                text: messageInput.value,
                timestamp: Date.now()
            };
            data.get('messages').set(message);
            messageInput.value = '';
        }
    };

    // 按 Enter 也可以送出
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
};

// 監聽和顯示訊息
const listenToMessages = () => {
    const messageList = document.getElementById('messageList');
    data.get('messages').map().on(function(message, id) {
        if (message && message.text) {
            // 檢查訊息是否已經顯示
            const existingMessage = document.getElementById(id);
            if (!existingMessage) {
                const messageDiv = document.createElement('div');
                messageDiv.id = id;
                messageDiv.style.padding = '8px';
                messageDiv.style.margin = '4px 0';
                messageDiv.style.backgroundColor = '#f0f0f0';
                messageDiv.style.borderRadius = '4px';
                
                const time = new Date(message.timestamp).toLocaleString();
                messageDiv.textContent = `${message.text} (${time})`;
                
                messageList.appendChild(messageDiv);
                // 滾動到最新訊息
                messageList.scrollTop = messageList.scrollHeight;
            }
        }
    });
};

// 初始化應用
createUI();
listenToMessages();