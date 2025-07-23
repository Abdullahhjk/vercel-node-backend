import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { username, institution, role } = req.body;

  if (!username || !institution || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .eq('institution', institution)
    .eq('role', role);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data && data.length > 0) {
    return res.status(200).json({
      supabase_url: supabaseUrl,
      supabase_anon_key: supabaseAnonKey
    });
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
}
