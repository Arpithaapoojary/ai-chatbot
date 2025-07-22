const promptInput = document.getElementById("prompt");
const chatContainer = document.getElementById("chatContainer");
const imageInput = document.getElementById("imageInput");
const imageBtn = document.getElementById("imageBtn");
const submitBtn = document.getElementById("submit");

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAYIb6fp-pULgcC-LnUB7XTnWzNQyBUu3Y";

function appendMessage(content, isUser, isImage = false) {
  const div = document.createElement("div");
  div.classList.add(isUser ? "user-chat-box" : "ai-chat-box");

  const img = document.createElement("img");
  img.src = isUser ? "user.jpg" : "ai.jpg";
  img.classList.add(isUser ? "userImage" : "aiImage");

  const chatArea = document.createElement("div");
  chatArea.classList.add(isUser ? "user-chat-area" : "ai-chat-area");

  if (isImage) {
    const imageEl = document.createElement("img");
    imageEl.src = content;
    imageEl.style.maxWidth = "200px";
    chatArea.appendChild(imageEl);
  } else {
    chatArea.innerText = content;
  }

  div.appendChild(img);
  div.appendChild(chatArea);
  chatContainer.appendChild(div);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
}

async function fetchAIResponse(message) {
  appendMessage("Typing...", false);

  const requestBody = {
    contents: [
      {
        parts: [{ text: message }]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    chatContainer.lastChild.remove(); // Remove "Typing..."
    appendMessage(text.trim(), false);
  } catch (error) {
    console.error(error);
    chatContainer.lastChild.remove(); // Remove "Typing..."
    appendMessage("❌ Failed to fetch response.", false);
  }
}

// Text message send
submitBtn.addEventListener("click", () => {
  const message = promptInput.value.trim();
  if (!message) return;
  appendMessage(message, true);
  fetchAIResponse(message);
  promptInput.value = "";
});

// Enter key to send
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitBtn.click();
});

// Open file selector
imageBtn.addEventListener("click", () => {
  imageInput.click();
});

// Show image preview
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      appendMessage(reader.result, true, true);
    };
    reader.readAsDataURL(file);
  }
});
