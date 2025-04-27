let username = "";
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const onlineUsersDiv = document.getElementById('online-users');
    const usernameModal = document.getElementById('usernameModal');
    const usernameInput = document.getElementById('usernameInput');
    const usernameSubmit = document.getElementById('usernameSubmit');
    const dateTimeDiv = document.getElementById('date-time');

    usernameSubmit.addEventListener('click', () => {
        if (usernameInput.value.trim() !== "") {
            username = usernameInput.value.trim();
            usernameModal.style.display = 'none';
            socket.emit('new user', username);
        }
    });

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            usernameSubmit.click();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim() !== "") {
            socket.emit('chat message', input.value.trim(), username);

            const item = document.createElement('div');
            const chat_header = document.createElement('div');
            chat_header.id = "chat-header";
            const chat_name = document.createElement('div');
            chat_name.id = "chat-name";
            const chat_time = document.createElement('div');
            chat_time.id = "chat-time";
            const chat_icon = document.createElement('div');
            chat_icon.id = "chat-icon";
            const chat_name_icon_con = document.createElement('div');
            chat_name_icon_con.id = "chat-name-icon-con";
            const chat_message = document.createElement('div');

            chat_name.textContent = "You";
            chat_time.textContent = time;
            chat_icon.textContent = username[0].toUpperCase();

            chat_name_icon_con.appendChild(chat_icon);
            chat_name_icon_con.appendChild(chat_name);
            chat_header.appendChild(chat_name_icon_con);
            chat_header.appendChild(chat_time);

            item.classList.add('message', 'sent');

            item.appendChild(chat_header);
            chat_message.textContent = input.value.trim();
            item.appendChild(chat_message);
            messages.appendChild(item);
            messages.scrollTop = messages.scrollHeight;

            input.value = '';
        }
    });

    socket.on('chat message', (msg, user) => {
        const item = document.createElement('div');
        const chat_header = document.createElement('div');
        chat_header.id = "chat-header";
        const chat_name = document.createElement('div');
        chat_name.id = "chat-name";
        const chat_time = document.createElement('div');
        chat_time.id = "chat-time";
        const chat_icon = document.createElement('div');
        chat_icon.id = "chat-icon";
        const chat_name_icon_con = document.createElement('div');
        chat_name_icon_con.id = "chat-name-icon-con";
        const chat_message = document.createElement('div');

        chat_name.textContent = user;
        chat_time.textContent = time;
        chat_icon.textContent = user[0].toUpperCase();

        chat_name_icon_con.appendChild(chat_icon);
        chat_name_icon_con.appendChild(chat_name);
        chat_header.appendChild(chat_name_icon_con);
        chat_header.appendChild(chat_time);
        
        item.classList.add('message', 'received');
        item.appendChild(chat_header);
        chat_message.textContent = msg;
        item.appendChild(chat_message);
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on('user joined', (user) => {
        const notice = document.createElement('div');
        notice.classList.add('notice');
        notice.textContent = `${user} joined the chat`;
        messages.appendChild(notice);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on('user left', (user) => {
        const notice = document.createElement('div');
        notice.classList.add('notice');
        notice.textContent = `${user} left the chat`;
        messages.appendChild(notice);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on('users count', (count) => {
        onlineUsersDiv.innerHTML = `<span class="online-show">&#9679;</span> ${count} online`;
    });

    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    dateTimeDiv.textContent = `${formattedDate} • ${formattedTime}`;
});
