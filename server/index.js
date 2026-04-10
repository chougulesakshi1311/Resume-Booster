const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Comprehensive dictionary mapping weak verbs to strong, professional action verbs
const verbMap = {
    'did': ['Executed', 'Performed', 'Conducted'],
    'made': ['Developed', 'Engineered', 'Constructed', 'Architected'],
    'worked on': ['Spearheaded', 'Managed', 'Directed', 'Orchestrated'],
    'helped': ['Facilitated', 'Collaborated on', 'Supported', 'Assisted in'],
    'fixed': ['Resolved', 'Troubleshot', 'Remedied', 'Reconciled'],
    'changed': ['Redesigned', 'Overhauled', 'Transformed', 'Revamped'],
    'got': ['Achieved', 'Secured', 'Attained', 'Acquired'],
    'led': ['Orchestrated', 'Piloted', 'Directed', 'Guided'],
    'set up': ['Established', 'Implemented', 'Deployed', 'Instituted'],
    'created': ['Designed', 'Forged', 'Formulated', 'Conceptualized'],
    'used': ['Leveraged', 'Utilized', 'Harnessed', 'Applied'],
    'improved': ['Optimized', 'Enhanced', 'Elevated', 'Maximized'],
    'handled': ['Coordinated', 'Administered', 'Managed', 'Processed'],
    'started': ['Initiated', 'Launched', 'Pioneered', 'Founded'],
    'ran': ['Operated', 'Supervised', 'Oversaw', 'Executed'],
    'built': ['Engineered', 'Constructed', 'Developed', 'Assembled'],
    'wrote': ['Authored', 'Drafted', 'Composed', 'Documented']
};

// Array of professional outcomes/metrics to append if the user didn't provide numbers
const businessOutcomes = [
    ", resulting in a [X]% increase in overall efficiency.",
    ", driving a [X]% improvement in system performance.",
    ", reducing operational overhead/costs by $[Y].",
    ", successfully delivering the initiative [X] weeks ahead of schedule.",
    ", boosting user engagement/retention by [X]%.",
    ", outperforming target goals by [X]%.",
    ", streamlining the process and saving [X] hours per week."
];

function boostSentence(sentence) {
    let lowerSent = sentence.trim().toLowerCase();
    
    // Strip common non-professional prefixes 
    lowerSent = lowerSent.replace(/^i /g, '');
    lowerSent = lowerSent.replace(/^i have /g, '');
    lowerSent = lowerSent.replace(/^i had /g, '');
    lowerSent = lowerSent.replace(/^i was /g, '');
    lowerSent = lowerSent.replace(/^my job was to /g, '');
    lowerSent = lowerSent.replace(/^responsible for /g, '');
    
    let words = lowerSent.split(' ');
    let firstWord = words[0];
    let secondWord = words.length > 1 ? words[1] : '';
    
    let replacementVerb = null;
    let wordsToRemove = 1;
    
    // 1. Check for two-word weak verbs (e.g., "worked on", "set up")
    let twoWordVerb = firstWord + ' ' + secondWord;
    if (verbMap[twoWordVerb]) {
        let options = verbMap[twoWordVerb];
        replacementVerb = options[Math.floor(Math.random() * options.length)];
        wordsToRemove = 2;
    } 
    // 2. Check for single-word weak verbs
    else if (verbMap[firstWord]) {
         let options = verbMap[firstWord];
         replacementVerb = options[Math.floor(Math.random() * options.length)];
         wordsToRemove = 1;
    } else {
         // 3. Fallback: Just capitalize their existing first word
         replacementVerb = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    }
    
    // Replace the weak verb in the array
    if (replacementVerb !== firstWord) {
         words.splice(0, wordsToRemove);
         words.unshift(replacementVerb);
    } else {
         words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    
    let result = words.join(' ');
    
    // Fix common punctuation if present before appending
    result = result.replace(/\.$/, ''); 
    
    // 4. Check for metrics: A strong resume bullet needs numbers.
    const hasNumbers = /\d/.test(result);
    if (!hasNumbers) {
        // Append a random, professional business outcome
        const randomOutcome = businessOutcomes[Math.floor(Math.random() * businessOutcomes.length)];
        result += randomOutcome;
    } else {
        result += '.';
    }
    
    return result;
}

app.post('/api/boost', (req, res) => {
    const { sentence } = req.body;

    if (!sentence) {
        return res.status(400).json({ error: 'Sentence is required' });
    }

    try {
        const boostedText = boostSentence(sentence);
        
        // Simulating a slight delay to feel like "AI processing" for UX polish
        setTimeout(() => {
            res.json({ boosted: boostedText });
        }, 600);
        
    } catch (error) {
        console.error('Error processing rules:', error);
        res.status(500).json({ error: 'System error. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port} (Rule-Based Mode)`);
});
