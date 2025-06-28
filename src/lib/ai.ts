import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - use backend in production
});

export interface TypingAnalysis {
  weaknesses: string[];
  strengths: string[];
  suggestions: string[];
  nextGoals: string[];
}

export async function analyzeTypingPatterns(typingHistory: any[]): Promise<TypingAnalysis> {
  if (!typingHistory.length) {
    return {
      weaknesses: [],
      strengths: [],
      suggestions: ['Complete more typing tests to get personalized insights'],
      nextGoals: ['Aim for 40+ WPM with 90%+ accuracy']
    };
  }

  const avgWpm = typingHistory.reduce((sum, test) => sum + test.wpm, 0) / typingHistory.length;
  const avgAccuracy = typingHistory.reduce((sum, test) => sum + test.accuracy, 0) / typingHistory.length;
  const recentTests = typingHistory.slice(0, 10);
  
  try {
    const prompt = `
    Analyze this typing performance data and provide insights:
    
    Average WPM: ${avgWpm.toFixed(1)}
    Average Accuracy: ${avgAccuracy.toFixed(1)}%
    Total Tests: ${typingHistory.length}
    Recent Performance: ${JSON.stringify(recentTests.map(t => ({ wpm: t.wpm, accuracy: t.accuracy })))}
    
    Provide analysis in this JSON format:
    {
      "weaknesses": ["specific areas to improve"],
      "strengths": ["what they're doing well"],
      "suggestions": ["actionable improvement tips"],
      "nextGoals": ["realistic next milestones"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert typing coach. Analyze typing performance data and provide helpful, specific insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return analysis;
  } catch (error) {
    console.error('AI analysis failed:', error);
    
    // Fallback analysis based on simple rules
    const analysis: TypingAnalysis = {
      weaknesses: [],
      strengths: [],
      suggestions: [],
      nextGoals: []
    };

    if (avgAccuracy < 90) {
      analysis.weaknesses.push('Accuracy needs improvement');
      analysis.suggestions.push('Slow down and focus on precision over speed');
    }

    if (avgWpm < 40) {
      analysis.weaknesses.push('Typing speed is below average');
      analysis.suggestions.push('Practice touch typing fundamentals');
    }

    if (avgAccuracy >= 95) {
      analysis.strengths.push('Excellent accuracy - great foundation!');
    }

    if (avgWpm >= 60) {
      analysis.strengths.push('Above-average typing speed');
    }

    // Set realistic goals
    if (avgWpm < 40) {
      analysis.nextGoals.push('Reach 40 WPM consistently');
    } else if (avgWpm < 60) {
      analysis.nextGoals.push('Achieve 60 WPM milestone');
    } else {
      analysis.nextGoals.push('Master advanced typing techniques');
    }

    return analysis;
  }
}

export async function generatePersonalizedLesson(weaknesses: string[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a custom typing lesson text that focuses on specific weaknesses. Return only the practice text, no explanations.'
        },
        {
          role: 'user',
          content: `Create a typing practice text that helps with these weaknesses: ${weaknesses.join(', ')}`
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    return response.choices[0].message.content || 'The quick brown fox jumps over the lazy dog.';
  } catch (error) {
    console.error('Failed to generate lesson:', error);
    return 'The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type efficiently.';
  }
}