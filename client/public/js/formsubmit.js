/**
 * MYPLYN chat — API helpers (load before chat.js)
 */
(function () {
  const cfg = window.MyplynChatConfig || {};
  const apiBase = cfg.apiBase || '/api/v1';

  window.MyplynChatApi = {
    async sendMessage({ message, history, page, visitorEmail }) {
      const res = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          message,
          history: history || [],
          page: page || window.location.pathname,
          visitorEmail: visitorEmail || undefined,
          source: 'chat-widget',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      return data;
    },
  };
})();
