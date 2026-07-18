import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqcfgafscvgpdvvlspvy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxY2ZnYWZzY3ZncGR2dmxzcHZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk2OTM2NSwiZXhwIjoyMDk5NTQ1MzY1fQ.s3E5WBCdkVl2d4PFoImsdtfn1vISCwF9s_4YoM_-1p8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');
  
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
