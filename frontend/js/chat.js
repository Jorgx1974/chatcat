const colors = [     
    "cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", 
    "gold", "green", "red"
];

// Define o usuário com uma cor aleatória
const user = {
    id: "",
    name: localStorage.getItem("userName") || "Guest",
    color: localStorage.getItem("userColor") || colors[Math.floor(Math.random() * colors.length)],
    profilePicture: localStorage.getItem("userProfilePicture") || "default-profile.png"
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

// Armazena a cor no armazenamento local para persistência
if (!localStorage.getItem("userColor")) {
    localStorage.setItem("userColor", user.color);
}

// Chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");
const imageUploadInput = document.getElementById("imageUpload");
const logoutButton = document.getElementById("logoutButton");
const emojiButton = document.getElementById('emojiButton');
const emojiPicker = document.getElementById('emojiPicker');

// Lista de emojis
const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😍", "🤔", "🙄", "😎", "😢", "😭", "😱", "👍", "👎", "🎉", "❤️", "🔥", "💯", "👀", "🥳", "😜", "😇", "🥺", "🤯", "😴", "🤤", "😈", "👻", "💀", "🤖", "💩", "😺", "😹", "😻", "😼", "😽", "🙀", "👐", "👏", "🙏", "🤝", "💪", "👋", "✌️", "🤞"];

// Função para popular o seletor de emojis
function populateEmojiPicker() {
    emojiPicker.innerHTML = '';
    emojis.forEach(emoji => {
        const emojiElement = document.createElement('span');
        emojiElement.classList.add("btn-emoji");
        emojiElement.textContent = emoji;
        emojiElement.style.cursor = 'pointer';
        emojiElement.style.padding = '5px';
        emojiElement.addEventListener('click', () => {
            chatInput.value += emoji;
            emojiPicker.style.display = 'none';
        });
        emojiPicker.appendChild(emojiElement);
    });
}

// Alterna a visibilidade do emoji picker
emojiButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (emojiPicker.style.display === 'none') {
        emojiPicker.style.display = 'block';
        populateEmojiPicker();
    } else {
        emojiPicker.style.display = 'none';
    }
});

// Fecha o emoji picker ao clicar fora dele
document.addEventListener('click', (event) => {
    if (!emojiPicker.contains(event.target) && event.target !== emojiButton) {
        emojiPicker.style.display = 'none';
    }
});

let websocket;
let reconnectAttempts = 0;

// Exibe mensagem de boas-vindas com o nome e a foto de perfil do usuário
function showWelcomeMessage() {
    const welcomeMessage = document.createElement("div");
    welcomeMessage.id = "welcomeMessage";
    welcomeMessage.classList.add("message--container", "message--welcome");

    welcomeMessage.innerHTML = `
        <img src="${user.profilePicture || "default-profile.png"}" class="message--profile-picture">
        <strong style="color: ${user.color};">Bem-vindo, ${user.name}!</strong> Estamos felizes em ter você aqui.
    `;

    chatMessages.appendChild(welcomeMessage);
    scrollToBottom(); // Garante que a mensagem de boas-vindas apareça visível
}

// Remova a mensagem de boas-vindas
function removeWelcomeMessage() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
}

// Função para estabelecer a conexão WebSocket
function connectWebSocket() {
    const serverIp = window.location.hostname; // Usa o hostname do servidor atual
    websocket = new WebSocket(`ws://${serverIp}:3000`);

    websocket.addEventListener('open', () => {
        console.log('Connected to WebSocket server');
        reconnectAttempts = 0; // Reset attempts on successful connection
    });

    websocket.addEventListener('close', () => {
        console.warn('WebSocket closed. Attempting to reconnect...');
        reconnectAttempts++;
        const reconnectDelay = Math.min(1000 * reconnectAttempts, 30000); // Max delay of 30 seconds
        setTimeout(connectWebSocket, reconnectDelay);
    });

    websocket.addEventListener('message', (event) => {
        let message = event.data;

        if (typeof message !== 'string') {
            message = message.toString();
        }

        try {
            message = JSON.parse(message);
            if (message.image) {
                appendFileMessage(message.image, message.sender, message.type, message.profilePicture);
            } else {
                appendMessage(message.text, message.sender, message.color, message.profilePicture);
            }
        } catch (error) {
            console.error("Erro ao decodificar a mensagem:", error);
        }
    });
}

// Verifica o estado do WebSocket antes de enviar a mensagem
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Remove a mensagem de boas-vindas na primeira mensagem enviada
    removeWelcomeMessage();
    
    if (chatInput.value.trim() && websocket.readyState === WebSocket.OPEN) {
        const messageData = {
            text: chatInput.value,
            sender: user.name,
            color: user.color,
            profilePicture: user.profilePicture
        };
        websocket.send(JSON.stringify(messageData));
        chatInput.value = '';

        document.getElementById("sendNotification").play();
    } else if (websocket.readyState === WebSocket.CONNECTING) {
        console.warn("Tentativa de enviar mensagem enquanto WebSocket está conectando...");
    } else {
        console.error("Não foi possível enviar a mensagem. WebSocket está fechado.");
    }
});

// Função para rolar a janela de mensagens para o final com suavidade
function scrollToBottom() {
    const lastMessage = chatMessages.lastElementChild;
    if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
    }
}

// Inicializa a conexão WebSocket
connectWebSocket();

// Chama a função de exibir a mensagem de boas-vindas ao entrar no chat
showWelcomeMessage();

// Função para adicionar a mensagem na janela de chat
function appendMessage(text, sender, color, profilePicture) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add(sender === user.name ? "message--self" : "message--other");

    messageContainer.innerHTML = `
        <img src="${profilePicture || "default-profile.png"}" class="message--profile-picture">
        <strong class="message--sender" style="color: ${color};">${sender}:</strong> ${text}
    `;

    chatMessages.appendChild(messageContainer);
    scrollToBottom(); // Chama a função de rolagem suave
}

// Manipula o upload de arquivos
imageUploadInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileMessage = {
                    image: e.target.result,
                    sender: user.name,
                    color: user.color,
                    profilePicture: user.profilePicture,
                    type: file.type
                };
                websocket.send(JSON.stringify(fileMessage));
            };
            reader.readAsDataURL(file);
        });
        imageUploadInput.value = '';
    }
});

// Função para adicionar arquivos na janela de chat
function appendFileMessage(src, sender, type, profilePicture) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message--container");
    messageContainer.classList.add(sender === user.name ? "message--self" : "message--other");
    messageContainer.innerHTML = `
        <img src="${profilePicture || "default-profile.png"}" class="message--profile-picture">
        <strong class="message--sender" style="color: ${user.color};">${sender}:</strong>
    `;

    if (type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = "100%";
        messageContainer.appendChild(img);
    } else if (type.startsWith('audio/')) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = src;
        messageContainer.appendChild(audio);
    } else if (type.startsWith('video/')) {
        const video = document.createElement('video');
        video.controls = true;
        video.src = src;
        video.style.maxWidth = "100%";
        messageContainer.appendChild(video);
    } else {
        const fileLink = document.createElement('a');
        fileLink.href = src;
        fileLink.textContent = 'Download File';
        messageContainer.appendChild(fileLink);
    }

    chatMessages.appendChild(messageContainer);
    scrollToBottom();
}

// Função para fazer logout
logoutButton.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});
 
const gamesButton = document.getElementById("gamesButton");
const gamesPopup = document.getElementById("gamesPopup");

// Alterna a exibição do pop-up de jogos quando o botão de jogos é clicado
gamesButton.addEventListener("click", () => {
    gamesPopup.style.display = gamesPopup.style.display === "none" || gamesPopup.style.display === "" ? "block" : "none";
});

// Fecha o pop-up de jogos ao clicar fora dele
document.addEventListener("click", (event) => {
    if (!gamesPopup.contains(event.target) && !gamesButton.contains(event.target)) {
        gamesPopup.style.display = "none";
    }
});

// Função para abrir o jogo em uma nova janela ou aba
function openGame(gameUrl) {
    window.open(gameUrl, "_blank"); // Abre o jogo em uma nova aba
    gamesPopup.style.display = "none"; // Fecha o pop-up após escolher um jogo
}
const themeToggleButton = document.getElementById('toggle-theme');
// Função para alternar entre temas claro e escuro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    // Altera o ícone do botão para refletir o tema atual
    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.textContent = '☀️';
    } else {
        themeToggleButton.textContent = '🌙';
    }
}

// Adiciona o evento de clique para o botão de alternância
themeToggleButton.addEventListener('click', toggleTheme);
