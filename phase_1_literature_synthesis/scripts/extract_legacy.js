const fs = require('fs');
const content = fs.readFileSync('cross-ref-data.js', 'utf8');
// Remove the window assignment to get a parseable object
const jsonText = content.replace('window.AROMA_DATA =', '').trim().replace(/;$/, '');
// Note: This is a hacky way to parse JS objects that look like JSON. 
// If it's valid JS but not JSON (e.g. trailing commas), JSON.parse might fail.
// A better way is to evaluate it in a sandbox.

try {
    // We'll use a safer approach: use eval-like logic but specifically for this structure
    const data = eval(`(${jsonText})`);
    const entries = data.ENTRIES.map(e => ({
        id: e.id,
        title: e.label.replace(/\n/g, ' '),
        authors: e.source || "",
        year: e.yr || "",
        venue: e.venue || "",
        abstract: e.desc || "",
        relevance_score: 15, // Fixed high score for legacy anchors
        screen_decision: "INCLUDE (Legacy)",
        screen_reason: "Theoretical Anchor"
    }));
    
    console.log(JSON.stringify(entries, null, 2));
} catch (e) {
    console.error("Error parsing JS: " + e.message);
    process.exit(1);
}
