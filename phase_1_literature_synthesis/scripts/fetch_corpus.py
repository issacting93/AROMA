import requests
import pandas as pd
import time
import os

# ==========================================
# 1. CONFIGURATION & SEARCH PARAMETERS
# ==========================================
# This query combines the core AROMA domain with targeted terms 
# for the Navigator/Connector role (referral, linkage, triage).
SEARCH_QUERY = (
    '("mental health" OR "emotional support" OR "wellbeing" OR "well-being" OR "psychological") '
    'AND ("chatbot" OR "conversational agent" OR "LLM" OR "large language model" OR "AI companion" OR "virtual agent" OR "social robot" OR "dialogue system") '
    'AND ("support" OR "counseling" OR "counselling" OR "therapy" OR "peer support" OR "coaching" OR "care" OR "intervention") '
    'AND ("role" OR "persona" OR "stance" OR "behavior" OR "strategy" OR "interaction design" '
    'OR "relational" OR "empathy" OR "conversation" OR "navigator" OR "referral" OR "linkage" OR "triage")'
)

START_YEAR = 2015
END_YEAR = 2025
MAX_RESULTS = 1000  # Increased to ensure a deep corpus for Phase 2
CONTACT_EMAIL = "isaac.aroma.research@gmail.com" # Updated from placeholder

# ==========================================
# 2. API FETCH FUNCTIONS
# ==========================================

def fetch_openalex(query, limit=500):
    print(f"Starting OpenAlex fetch for: {query[:50]}...")
    url = "https://api.openalex.org/works"
    params = {
        'search': query,
        'filter': f'from_publication_date:{START_YEAR}-01-01,to_publication_date:{END_YEAR}-12-31',
        'per_page': 100,
        'mailto': CONTACT_EMAIL
    }
    
    results = []
    page = 1
    while len(results) < limit:
        params['page'] = page
        try:
            response = requests.get(url, params=params).json()
            if not response.get('results'): break
            
            for work in response['results']:
                results.append({
                    'title': work.get('display_name'),
                    'abstract': work.get('abstract_inverted_index'), # Reconstructed later if needed
                    'year': work.get('publication_year'),
                    'doi': work.get('doi'),
                    'source': 'OpenAlex',
                    'citations': work.get('cited_by_count')
                })
            print(f"OpenAlex: Collected {len(results)} papers...")
            page += 1
            if page > 10: break 
        except Exception as e:
            print(f"Error fetching from OpenAlex: {e}")
            break
    return results

def fetch_semantic_scholar(query, limit=500):
    print(f"Starting Semantic Scholar fetch for: {query[:50]}...")
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        'query': query,
        'limit': 100,
        'year': f'{START_YEAR}-{END_YEAR}',
        'fields': 'title,abstract,year,externalIds,citationCount'
    }
    
    results = []
    offset = 0
    while len(results) < limit:
        params['offset'] = offset
        try:
            response = requests.get(url, params=params).json()
            if 'data' not in response: break
            
            for paper in response['data']:
                results.append({
                    'title': paper.get('title'),
                    'abstract': paper.get('abstract'),
                    'year': paper.get('year'),
                    'doi': paper.get('externalIds', {}).get('DOI'),
                    'source': 'SemanticScholar',
                    'citations': paper.get('citationCount')
                })
            print(f"Semantic Scholar: Collected {len(results)} papers...")
            offset += 100
            time.sleep(1) # Rate limit respect
        except Exception as e:
            print(f"Error fetching from Semantic Scholar: {e}")
            break
    return results

# ==========================================
# 3. EXECUTION & DEDUPLICATION
# ==========================================

# Run both fetches
oa_data = fetch_openalex(SEARCH_QUERY, limit=MAX_RESULTS//2)
ss_data = fetch_semantic_scholar(SEARCH_QUERY, limit=MAX_RESULTS//2)

# Combine into DataFrame
df = pd.DataFrame(oa_data + ss_data)

# Clean and Deduplicate
if not df.empty:
    # Normalize DOIs
    df['doi'] = df['doi'].fillna('').astype(str).str.lower().str.replace('https://doi.org/', '', regex=False)
    
    # Remove duplicates based on DOI first
    df_clean = df.drop_duplicates(subset=['doi'])
    
    # Remove remaining duplicates based on Title (fuzzy match alternative)
    df_clean['title_clean'] = df_clean['title'].str.lower().str.replace(r'[^a-z0-9]', '', regex=True)
    df_clean = df_clean.drop_duplicates(subset=['title_clean'])
    
    # Drop the helper column
    df_clean = df_clean.drop(columns=['title_clean'])

    # ==========================================
    # 4. EXPORT
    # ==========================================
    output_path = os.path.join(os.path.dirname(__file__), '..', 'aroma_corpus_raw.csv')
    df_clean.to_csv(output_path, index=False)
    print(f"\nSUCCESS: Found {len(df_clean)} unique papers.")
    print(f"File saved as '{output_path}'.")
else:
    print("No papers found. Check your search query or connection.")
