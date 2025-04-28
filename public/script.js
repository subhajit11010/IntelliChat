let username = "";
const socket = io();

function generateShortUUID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

document.addEventListener("DOMContentLoaded", () => {
    const userID = generateShortUUID();
    let targetID = "";
    let currentReplyMessageId = null; // this is global
    socket.emit('register user', userID);

    const chat_container = document.getElementById('chat-container');
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
            // let reply_receiver = "";
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
            let message_time = new Date();
            message_time = message_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const messageId = Date.now() + Math.random().toString(36).substr(2, 5);

            if (currentReplyMessageId === null) {
                socket.emit('chat message', input.value.trim(), username, "", messageId, "", userID, targetID || "");
                const item = document.createElement('div');
                item.dataset.id = messageId;
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
                const chat_utils = document.createElement('div');
                chat_utils.id = "chat-utils";
                const chat_delete = document.createElement('button');
                chat_delete.id = "chat-delete";
                const chat_reply = document.createElement('button');
                chat_reply.id = "chat-reply-sent";

                chat_delete.addEventListener('click', () => {
                    console.log(userID);
                    socket.emit("delete message", item.dataset.id, userID);
                });

                chat_name.textContent = "You";
                chat_time.textContent = message_time;
                chat_icon.textContent = username[0].toUpperCase();
                chat_delete.classList.add('fa', 'fa-trash-o');
                chat_reply.classList.add('fa', 'fa-reply', 'chat-reply');

                chat_name_icon_con.appendChild(chat_icon);
                chat_name_icon_con.appendChild(chat_name);
                chat_header.appendChild(chat_name_icon_con);
                chat_header.appendChild(chat_time);
                chat_utils.appendChild(chat_delete);
                chat_utils.appendChild(chat_reply);

                item.classList.add('message', 'sent');

                item.appendChild(chat_header);
                chat_message.textContent = input.value.trim();
                item.appendChild(chat_message);
                item.appendChild(chat_utils);
                messages.appendChild(item);
                messages.scrollTop = messages.scrollHeight;
            }
            else {
                // fetching the message contents to reply to
                const reference_message_elem = document.querySelector(`[data-id="${currentReplyMessageId}"]`);
                const reply = document.createElement('div');
                reply.classList.add("reply", "sent");
                const reply_message = document.createElement('div');
                reply_message.classList.add("reply-message");
                const reply_info = document.createElement('div');
                reply_info.classList.add("reply-info");
                const replying_to = document.createElement('div');
                replying_to.classList.add("replying-to");
                const reference_message = document.createElement('div');
                reference_message.classList.add("reference-message");

                replying_to.textContent = reference_message_elem.childNodes[0].childNodes[0].childNodes[1].textContent;
                console.log(replying_to.textContent);
                reference_message.textContent = reference_message_elem.childNodes[1].textContent;
                const refmsg = reference_message.textContent;
                socket.emit('chat message', input.value.trim(), username, replying_to.textContent, messageId, refmsg, userID, targetID);

                const item = document.createElement('div');
                item.dataset.id = messageId;
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
                const chat_utils = document.createElement('div');
                chat_utils.id = "chat-utils";
                const chat_delete = document.createElement('button');
                chat_delete.id = "chat-delete";
                const chat_reply = document.createElement('button');
                chat_reply.id = "chat-reply-sent";

                chat_delete.addEventListener('click', () => {
                    console.log(userID);
                    socket.emit("delete message", item.dataset.id, userID);
                });

                chat_name.textContent = "You";
                chat_time.textContent = message_time;
                chat_icon.textContent = username[0].toUpperCase();
                chat_delete.classList.add('fa', 'fa-trash-o');
                chat_reply.classList.add('fa', 'fa-reply', 'chat-reply');

                chat_name_icon_con.appendChild(chat_icon);
                chat_name_icon_con.appendChild(chat_name);
                chat_header.appendChild(chat_name_icon_con);
                chat_header.appendChild(chat_time);
                chat_utils.appendChild(chat_delete);
                chat_utils.appendChild(chat_reply);

                item.classList.add('message', 'sent', 'enclosed');

                item.appendChild(chat_header);
                chat_message.textContent = input.value.trim();
                item.appendChild(chat_message);
                item.appendChild(chat_utils);

                reply_info.appendChild(replying_to);
                reply_info.appendChild(reference_message);
                reply_message.appendChild(item);
                reply.appendChild(reply_info);
                reply.appendChild(reply_message);
                messages.appendChild(reply);
                messages.scrollTop = messages.scrollHeight;
            }


            input.value = '';
        }
    });


    socket.on('chat message', (msg, user, reply_receiver, messageId, refmsg, senderid, targetid) => {
        console.log("Checking :", targetid, senderid, userID);
        console.log("Checking :", targetid === userID);
        if (targetid === "") {
            console.log(targetid, senderid, userID);

            const item = document.createElement('div');
            item.dataset.id = messageId;
            item.dataset.sender = senderid;
            item.dataset.target = targetid;
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
            const chat_utils = document.createElement('div');
            chat_utils.id = "chat-utils";
            const chat_reply = document.createElement('button');
            chat_reply.id = "chat-reply-received";

            chat_reply.addEventListener('click', () => {
                // console.log("Ok");
                targetID = item.dataset.sender;
                const top_level_parentId = chat_reply.parentNode.parentNode.dataset.id;
                if (document.getElementById("reply-to") === null) {
                    const reply_to = document.createElement('div');
                    reply_to.id = 'reply-to';
                    const reply_to_name = document.createElement('div');
                    reply_to_name.id = 'reply-to-name';
                    const reply_to_msg = document.createElement('div');
                    reply_to_msg.id = 'reply-to-msg';
                    const reply_to_delete = document.createElement('i');
                    reply_to_delete.id = 'reply-to-delete';
                    reply_to_delete.classList.add("fa", "fa-close");

                    reply_to_delete.addEventListener('click', () => {
                        reply_to.remove();
                        currentReplyMessageId = null;
                        targetID = "";
                    });

                    reply_to_name.textContent = user;
                    reply_to_msg.textContent = msg;
                    reply_to.appendChild(reply_to_name);
                    reply_to.appendChild(reply_to_msg);
                    reply_to.appendChild(reply_to_delete);

                    chat_container.insertBefore(reply_to, form);
                    currentReplyMessageId = top_level_parentId;
                }
                else if (top_level_parentId !== currentReplyMessageId) {
                    let reply_to = document.getElementById("reply-to");
                    reply_to.remove();
                    reply_to = document.createElement('div');
                    reply_to.id = 'reply-to';
                    const reply_to_name = document.createElement('div');
                    reply_to_name.id = 'reply-to-name';
                    const reply_to_msg = document.createElement('div');
                    reply_to_msg.id = 'reply-to-msg';
                    const reply_to_delete = document.createElement('i');
                    reply_to_delete.id = 'reply-to-delete';
                    reply_to_delete.classList.add("fa", "fa-close");

                    reply_to_delete.addEventListener('click', () => {
                        reply_to.remove();
                        currentReplyMessageId = null;
                        targetID = "";
                    });

                    reply_to_name.textContent = user;
                    reply_to_msg.textContent = msg;
                    reply_to.appendChild(reply_to_name);
                    reply_to.appendChild(reply_to_msg);
                    reply_to.appendChild(reply_to_delete);

                    chat_container.insertBefore(reply_to, form);
                    currentReplyMessageId = top_level_parentId;
                }

            });

            chat_name.textContent = user;
            chat_time.textContent = time;
            chat_icon.textContent = user[0].toUpperCase();
            chat_reply.classList.add('fa', 'fa-reply', 'chat-reply');

            chat_name_icon_con.appendChild(chat_icon);
            chat_name_icon_con.appendChild(chat_name);
            chat_header.appendChild(chat_name_icon_con);
            chat_header.appendChild(chat_time);
            chat_utils.appendChild(chat_reply);

            item.classList.add('message', 'received');
            item.appendChild(chat_header);
            chat_message.textContent = msg;
            item.appendChild(chat_message);
            item.appendChild(chat_utils);
            messages.appendChild(item);
            messages.scrollTop = messages.scrollHeight;

        }
        else {
            if (targetid === userID) {
                console.log("OK");
                const reply = document.createElement('div');
                reply.classList.add("reply", "received");
                const reply_message = document.createElement('div');
                reply_message.classList.add("reply-message");
                const reply_info = document.createElement('div');
                reply_info.classList.add("reply-info", "received");
                const replying_to = document.createElement('div');
                replying_to.classList.add("replying-to", "received");
                const reference_message = document.createElement('div');
                reference_message.classList.add("reference-message", "received");

                replying_to.textContent = "You";
                // console.log(replying_to.textContent);
                reference_message.textContent = refmsg;

                const item = document.createElement('div');
                item.dataset.id = messageId;
                item.dataset.sender = senderid;
                item.dataset.target = targetid;
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
                const chat_utils = document.createElement('div');
                chat_utils.id = "chat-utils";
                const chat_reply = document.createElement('button');
                chat_reply.id = "chat-reply-received";

                chat_reply.addEventListener('click', () => {
                    // console.log("Ok");
                    targetID = item.dataset.sender;
                    const top_level_parentId = chat_reply.parentNode.parentNode.dataset.id;
                    if (document.getElementById("reply-to") === null) {
                        const reply_to = document.createElement('div');
                        reply_to.id = 'reply-to';
                        const reply_to_name = document.createElement('div');
                        reply_to_name.id = 'reply-to-name';
                        const reply_to_msg = document.createElement('div');
                        reply_to_msg.id = 'reply-to-msg';
                        const reply_to_delete = document.createElement('i');
                        reply_to_delete.id = 'reply-to-delete';
                        reply_to_delete.classList.add("fa", "fa-close");

                        reply_to_delete.addEventListener('click', () => {
                            reply_to.remove();
                            currentReplyMessageId = null;
                            targetID = "";
                        });

                        reply_to_name.textContent = user;
                        reply_to_msg.textContent = msg;
                        reply_to.appendChild(reply_to_name);
                        reply_to.appendChild(reply_to_msg);
                        reply_to.appendChild(reply_to_delete);

                        chat_container.insertBefore(reply_to, form);
                        currentReplyMessageId = top_level_parentId;
                    }
                    else if (top_level_parentId !== currentReplyMessageId) {
                        let reply_to = document.getElementById("reply-to");
                        reply_to.remove();
                        reply_to = document.createElement('div');
                        reply_to.id = 'reply-to';
                        const reply_to_name = document.createElement('div');
                        reply_to_name.id = 'reply-to-name';
                        const reply_to_msg = document.createElement('div');
                        reply_to_msg.id = 'reply-to-msg';
                        const reply_to_delete = document.createElement('i');
                        reply_to_delete.id = 'reply-to-delete';
                        reply_to_delete.classList.add("fa", "fa-close");

                        reply_to_delete.addEventListener('click', () => {
                            reply_to.remove();
                            currentReplyMessageId = null;
                            targetID = "";
                        });

                        reply_to_name.textContent = user;
                        reply_to_msg.textContent = msg;
                        reply_to.appendChild(reply_to_name);
                        reply_to.appendChild(reply_to_msg);
                        reply_to.appendChild(reply_to_delete);

                        chat_container.insertBefore(reply_to, form);
                        currentReplyMessageId = top_level_parentId;
                    }

                });

                chat_name.textContent = user;
                chat_time.textContent = time;
                chat_icon.textContent = user[0].toUpperCase();
                chat_reply.classList.add('fa', 'fa-reply', 'chat-reply');

                chat_name_icon_con.appendChild(chat_icon);
                chat_name_icon_con.appendChild(chat_name);
                chat_header.appendChild(chat_name_icon_con);
                chat_header.appendChild(chat_time);
                chat_utils.appendChild(chat_reply);

                item.classList.add('message', 'received', 'enclosed');
                item.appendChild(chat_header);
                chat_message.textContent = msg;
                item.appendChild(chat_message);
                item.appendChild(chat_utils);

                reply_info.appendChild(replying_to);
                reply_info.appendChild(reference_message);
                reply_message.appendChild(item);
                reply.appendChild(reply_info);
                reply.appendChild(reply_message);
                messages.appendChild(reply);
                messages.scrollTop = messages.scrollHeight;
            }
            else {
                const reply = document.createElement('div');
                reply.classList.add("reply", "received");
                const reply_message = document.createElement('div');
                reply_message.classList.add("reply-message");
                const reply_info = document.createElement('div');
                reply_info.classList.add("reply-info", "received");
                const replying_to = document.createElement('div');
                replying_to.classList.add("replying-to", "received");
                const reference_message = document.createElement('div');
                reference_message.classList.add("reference-message","received");

                replying_to.textContent = reply_receiver;
                // console.log(replying_to.textContent);
                reference_message.textContent = refmsg;

                const item = document.createElement('div');
                item.dataset.id = messageId;
                item.dataset.sender = senderid;
                item.dataset.target = targetid;
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
                const chat_utils = document.createElement('div');
                chat_utils.id = "chat-utils";
                const chat_reply = document.createElement('button');
                chat_reply.id = "chat-reply-received";

                chat_reply.addEventListener('click', () => {
                    // console.log("Ok");
                    targetID = item.dataset.sender;
                    const top_level_parentId = chat_reply.parentNode.parentNode.dataset.id;
                    if (document.getElementById("reply-to") === null) {
                        const reply_to = document.createElement('div');
                        reply_to.id = 'reply-to';
                        const reply_to_name = document.createElement('div');
                        reply_to_name.id = 'reply-to-name';
                        const reply_to_msg = document.createElement('div');
                        reply_to_msg.id = 'reply-to-msg';
                        const reply_to_delete = document.createElement('i');
                        reply_to_delete.id = 'reply-to-delete';
                        reply_to_delete.classList.add("fa", "fa-close");

                        reply_to_delete.addEventListener('click', () => {
                            reply_to.remove();
                            currentReplyMessageId = null;
                            targetID = "";
                        });

                        reply_to_name.textContent = user;
                        reply_to_msg.textContent = msg;
                        reply_to.appendChild(reply_to_name);
                        reply_to.appendChild(reply_to_msg);
                        reply_to.appendChild(reply_to_delete);

                        chat_container.insertBefore(reply_to, form);
                        currentReplyMessageId = top_level_parentId;
                    }
                    else if (top_level_parentId !== currentReplyMessageId) {
                        let reply_to = document.getElementById("reply-to");
                        reply_to.remove();
                        reply_to = document.createElement('div');
                        reply_to.id = 'reply-to';
                        const reply_to_name = document.createElement('div');
                        reply_to_name.id = 'reply-to-name';
                        const reply_to_msg = document.createElement('div');
                        reply_to_msg.id = 'reply-to-msg';
                        const reply_to_delete = document.createElement('i');
                        reply_to_delete.id = 'reply-to-delete';
                        reply_to_delete.classList.add("fa", "fa-close");

                        reply_to_delete.addEventListener('click', () => {
                            reply_to.remove();
                            currentReplyMessageId = null;
                            targetID = "";
                        });

                        reply_to_name.textContent = user;
                        reply_to_msg.textContent = msg;
                        reply_to.appendChild(reply_to_name);
                        reply_to.appendChild(reply_to_msg);
                        reply_to.appendChild(reply_to_delete);

                        chat_container.insertBefore(reply_to, form);
                        currentReplyMessageId = top_level_parentId;
                    }

                });

                chat_name.textContent = user;
                chat_time.textContent = time;
                chat_icon.textContent = user[0].toUpperCase();
                chat_reply.classList.add('fa', 'fa-reply', 'chat-reply');

                chat_name_icon_con.appendChild(chat_icon);
                chat_name_icon_con.appendChild(chat_name);
                chat_header.appendChild(chat_name_icon_con);
                chat_header.appendChild(chat_time);
                chat_utils.appendChild(chat_reply);

                item.classList.add('message', 'received', 'enclosed');
                item.appendChild(chat_header);
                chat_message.textContent = msg;
                item.appendChild(chat_message);
                item.appendChild(chat_utils);

                reply_info.appendChild(replying_to);
                reply_info.appendChild(reference_message);
                reply_message.appendChild(item);
                reply.appendChild(reply_info);
                reply.appendChild(reply_message);
                messages.appendChild(reply);
                messages.scrollTop = messages.scrollHeight;
            }
        }
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

    socket.on("delete message", (messageId, user) => {
        const messageToDelete = document.querySelector(`[data-id="${messageId}"]`);
        if (messageToDelete) {
            if (user == userID) {
                console.log(user);
                const deleted = document.createElement('div');
                deleted.classList.add("deleted-sender");
                deleted.textContent = "message is deleted!!";
                messageToDelete.parentNode.insertBefore(deleted, messageToDelete);
            }
            else {
                console.log(user);
                const deleted = document.createElement('div');
                deleted.classList.add("deleted-receiver");
                deleted.textContent = "message is deleted!!";
                messageToDelete.parentNode.insertBefore(deleted, messageToDelete);
            }
            messageToDelete.remove();
        }
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
