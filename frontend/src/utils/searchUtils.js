/**
 * Utility to extract searchable keywords and phrases from job objects.
 * This collects unique words from titles, locations, skills, and experience.
 */
export const generateJobKeywords = (jobs) => {
  if (!Array.isArray(jobs) || jobs.length === 0) return [];

  const keywords = new Set();
  const stopWords = new Set(['and', 'the', 'for', 'with', 'required', 'years', 'level', 'from', 'each', 'this', 'other']);

  jobs.forEach(job => {
    // Collect text from all relevant fields
    const textToProcess = [
      job.title,
      job.location,
      job.category === 'clinician' ? 'Clinical' : 'Non-Clinical',
      job.experience_required,
      ...(Array.isArray(job.skills_required) ? job.skills_required : (typeof job.skills_required === 'string' ? job.skills_required.split(',') : []))
    ].filter(Boolean).join(' ');

    // Tokenize everything and clean
    const words = textToProcess.split(/[\s,./-]+/).filter(w => w.length > 2 && w.length < 25);
    
    words.forEach(w => {
      const word = w.trim();
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Basic stop word and number filter
      if (cleanWord && !stopWords.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
        // Add the original word (maintaining casing like 'London' or 'React')
        keywords.add(word);
      }
    });
  });

  // Convert to array, remove duplicates, and sort alphabetically
  return Array.from(keywords)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};
