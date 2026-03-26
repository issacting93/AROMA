/**
 * AROMA Data Seeder v0.3
 * Re-populates the 20 calibration sequences after a schema repair.
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- AROMA Seeder Starting ---');
  
  // 1. Load ESConv Sample
  const samplePath = path.resolve('/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/data/esconv_sample.json');
  const rawData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

  // 2. Group by conversation
  const conversations = new Map();
  rawData.forEach(item => {
    if (!conversations.has(item.conv_idx)) {
      conversations.set(item.conv_idx, []);
    }
    // Simplification: ESConv sample might not have full conversation. 
    // We treat each item as a representative turn.
    conversations.get(item.conv_idx).push(item);
  });

  const selectedConvIds = Array.from(conversations.keys()).slice(0, 5); // Take 5 conversations

  for (const convIdx of selectedConvIds) {
    const externalId = `ESConv_C${convIdx}`;
    const dialogue = conversations.get(convIdx).map((t, i) => ({
      speaker: t.strategy ? 'supporter' : 'seeker',
      text: t.content,
      turn_number: i + 1
    }));

    // 3. Insert Conversation
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .upsert({ external_id: externalId, raw_json: dialogue }, { onConflict: 'external_id' })
      .select()
      .single();

    if (convErr) {
      console.error(`Error inserting conversation ${externalId}:`, convErr.message);
      continue;
    }

    console.log(`- Inserted Conversation: ${externalId} (${conv.id})`);

    // 4. Insert 4 Sequences per conversation (Total 20)
    for (let i = 0; i < 4; i++) {
        const start = (i * 5) + 1;
        const end = (i * 5) + 5;
        const range = `[${start},${end + 1})`; // int4range format
        
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
            console.log(`  + Inserted Calibration Sequence: ${range}`);
        }
    }
  }

  console.log('--- Seeding Complete ---');
}

seed();
