import { verifyBearerToken, createAuthResponse, extractTraceId, isTestMode } from '../../../../lib/auth.js';
import { insertIdea } from '../../../../lib/supabase.js';
import { logIncident, logMessage, createErrorResponse, createSuccessResponse } from '../../../../lib/telemetry.js';

export async function POST(request) {
  const traceId = extractTraceId(request);
  
  try {
    const body = await request.json();
    const { idea_text, source = 'landing_form', submitted_by } = body;
    
    if (!idea_text) {
      return new Response(
        JSON.stringify(createErrorResponse({
          code: 'INVALID_INPUT',
          message: 'idea_text is required',
          traceId
        })),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await logMessage({
      agentId: 'idea_agent',
      level: 'info',
      msg: `Processing idea submission from ${source}`,
      traceId,
      metadata: { source, submitted_by }
    });
    
    const short_title = generateShortTitle(idea_text);
    const description = idea_text;
    const tags = extractTags(idea_text);
    const initial_score = calculateInitialScore(idea_text);
    
    const ideaRecord = {
      title: short_title,
      description,
      tags,
      keywords: tags,
      status: 'draft',
      source,
      submitted_by,
      initial_score,
      validation_score: initial_score,
      ai_summary: `Draft idea: ${short_title}`,
      category: tags[0] || 'uncategorized'
    };
    
    if (isTestMode()) {
      return new Response(
        JSON.stringify(createSuccessResponse({
          id: 'test-' + Date.now(),
          short_title,
          description,
          tags,
          keywords: tags,
          initial_score,
          status: 'draft',
          source,
          submitted_by,
          created_at: new Date().toISOString(),
          test_mode: true
        }, traceId)),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    let savedIdea;
    try {
      savedIdea = await insertIdea(ideaRecord);
    } catch (dbError) {
      console.error('Supabase error:', dbError);
      
      // Check if Supabase is not configured
      if (dbError.message && dbError.message.includes('Supabase not configured')) {
        await logIncident({
          agentId: 'idea_agent',
          severity: 'error',
          code: 'SUPABASE_NOT_CONFIGURED',
          message: 'Supabase database is not configured',
          details: { error: dbError.message },
          traceId
        });
        
        return new Response(
          JSON.stringify(createErrorResponse({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Database service is not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables.',
            details: { error: dbError.message },
            traceId
          })),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // For other database errors
      await logIncident({
        agentId: 'idea_agent',
        severity: 'error',
        code: 'DATABASE_INSERT_FAILED',
        message: 'Failed to insert idea into database',
        details: { error: dbError.message, stack: dbError.stack },
        traceId
      });
      
      return new Response(
        JSON.stringify(createErrorResponse({
          code: 'DATABASE_ERROR',
          message: 'Failed to save idea to database',
          details: { error: dbError.message },
          traceId
        })),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await logMessage({
      agentId: 'idea_agent',
      level: 'info',
      msg: `Idea created successfully: ${savedIdea.id}`,
      traceId,
      metadata: { idea_id: savedIdea.id }
    });
    
    triggerN8NWebhook('validated_idea.created', savedIdea, traceId);
    
    return new Response(
      JSON.stringify(createSuccessResponse({
        id: savedIdea.id,
        short_title,
        description,
        tags,
        keywords: tags,
        initial_score,
        status: 'draft',
        source,
        submitted_by,
        created_at: savedIdea.created_at
      }, traceId)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    await logIncident({
      agentId: 'idea_agent',
      severity: 'error',
      code: 'IDEA_ANALYSIS_FAILED',
      message: error.message,
      details: { stack: error.stack },
      traceId
    });
    
    return new Response(
      JSON.stringify(createErrorResponse({
        code: 'INTERNAL_ERROR',
        message: 'Failed to process idea',
        details: { error: error.message },
        traceId
      })),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function generateShortTitle(idea_text) {
  const words = idea_text.split(/\s+/).slice(0, 8);
  let title = words.join(' ');
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  return title || 'Untitled Idea';
}

function extractTags(idea_text) {
  const text = idea_text.toLowerCase();
  const keywords = ['saas', 'ai', 'automation', 'productivity', 'analytics', 
    'marketing', 'social', 'ecommerce', 'api', 'integration'];
  
  return keywords.filter(keyword => text.includes(keyword)).slice(0, 5);
}

function calculateInitialScore(idea_text) {
  let score = 50;
  
  if (idea_text.length > 100) score += 10;
  if (idea_text.length > 200) score += 10;
  if (idea_text.includes('automat')) score += 5;
  if (idea_text.includes('ai') || idea_text.includes('ml')) score += 5;
  if (idea_text.includes('saas')) score += 5;
  
  return Math.min(score, 100);
}

async function triggerN8NWebhook(event, data, traceId) {
  const n8nHost = process.env.N8N_HOST;
  if (!n8nHost || isTestMode()) return;
  
  try {
    await fetch(`${n8nHost}/webhook/microsaas-space/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Trace-ID': traceId
      },
      body: JSON.stringify({ event, data, trace_id: traceId })
    });
  } catch (error) {
    console.warn(`Failed to trigger n8n webhook: ${error.message}`);
  }
}
