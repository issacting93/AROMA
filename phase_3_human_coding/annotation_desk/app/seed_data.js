/**
 * AROMA Data Seeder v0.4 (HIGH FIDELITY)
 * Reconstructs dialogues from context_window for proper AROMA coding.
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function parseContext(contextStr, finalContent) {
  const turns = [];
  const lines = contextStr.split('\n').filter(l => l.trim());
  
  lines.forEach((line, i) => {
    const match = line.match(/^(Seeker|Supporter):\s*(.*)/i);
    if (match) {
      turns.push({
        speaker: match[1].toLowerCase(),
        text: match[2].trim(),
        turn_number: i + 1
      });
    }
  });

  // Add the final supporter turn (the one being coded)
  turns.push({
    speaker: 'supporter',
    text: finalContent,
    turn_number: turns.length + 1
  });

  return turns;
}

async function seed() {
  console.log('--- AROMA Seeder v0.4 (High Fidelity) Starting ---');
  
  const samplePath = path.resolve('/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/data/esconv_sample.json');
  const rawData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

  // Take first 40 distinct samples for the 40 calibration sequences
  const samples = rawData.slice(0, 40);

  for (let i = 0; i < samples.length; i++) {
    const item = samples[i];
    const externalId = `ESConv_${item.conv_idx}_T${item.turn_idx}`;
    const dialogue = parseContext(item.context_window, item.content);

    // 1. Insert Conversation
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .upsert({ 
        external_id: externalId, 
        raw_json: dialogue 
      }, { onConflict: 'external_id' })
      .select()
      .single();

    if (convErr) {
      console.error(`Error inserting conversation ${externalId}:`, convErr.message);
      continue;
    }

    // 2. Insert ONE Sequence spanning all turns
    const range = `[1,${dialogue.length + 1})`; 
    const { error: seqErr } = await supabase
      .from('sequences')
      .upsert({
        conversation_id: conv.id,
        turn_range: range,
        is_calibration: true
      }, { onConflict: 'conversation_id,turn_range' });

    if (seqErr) {
      console.log(`  ! Error inserting sequence ${range}:`, seqErr.message);
    } else {
      console.log(`  + [${i+1}/40] Seeded: ${externalId} (${dialogue.length} turns)`);
    }
  }

  console.log('--- Seeding Complete ---');
}

seed();
