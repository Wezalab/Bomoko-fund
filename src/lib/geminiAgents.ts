import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiApiKey } from './env';

// Initialize the API only if the key exists
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export interface AgentContext {
  businessDescription: string;
  targetMarket: string;
  goals: string;
  [key: string]: any;
}

// Define the roles for our multi-agent system
const agentRoles = {
  marketing: `You are an expert Marketing Strategist. Your goal is to analyze the business concept and provide a comprehensive marketing and sales strategy. Focus on target audience, positioning, channels, and customer acquisition. Keep it professional and actionable.`,
  financial: `You are an expert Financial Analyst. Your goal is to review the business concept and provide a high-level financial strategy and projections overview. Focus on revenue streams, cost structure, break-even analysis, and funding requirements.`,
  operations: `You are an expert Operations Manager. Your goal is to outline the operational strategy for the business. Focus on supply chain, daily operations, technology needs, and key milestones.`,
  executive: `You are a Seasoned CEO. Your goal is to take the outputs from the marketing, financial, and operations experts and synthesize them into a compelling Executive Summary and Business Overview.`
};

export const generateMultiAgentBusinessPlan = async (context: AgentContext, onProgress?: (step: string) => void) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
  }

  // Use gemini-1.5-pro for complex reasoning
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const basePrompt = `
Business Description: ${context.businessDescription}
Target Market: ${context.targetMarket}
Goals: ${context.goals}
  `;

  try {
    // Step 1: Marketing Agent
    onProgress?.('Marketing Expert is analyzing the market...');
    const marketingPrompt = `${agentRoles.marketing}\n\nBased on the following business context, write the Marketing Strategy section:\n${basePrompt}`;
    const marketingResult = await model.generateContent(marketingPrompt);
    const marketingStrategy = marketingResult.response.text();

    // Step 2: Financial Agent
    onProgress?.('Financial Analyst is projecting financials...');
    const financialPrompt = `${agentRoles.financial}\n\nBased on the following business context, write the Financial Strategy section:\n${basePrompt}`;
    const financialResult = await model.generateContent(financialPrompt);
    const financialStrategy = financialResult.response.text();

    // Step 3: Operations Agent
    onProgress?.('Operations Manager is outlining operations...');
    const operationsPrompt = `${agentRoles.operations}\n\nBased on the following business context, write the Operations Strategy section:\n${basePrompt}`;
    const operationsResult = await model.generateContent(operationsPrompt);
    const operationsStrategy = operationsResult.response.text();

    // Step 4: Executive Synthesis
    onProgress?.('CEO is synthesizing the Executive Summary...');
    const executivePrompt = `${agentRoles.executive}\n\nBased on the following business context and department strategies, write a powerful Executive Summary.\n
Context:\n${basePrompt}\n
Marketing Strategy:\n${marketingStrategy}\n
Financial Strategy:\n${financialStrategy}\n
Operations Strategy:\n${operationsStrategy}`;
    
    const executiveResult = await model.generateContent(executivePrompt);
    const executiveSummary = executiveResult.response.text();

    onProgress?.('Business Plan complete!');

    return {
      executiveSummary,
      marketingStrategy,
      financialStrategy,
      operationsStrategy,
      fullPlan: `# Executive Summary\n${executiveSummary}\n\n# Marketing Strategy\n${marketingStrategy}\n\n# Operations Strategy\n${operationsStrategy}\n\n# Financial Strategy\n${financialStrategy}`
    };

  } catch (error) {
    console.error('Error generating multi-agent business plan:', error);
    throw error;
  }
};
