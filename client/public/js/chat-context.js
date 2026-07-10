/**
 * MYPLYN chat widget — config & site context
 */
window.MyplynChatConfig = {
  botName: 'Plyn',
  companyName: 'MYPLYN',
  storageKey: 'mypln_chat_v1',
  apiBase: '/api/v1',
  typingDelayMs: 900,
  typewriterSpeedMs: 16,
  greeting:
    "Hi! I'm Plyn, MYPLYN's assistant. I can help with campaigns, creator signup, pricing, and how the platform works. What would you like to know?",
  quickReplies: [
    { label: 'How does MYPLYN work?', message: 'How does MYPLYN work?' },
    { label: 'What does pricing cost?', message: 'What does pricing cost for businesses and creators?' },
    { label: "I'm a creator — is it free?", message: 'Is MYPLYN free for creators? How do I join?' },
    { label: 'Contact / get started', message: 'How can I contact MYPLYN or get started?' },
  ],
};
