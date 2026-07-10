/* MYPLYN floating chat widget — vanilla JS */

(function () {
  if (window.__myplnChatInit) return;
  window.__myplnChatInit = true;

  const cfg = window.MyplynChatConfig || {};
  const STORAGE_KEY = cfg.storageKey || 'mypln_chat_v1';

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(messages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      /* ignore quota errors */
    }
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMessage(text) {
    return escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/(\/[\w\-/]+)/g, '<a href="$1" class="mypln-chat-link">$1</a>');
  }

  const root = el('div', 'mypln-chat-root');
  root.innerHTML = `
    <button type="button" class="mypln-chat-toggle" aria-label="Open chat" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Chat</span>
    </button>
    <div class="mypln-chat-panel" hidden role="dialog" aria-label="MYPLYN chat">
      <header class="mypln-chat-header">
        <div class="mypln-chat-header-copy">
          <strong>${escapeHtml(cfg.botName || 'Plyn')}</strong>
          <span>${escapeHtml(cfg.companyName || 'MYPLYN')} assistant</span>
        </div>
        <button type="button" class="mypln-chat-close" aria-label="Close chat">&times;</button>
      </header>
      <div class="mypln-chat-messages" aria-live="polite"></div>
      <div class="mypln-chat-chips"></div>
      <form class="mypln-chat-form">
        <input type="text" class="mypln-chat-input" placeholder="Ask about MYPLYN…" maxlength="2000" autocomplete="off" />
        <button type="submit" class="mypln-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(root);

  const toggle = root.querySelector('.mypln-chat-toggle');
  const panel = root.querySelector('.mypln-chat-panel');
  const closeBtn = root.querySelector('.mypln-chat-close');
  const messagesEl = root.querySelector('.mypln-chat-messages');
  const chipsEl = root.querySelector('.mypln-chat-chips');
  const form = root.querySelector('.mypln-chat-form');
  const input = root.querySelector('.mypln-chat-input');

  let messages = loadHistory();
  let isOpen = false;
  let isBusy = false;
  let greeted = messages.length > 0;

  function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderChips() {
    chipsEl.innerHTML = '';
    (cfg.quickReplies || []).forEach((chip) => {
      const btn = el('button', 'mypln-chat-chip', escapeHtml(chip.label));
      btn.type = 'button';
      btn.addEventListener('click', () => handleUserMessage(chip.message));
      chipsEl.appendChild(btn);
    });
  }

  function appendBubble(role, text, options = {}) {
    const row = el('div', `mypln-chat-msg mypln-chat-msg--${role}`);
    row.innerHTML = `<div class="mypln-chat-bubble">${formatMessage(text)}</div>`;
    messagesEl.appendChild(row);
    scrollBottom();
    return row;
  }

  function typewriterBubble(text) {
    const speed = cfg.typewriterSpeedMs ?? 16;
    const row = el('div', 'mypln-chat-msg mypln-chat-msg--bot');
    const bubble = el('div', 'mypln-chat-bubble mypln-chat-bubble--typing');
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollBottom();

    const plain = String(text);

    return new Promise((resolve) => {
      let index = 0;

      function tick() {
        index += 1;
        bubble.innerHTML = formatMessage(plain.slice(0, index));
        scrollBottom();

        if (index < plain.length) {
          setTimeout(tick, speed);
        } else {
          bubble.classList.remove('mypln-chat-bubble--typing');
          bubble.innerHTML = formatMessage(plain);
          scrollBottom();
          resolve(row);
        }
      }

      tick();
    });
  }

  function showTyping() {
    const row = el('div', 'mypln-chat-msg mypln-chat-msg--bot mypln-chat-msg--typing');
    row.innerHTML = '<div class="mypln-chat-bubble"><span class="mypln-chat-dots"><span></span><span></span><span></span></span></div>';
    messagesEl.appendChild(row);
    scrollBottom();
    return row;
  }

  function setOpen(open) {
    isOpen = open;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      if (!greeted) {
        greeted = true;
        messages.push({ role: 'assistant', content: cfg.greeting });
        saveHistory(messages);
        typewriterBubble(cfg.greeting);
      }
      renderChips();
      input.focus();
      scrollBottom();
    }
  }

  async function handleUserMessage(text) {
    const message = String(text || '').trim();
    if (!message || isBusy) return;

    isBusy = true;
    input.disabled = true;
    form.querySelector('.mypln-chat-send').disabled = true;

    messages.push({ role: 'user', content: message });
    saveHistory(messages);
    appendBubble('user', message);
    input.value = '';

    const typingEl = showTyping();

    await new Promise((r) => setTimeout(r, cfg.typingDelayMs || 900));

    try {
      const history = messages.slice(0, -1).slice(-20).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const data = await window.MyplynChatApi.sendMessage({
        message,
        history,
        page: window.location.pathname,
      });

      typingEl.remove();
      const reply = data.reply || "Sorry, I couldn't generate a reply. Try again or visit /contact.";
      messages.push({ role: 'assistant', content: reply });
      saveHistory(messages);
      await typewriterBubble(reply);
    } catch (err) {
      typingEl.remove();
      const fallback = err.message || 'Something went wrong. Email us at support@myplyn.com or visit /contact.';
      messages.push({ role: 'assistant', content: fallback });
      saveHistory(messages);
      await typewriterBubble(fallback);
    } finally {
      isBusy = false;
      input.disabled = false;
      form.querySelector('.mypln-chat-send').disabled = false;
      input.focus();
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen));
  closeBtn.addEventListener('click', () => setOpen(false));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });

  messages.forEach((m) => {
    appendBubble(m.role === 'assistant' ? 'bot' : 'user', m.content);
    greeted = true;
  });

  renderChips();

  document.addEventListener('click', (e) => {
    if (!isOpen) return;
    if (!root.contains(e.target)) return;
  });
})();
