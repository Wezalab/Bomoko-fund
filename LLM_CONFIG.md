# LLM Configuration Guide

This project supports multiple LLM providers (Groq and ChatGPT). You can configure which provider to use via environment variables.

## Setup Instructions

1. **Create a `.env` file** in the root directory of your project

2. **Add the following environment variables:**

```bash
# LLM Provider Configuration
# Choose between "groq" or "chatgpt"
VITE_LLM_PROVIDER=chatgpt

# Groq Configuration
VITE_GROQ_API_KEY=your-groq-api-key-here

# ChatGPT Configuration
VITE_CHATGPT_API_KEY=your-chatgpt-api-key-here
VITE_CHATGPT_MODEL=gpt-4o

# Other existing configuration
VITE_BOMOKO_SERVER=your-server-url
VITE_PAYMENT_TOKEN=your-payment-token
```

## Available Providers

### ChatGPT (Default)
- **Provider**: `chatgpt`
- **Model**: `gpt-4o` (configurable via `VITE_CHATGPT_MODEL`)
- **API Key**: Set `VITE_CHATGPT_API_KEY`

### Groq
- **Provider**: `groq`
- **Model**: `llama3-8b-8192`
- **API Key**: Set `VITE_GROQ_API_KEY`

## Usage

The system will automatically use the configured provider for all AI-related functions:

- Business plan content generation
- Business type suggestions
- Business name suggestions
- Content enhancement
- Domain-specific options generation

## Example Configuration

### For ChatGPT (Default):
```bash
VITE_LLM_PROVIDER=chatgpt
VITE_CHATGPT_API_KEY=sk-proj-your_actual_chatgpt_api_key_here
VITE_CHATGPT_MODEL=gpt-4o
```

### For Groq:
```bash
VITE_LLM_PROVIDER=groq
VITE_GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

## Notes

- If no provider is specified, the system defaults to ChatGPT
- Make sure to keep your API keys secure and never commit them to version control
- The `.env` file is already included in `.gitignore`
- Restart your development server after changing environment variables 