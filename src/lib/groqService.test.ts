import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBusinessPlanContent } from './groqService';

// Mock groq-sdk
vi.mock('groq-sdk', () => {
  const GroqMock = class {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Generated business plan content.'
              }
            }
          ]
        })
      }
    };
  };
  return { default: GroqMock };
});

// Mock openai
vi.mock('openai', () => {
  const OpenAIMock = class {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Generated business plan content.'
              }
            }
          ]
        })
      }
    };
  };
  return { default: OpenAIMock };
});

// Mock env variables so that neither throws an error due to missing keys
vi.mock('./env', () => {
  return {
    groqApiKey: 'mock-groq-key',
    llmProvider: 'groq',
    chatgptApiKey: 'mock-openai-key',
    chatgptModel: 'gpt-3.5-turbo'
  };
});

describe('groqService - generateBusinessPlanContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates content using basic info', async () => {
    const result = await generateBusinessPlanContent('Executive Summary', 'Test Company', 'Technology');
    expect(result).toBe('Generated business plan content.');
  });

  it('includes wizardData if provided', async () => {
    const wizardData = {
      plan_type: 'fullBusinessPlan',
      company_structure: 'LLC'
    };
    const result = await generateBusinessPlanContent('Executive Summary', 'Test Company', 'Technology', wizardData);
    expect(result).toBe('Generated business plan content.');
  });

  it('includes bmcData if provided', async () => {
    const bmcData = {
      valuePropositions: [{ id: '1', title: 'Great Service' }],
      customerSegments: [{ id: '1', title: 'Tech Users' }]
    };
    const result = await generateBusinessPlanContent('Executive Summary', 'Test Company', 'Technology', undefined, bmcData);
    expect(result).toBe('Generated business plan content.');
  });
});
