import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// PDF Storage functions
export const uploadPDF = async (file: File, subjectId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${subjectId}/${Math.random()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('textbooks')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('textbooks')
      .getPublicUrl(fileName);

    // Save to database
    const { error: dbError } = await supabase
      .from('resources')
      .insert({
        subject_id: subjectId,
        name: file.name,
        file_path: fileName,
        url: publicUrl,
        type: 'pdf'
      });

    if (dbError) throw dbError;

    return { publicUrl, fileName };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

export const fetchSubjectResources = async (subjectId: string) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('subject_id', subjectId);

  if (error) throw error;
  return data;
};

// NCERT and State Board Content
export const fetchTextbookContent = async (subject: string, chapter?: string) => {
  let query = supabase
    .from('textbook_content')
    .select('*')
    .eq('subject', subject);

  if (chapter) {
    query = query.eq('chapter', chapter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// AI Assistant Context
export const getSubjectContext = async (subject: string) => {
  const { data, error } = await supabase
    .from('textbook_content')
    .select('content')
    .eq('subject', subject);

  if (error) throw error;
  return data?.map(d => d.content).join('\n') || '';
};