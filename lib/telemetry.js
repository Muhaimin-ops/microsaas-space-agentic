import { supabase } from './supabase.js';

export async function logIncident({ agentId, severity, code, message, details = {}, traceId }) {
  if (!supabase) {
    console.warn('[Telemetry] Supabase not configured. Incident logged to console:', {
      agentId, severity, code, message, details, traceId
    });
    return;
  }
  
  try {
    await supabase.from('incidents').insert([{
      agent_id: agentId,
      severity,
      code,
      message,
      details,
      trace_id: traceId,
      resolved: false
    }]);
  } catch (error) {
    console.warn('[Telemetry] Failed to log incident to database (table may not exist):', {
      agentId, severity, code, message, error: error.message
    });
  }
}

export async function logMessage({ agentId, level, msg, traceId, metadata = {} }) {
  if (!supabase) {
    console.log(`[${level.toUpperCase()}][${agentId}] ${msg}`, metadata);
    return;
  }
  
  try {
    await supabase.from('logs').insert([{
      agent_id: agentId,
      trace_id: traceId,
      level,
      msg,
      payload_size: JSON.stringify(metadata).length,
      metadata
    }]);
  } catch (error) {
    console.log(`[${level.toUpperCase()}][${agentId}] ${msg}`, metadata);
    console.warn('[Telemetry] Failed to log to database (table may not exist):', error.message);
  }
}

export function createErrorResponse({ code, message, details = {}, traceId }, status = 500) {
  return {
    error: {
      code,
      message,
      details,
      trace_id: traceId
    }
  };
}

export function createSuccessResponse(data, traceId) {
  return {
    ...data,
    trace_id: traceId
  };
}
