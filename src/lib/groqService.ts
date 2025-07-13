import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { groqApiKey, llmProvider, chatgptApiKey, chatgptModel } from './env';

// Initialize providers
const groq = new Groq({
  apiKey: groqApiKey,
  dangerouslyAllowBrowser: true
});

const openai = new OpenAI({
  apiKey: chatgptApiKey,
  dangerouslyAllowBrowser: true
});

// Generic chat completion function that uses the configured provider
export const getChatCompletion = async (message: string) => {
  try {
    if (llmProvider === 'groq') {
      // Use Groq
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 2048,
      });
      return response;
    } else {
      // Default to ChatGPT
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: chatgptModel,
        temperature: 0.7,
        max_tokens: 2048,
      });
      return response;
    }
      } catch (error) {
      console.error(`Error in getChatCompletion with ${llmProvider || 'chatgpt (default)'}:`, error);
      throw error;
    }
};

// Keep the old function for backwards compatibility
export const getGroqChatCompletion = getChatCompletion;

export const generateBusinessPlanContent = async (
  section: string, 
  companyName: string = "REST-DRC", 
  industry: string = "Restaurant",
  wizardData?: any
) => {
  // Extraire les informations du wizard
  const businessInfo = wizardData ? {
    companyName: wizardData.question_2 || companyName,
    industry: wizardData.question_3 || industry,
    usage: wizardData.question_1 || "Ma propre entreprise",
    financialModel: wizardData.question_4 || "Non, je crée mon propre modèle",
    planningPeriod: wizardData.question_6 || "3 ans",
    currency: wizardData.question_8 || "Dollar américain",
    startMonth: wizardData.question_5 || "Mai 2025"
  } : { companyName, industry };

  const prompts = {
    "Résumé exécutif": `Rédigez un résumé exécutif professionnel pour ${businessInfo.companyName}, une entreprise dans le secteur ${businessInfo.industry}. Incluez un aperçu de l'entreprise, la mission, les facteurs clés de succès et l'opportunité de marché. Écrivez dans un ton professionnel de plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté au contexte africain francophone.`,
    
    "Opportunité": `Rédigez une section complète sur l'opportunité pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez les problèmes à résoudre, l'analyse des lacunes du marché et comment cette entreprise répond aux points de douleur des clients. Écrivez dans un langage professionnel de plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et pertinent pour le marché africain.`,
    
    "Aperçu de l'entreprise": `Rédigez un aperçu détaillé de l'entreprise pour ${businessInfo.companyName}, une société ${businessInfo.industry}. Incluez la description de l'entreprise, l'historique, la structure juridique, la propriété et les valeurs fondamentales. Ton professionnel de plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté au contexte entrepreneurial africain.`,
    
    "Analyse du marché": `Rédigez une analyse de marché complète pour ${businessInfo.companyName} dans l'industrie ${businessInfo.industry}. Incluez la taille du marché cible, les tendances de croissance, la segmentation du marché et le paysage concurrentiel. Utilisez un langage professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français et spécifique au marché africain.`,
    
    "Concurrence": `Analysez le paysage concurrentiel pour ${businessInfo.companyName} dans l'industrie ${businessInfo.industry}. Incluez l'analyse des concurrents, les avantages concurrentiels, le positionnement sur le marché et la stratégie de différenciation. Style professionnel de plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et pertinent pour le marché africain.`,
    
    "Marketing": `Rédigez une section stratégie marketing pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez l'analyse des clients cibles, les canaux de marketing, les stratégies promotionnelles et l'approche d'acquisition de clients. Style plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté aux pratiques marketing africaines.`,
    
    "Opérations": `Décrivez le plan opérationnel pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez la stratégie de localisation, les processus opérationnels, la chaîne d'approvisionnement, le personnel et les opérations quotidiennes. Ton professionnel de plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté au contexte opérationnel africain.`,
    
    "Plan financier": `Rédigez un aperçu financier pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez le modèle de revenus, la structure des coûts, les besoins de financement et le résumé des projections financières. La devise de référence est ${businessInfo.currency || 'Dollar américain'}. Utilisez un langage professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté au contexte financier africain.`,
    
    "Compte de résultat": `Présentez une analyse du compte de résultat pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez les principales sources de revenus, les coûts opérationnels, les marges prévues et la rentabilité. La devise de référence est ${businessInfo.currency || 'Dollar américain'}. Ton professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français.`,
    
    "Bilan": `Décrivez les projections du bilan pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez les actifs prévus, les passifs, les capitaux propres et la structure financière. La devise de référence est ${businessInfo.currency || 'Dollar américain'}. Langage professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français.`,
    
    "État des flux de trésorerie": `Analysez les flux de trésorerie pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez les flux de trésorerie opérationnels, d'investissement et de financement. La devise de référence est ${businessInfo.currency || 'Dollar américain'}. Style professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français.`,
    
    "Compte de résultat (mensuel)": `Présentez l'analyse mensuelle du compte de résultat pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez les variations saisonnières, les tendances mensuelles et les facteurs d'influence. La devise de référence est ${businessInfo.currency || 'Dollar américain'}. Ton professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français.`,
    
    "Bilan (mensuel)": `Décrivez les projections mensuelles du bilan pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez l'évolution mensuelle des actifs, passifs et capitaux propres. La devise de référence est ${businessInfo.currency || 'Dollar américian'}. Langage professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français.`,
    
    "Flux de trésorerie (mensuel)": `Analysez les flux de trésorerie mensuels pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez les variations mensuelles, les besoins de financement et la gestion de trésorerie. La devise de référence est ${businessInfo.currency || 'Dollar américain'}. Style professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français.`,
    
    "Équipe": `Décrivez l'équipe de direction et la structure organisationnelle pour ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Incluez le personnel clé, les rôles et responsabilités, le conseil consultatif et la stratégie des ressources humaines. Ton plan d'affaires, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté au contexte professionnel africain.`
  };

  const prompt = prompts[section as keyof typeof prompts] || `Rédigez un contenu professionnel de plan d'affaires pour la section ${section} de ${businessInfo.companyName}, une entreprise ${businessInfo.industry}. Utilisez un langage professionnel, 2-3 paragraphes. Le contenu doit être entièrement en français et adapté au contexte entrepreneurial africain.`;
  
  try {
    const response = await getChatCompletion(prompt);
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error(`Error generating content for ${section}:`, error);
    return `Contenu pour la section ${section}. Ce contenu peut être généré avec l'IA ou édité manuellement.`;
  }
};

export const enhanceContent = async (currentContent: string, instructions: string) => {
  const prompt = `Veuillez améliorer le contenu suivant de plan d'affaires basé sur ces instructions: "${instructions}"\n\nContenu actuel:\n${currentContent}\n\nFournissez la version améliorée entièrement en français et adaptée au contexte africain francophone:`;
  
  try {
    const response = await getChatCompletion(prompt);
    return response.choices[0]?.message?.content || currentContent;
  } catch (error) {
    console.error('Error enhancing content:', error);
    return currentContent;
  }
};

export const generateDomainSpecificOptions = async (
  businessDomain: string,
  questionType: string,
  questionLabel: string,
  currentSection: string
) => {
  const prompts = {
    'multi-select': `Générez 8-12 options pertinentes pour une question de sélection multiple dans le domaine "${businessDomain}". 
    Question: "${questionLabel}"
    Section: "${currentSection}"
    
    Retournez UNIQUEMENT un tableau JSON d'options sous cette forme exacte:
    ["Option 1", "Option 2", "Option 3", ...]
    
    Les options doivent être:
    - Spécifiques au domaine ${businessDomain}
    - Pertinentes pour le contexte africain francophone
    - Courtes et claires
    - Pratiques et actionables`,
    
    'single-choice': `Générez 4-6 options pertinentes pour une question à choix unique dans le domaine "${businessDomain}".
    Question: "${questionLabel}"
    Section: "${currentSection}"
    
    Retournez UNIQUEMENT un tableau JSON d'options sous cette forme exacte:
    ["Option 1", "Option 2", "Option 3", ...]
    
    Les options doivent être:
    - Spécifiques au domaine ${businessDomain}
    - Mutuellement exclusives
    - Pertinentes pour le marché africain
    - Claires et distinctes`,
    
    'multi-text': `Générez 3-5 exemples d'entrées textuelles pour une liste dans le domaine "${businessDomain}".
    Question: "${questionLabel}"
    Section: "${currentSection}"
    
    Retournez UNIQUEMENT un tableau JSON d'exemples sous cette forme exacte:
    ["Exemple 1", "Exemple 2", "Exemple 3", ...]
    
    Les exemples doivent être:
    - Spécifiques au domaine ${businessDomain}
    - Inspirants et pratiques
    - Adaptés au contexte africain
    - Concrets et réalisables`
  };

  const prompt = prompts[questionType as keyof typeof prompts] || 
    `Générez des options appropriées pour "${questionLabel}" dans le domaine "${businessDomain}". Retournez un tableau JSON simple.`;
  
  try {
    const response = await getChatCompletion(prompt);
    const content = response.choices[0]?.message?.content || '';
    
    // Extraire le JSON du contenu
    const jsonMatch = content.match(/\[(.*?)\]/s);
    if (jsonMatch) {
      try {
        const options = JSON.parse(jsonMatch[0]);
        return Array.isArray(options) ? options : [];
      } catch (e) {
        console.error('Error parsing JSON options:', e);
        return [];
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error generating domain-specific options:', error);
    return [];
  }
};

export const generateSectionQuestions = async (
  businessDomain: string,
  sectionTitle: string,
  subsectionTitle: string
) => {
  const prompt = `Générez 2-4 questions pertinentes pour une sous-section de plan d'affaires dans le domaine "${businessDomain}".
  
  Section: "${sectionTitle}"
  Sous-section: "${subsectionTitle}"
  
  Retournez UNIQUEMENT un tableau JSON de questions sous cette forme exacte:
  [
    {
      "label": "Question 1 ?",
      "description": "Description claire de ce qui est attendu",
      "type": "text",
      "placeholder": "Exemple de réponse..."
    },
    {
      "label": "Question 2 ?",
      "description": "Description claire de ce qui est attendu",
      "type": "multi-select",
      "options": ["Option A", "Option B", "Option C"]
    }
  ]
  
  Les questions doivent être:
  - Spécifiques au domaine ${businessDomain}
  - Pertinentes pour le contexte africain francophone
  - Progressives et logiques
  - Pratiques et actionables`;
  
  try {
    const response = await getChatCompletion(prompt);
    const content = response.choices[0]?.message?.content || '';
    
    // Extraire le JSON du contenu
    const jsonMatch = content.match(/\[(.*?)\]/s);
    if (jsonMatch) {
      try {
        const questions = JSON.parse(jsonMatch[0]);
        return Array.isArray(questions) ? questions : [];
      } catch (e) {
        console.error('Error parsing JSON questions:', e);
        return [];
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error generating section questions:', error);
    return [];
  }
}; 

export const generateBusinessTypeSuggestions = async (businessDescription: string) => {
  const prompt = `Based on the following business description, suggest 4-6 relevant business types or classifications that most accurately describe this business:

Business Description: "${businessDescription}"

Please return ONLY a JSON array of business type suggestions in this exact format:
["Business Type 1", "Business Type 2", "Business Type 3", ...]

The suggestions should be:
- Specific and relevant to the described business
- Professional business categories/classifications
- Suitable for business plan categorization
- Clear and concise (2-4 words each)

Examples of good business types: "Software Company", "E-commerce Platform", "Consulting Firm", "Manufacturing Business", "Digital Marketing Agency", etc.`;

  try {
    const response = await getChatCompletion(prompt);
    const content = response.choices[0]?.message?.content || '';
    
    // Extract the JSON from the content
    const jsonMatch = content.match(/\[(.*?)\]/s);
    if (jsonMatch) {
      try {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (e) {
        console.error('Error parsing JSON suggestions:', e);
        return [];
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error generating business type suggestions:', error);
    return [];
  }
};

export const generateBusinessNameSuggestions = async (businessDescription: string, businessTypes: string[]) => {
  try {
    const prompt = `Generate 6-9 creative, professional business names for a business described as: "${businessDescription}"
Business types: ${businessTypes.join(', ')}

Please include names in multiple languages reflecting the Democratic Republic of Congo's linguistic diversity:
- French (official language)
- Lingala 
- Swahili

Create names that are:
1. Professional and memorable
2. Appropriate for the business type
3. Culturally relevant to DRC and Africa
4. Easy to pronounce and remember
5. Suitable for international markets

Please return ONLY a JSON array of business name suggestions in this exact format:
["Business Name 1", "Business Name 2", "Business Name 3", ...]

Do not include any explanations or additional text.`;

    const response = await getChatCompletion(prompt);

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('No content received from AI');
    }

    // Parse the JSON response
    const suggestions = JSON.parse(content);
    
    // Validate that it's an array
    if (!Array.isArray(suggestions)) {
      throw new Error('AI response is not an array');
    }

    return suggestions.slice(0, 9); // Limit to 9 suggestions
  } catch (error) {
    console.error('Error generating business name suggestions:', error);
    // Return fallback suggestions in multiple DRC languages
    return [
      'BOMOKO Solutions',
      'Kinshasa Enterprises',
      'Mokili Business', // Lingala: "world"
      'Dunia Ventures', // Swahili: "world"
      'Kongo Innovations',
      'Lumumba Group',
      'Bandundu Holdings',
      'Matadi Commerce',
      'Lubumbashi Industries'
    ];
  }
}; 