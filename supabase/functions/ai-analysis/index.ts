import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory cache for AI responses (in production, use Redis)
const aiCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Cache TTL in milliseconds
const CACHE_TTL = {
  typing_analysis: 24 * 60 * 60 * 1000, // 24 hours
  personalized_lesson: 7 * 24 * 60 * 60 * 1000, // 7 days
  weakness_analysis: 12 * 60 * 60 * 1000, // 12 hours
  performance_insights: 6 * 60 * 60 * 1000, // 6 hours
}

function getCacheKey(type: string, data: any): string {
  // Create deterministic cache key based on analysis type and relevant data
  switch (type) {
    case 'typing_analysis':
      const avgWpm = Math.round(data.reduce((sum: number, test: any) => sum + test.wpm, 0) / data.length)
      const avgAccuracy = Math.round(data.reduce((sum: number, test: any) => sum + test.accuracy, 0) / data.length)
      return `analysis_${avgWpm}_${avgAccuracy}_${data.length}`
    
    case 'personalized_lesson':
      return `lesson_${data.weaknesses.sort().join('_')}`
    
    case 'weakness_analysis':
      return `weakness_${data.userId}_${data.testCount}`
    
    default:
      return `${type}_${JSON.stringify(data).slice(0, 50)}`
  }
}

function getFromCache(key: string): any | null {
  const cached = aiCache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    aiCache.delete(key)
    return null
  }
  
  return cached.data
}

function setCache(key: string, data: any, ttl: number): void {
  aiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

async function callOpenAI(messages: any[], maxTokens = 500): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const result = await response.json()
  return result.choices[0].message.content
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data: requestData, userId } = await req.json()
    
    // Verify user authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      throw new Error('Unauthorized')
    }

    // Generate cache key
    const cacheKey = getCacheKey(type, requestData)
    
    // Check cache first
    const cachedResult = getFromCache(cacheKey)
    if (cachedResult) {
      return new Response(
        JSON.stringify({ 
          analysis: cachedResult, 
          cached: true,
          cacheKey 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    let analysis: string
    let ttl = CACHE_TTL.typing_analysis

    switch (type) {
      case 'typing_analysis':
        ttl = CACHE_TTL.typing_analysis
        analysis = await callOpenAI([
          {
            role: 'system',
            content: 'You are an expert typing coach. Analyze typing performance and provide insights in JSON format with weaknesses, strengths, suggestions, and nextGoals arrays.'
          },
          {
            role: 'user',
            content: `Analyze this typing data and provide structured insights: ${JSON.stringify(requestData)}`
          }
        ])
        break

      case 'personalized_lesson':
        ttl = CACHE_TTL.personalized_lesson
        analysis = await callOpenAI([
          {
            role: 'system',
            content: 'Generate a custom typing lesson text that focuses on specific weaknesses. Return only the practice text, no explanations.'
          },
          {
            role: 'user',
            content: `Create a typing practice text that helps with these weaknesses: ${requestData.weaknesses.join(', ')}`
          }
        ], 200)
        break

      case 'weakness_analysis':
        ttl = CACHE_TTL.weakness_analysis
        analysis = await callOpenAI([
          {
            role: 'system',
            content: 'Analyze typing patterns to identify specific weaknesses and provide targeted improvement strategies.'
          },
          {
            role: 'user',
            content: `Identify weaknesses in this typing data: ${JSON.stringify(requestData)}`
          }
        ])
        break

      case 'performance_insights':
        ttl = CACHE_TTL.performance_insights
        analysis = await callOpenAI([
          {
            role: 'system',
            content: 'Provide motivational performance insights and next steps for typing improvement.'
          },
          {
            role: 'user',
            content: `Generate insights for this performance data: ${JSON.stringify(requestData)}`
          }
        ])
        break

      default:
        throw new Error('Invalid analysis type')
    }

    // Cache the result
    setCache(cacheKey, analysis, ttl)

    // Store cache metadata in database for analytics
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await serviceSupabase
      .from('ai_cache_analytics')
      .insert({
        user_id: userId,
        cache_key: cacheKey,
        analysis_type: type,
        cache_hit: false,
        created_at: new Date().toISOString()
      })
      .catch(() => {}) // Don't fail if analytics insert fails

    return new Response(
      JSON.stringify({ 
        analysis, 
        cached: false,
        cacheKey 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('AI Analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})