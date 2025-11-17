// Quiz data: 10 questions (A-F per option)
function showResult(){
    // tally answers
    const counts = {0:0,1:0,2:0,3:0,4:0,5:0};
    answers.forEach(a => { if(a !== null) counts[a] = (counts[a]||0) + 1; });
    // find max
    const best = Object.keys(counts).reduce((a,b)=> counts[a]>=counts[b]?a:b);
    const pub = PUBS[best];
    
    
    // friendly messages (short 5-sentence variants)
    const descriptions = {
    'New Statesman': 'A bookish, left-leaning thinker who loves long arguments about society. You care about ideas and cultural change. You enjoy serious essays and moral conviction. You are opinionated in a thoughtful way. You see politics as a long conversation.',
    'The Economist': 'A global, analytical mind that loves data and efficient explanations. You prefer big-picture logic to outrage. You value clarity and pragmatic solutions. You are curious about systems and incentives. Charts make you happy.',
    'Financial Times': 'Serious, financially minded, and practical. You follow markets and care about incentives. You value professionalism and stability. You prefer crisp analysis to drama. You are the "adult in the room" about money matters.',
    'The Guardian': 'Ethical, creative, and socially minded. You care about fairness and culture. You like long features and care deeply about climate and social issues. You believe activism and empathy can help. You are idealistic but practical.',
    'The Times': 'A calm, sensible consumer of news who prefers steady reporting. You value order, tradition, and competence. You like clear reporting and reliable sources. You prefer quiet competence over loud spectacle. You are a grown-up about politics.',
    'Daily Mail': 'A dramatic, emotional instinct: you love scandal and punchy headlines. You enjoy outrage, clear villains, and strong takes. You like stories that provoke a feeling. You sometimes prefer simple stories to nuance. You are passionate and vivid.'
    };
    
    
    // render result
    resultBox.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card';
    
    
    const title = document.createElement('h2');
    title.className = 'result-title';
    title.textContent = `You are... ${pub}`;
    card.appendChild(title);
    
    
    const body = document.createElement('p');
    body.className = 'result-body';
    body.textContent = descriptions[pub];
    card.appendChild(body);
    
    
    // raw breakdown
    const breakdown = document.createElement('p');
    breakdown.className = 'small';
    breakdown.textContent = 'Answer breakdown: ' + JSON.stringify(answers.map(x => x===null?null: ['NS','Econ','FT','Guardian','Times','Mail'][x]));
    card.appendChild(breakdown);
    
    
    // share / export
    const shareRow = document.createElement('div');
    shareRow.className = 'share-row';
    
    
    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn';
    shareBtn.textContent = 'Copy result text';
    shareBtn.addEventListener('click', () => {
    const text = `I got ${pub} on the \"Which Newspaper Are You?\" quiz!`;
    navigator.clipboard.writeText(text).then(()=>{
    shareBtn.textContent = 'Copied!';
    setTimeout(()=> shareBtn.textContent = 'Copy result text',1500);
    });
    });
    shareRow.appendChild(shareBtn);
    
    
    const tweetBtn = document.createElement('a');
    tweetBtn.className = 'btn';
    tweetBtn.textContent = 'Share on X';
    tweetBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent('I got '+pub+' on this fun quiz!')}`;
    tweetBtn.target = '_blank';
    shareRow.appendChild(tweetBtn);
    
    
    card.appendChild(shareRow);
    
    
    resultBox.appendChild(card);
    resultBox.classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');
    
    
    // send to Google Sheet (replace endpoint in script.js before deploying)
    try{ sendResultToSheet(pub, answers); } catch(e){ console.warn('Data not sent', e); }
    }
    
    
    // Data submission: replace with your Web App URL from Google Apps Script
    const GOOGLE_ENDPOINT = 'REPLACE_WITH_YOUR_GOOGLE_SCRIPT_URL';
    
    
    function sendResultToSheet(finalResult, answersArray){
    const payload = {
    timestamp: new Date().toISOString(),
    result: finalResult,
    answers: answersArray
    };
    // use no-cors mode — the Apps Script accepts the POST and appends to sheet
    fetch(GOOGLE_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
    }).catch(e => console.warn('Send failed (this may be fine if no-cors):', e));
    }
    
    
    // initialize
    renderQuestion(0);