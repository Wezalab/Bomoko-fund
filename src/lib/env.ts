const apiUrl = import.meta.env.VITE_BOMOKO_SERVER;
const payementToken = import.meta.env.VITE_PAYMENT_TOKEN;
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

// LLM Provider Configuration
const llmProvider = import.meta.env.VITE_LLM_PROVIDER || 'chatgpt';
const chatgptApiKey = import.meta.env.VITE_CHATGPT_API_KEY;
const chatgptModel = import.meta.env.VITE_CHATGPT_MODEL || 'gpt-4o';

export {
    apiUrl,
    payementToken,
    groqApiKey,
    llmProvider,
    chatgptApiKey,
    chatgptModel
}