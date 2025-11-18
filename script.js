// Quiz data: 10 questions (A-F per option)
const QUESTIONS = [
    {q: 'Your ideal morning vibe is:', a: ['Deep political thoughts before breakfast','Efficient scan of global news','Market charts and business signals','Ethical coffee + long article','Outrage with your toast', 'Tea getting cold, engrossed in latin verses']},
    {q: 'Pick a drink:', a : ['Single origin filter coffee','Espresso','Flat white from designer mug','Organic tea (Ethically Sourced)','Anything strong, I have complaints','Austere black tea in a chipped mug']},
    {q: 'Your favourite social media app is:', a: ['Twitter, but only for the essays', 'LinkedIn, bullet points signall efficiency', 'Bloomberg Terminal, masquerading as social media', 'Instagram stories to promote causes and fact-check', 'Facebook, where outrage breathes freely', 'The Notes app—your true publication venue']},
    {q: 'Which sentence offends you the most?', a: ['Politics is just vibes', "Numbers don't matter","The markets will barely notice", 'Maybe both sides have a point', 'Everything seems absolutely fine today', 'Could you keep it to 500 words?'] },
    {q: 'On a plane you read:', a: ['A thinkpiece titled "Britain’s Crisis of Confidence"', 'A special report on supply chains', 'The weekend edition, folded with precision', 'A paperback on late-stage capitalism', 'A headline predicting imminent societal collapse', 'A 9,000-word review of a book you didn’t pack.']},
    {q: 'Ideal holiday?', a: ['A grey city where they have great museums', 'A conference in the Alps', 'Tuscan villa with WiFi reliable enough for Bloomberg', 'A sustainable retreat with organic brunch', 'Nothing beats a ...', 'Obscure monastery residency']},
    {q: 'Your type of crisis?', a: ['Democracy is fragile','The global economy is wobbling','Markets are nervous','Climate + housing + inequality','Society is collapsing because everything is terrible', 'Discovering the archive is closed for renovations']},
    {q: 'What does your ideal home look like?', a: ['Books everywhere','Airport lounge minimalism','Sleek and expensive','Plants and posters','Too many headlines open', 'Comfortable armchair and bookstore merchandise']},
    {q: 'What do you secretly judge people for?', a: ['Ignoring history','Not understanding economics','Not budgeting','Not recycling','Everything', 'Not reading'] },
    {q: 'Your friends, behind your back describe you as:', a: ['Endlessly earnest, chronically overthinking, charmingly doomed', 'Analytical, emotionally unavailable, weirdly confident', 'Expensive tastes disguised as pragmatism', 'Well-meaning, anxious, aggressively tote-bagged.', 'Perpetually outraged but lovely to neighbours.', 'Brilliant, unreadable, and slightly insufferable.']}
  ];
  
  
  // Map letter indices to publications
  const PUBS = ['New Statesman','The Economist','Financial Times','The Guardian','Daily Mail', 'The London Review of Books'];
  
  // DOM references
  const questionArea = document.getElementById('question-area');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progress-bar');
  const resultBox = document.getElementById('result');
  
  let currentIndex = 0;
  let answers = Array(QUESTIONS.length).fill(null); // stores 0-5
  
  function renderQuestion(i){
    const data = QUESTIONS[i];
    questionArea.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'question';
  
    const title = document.createElement('h3');
    title.className = 'q-title';
    title.textContent = `Q${i+1}. ${data.q}`;
    wrapper.appendChild(title);
  
    const opts = document.createElement('div');
    opts.className = 'options';
  
    data.a.forEach((optText, idx) => {
      const opt = document.createElement('div');
      opt.className = 'option';
      opt.textContent = optText;
      opt.dataset.choice = idx; // 0..5
      if(answers[i] === idx) opt.classList.add('selected');
      opt.addEventListener('click', () => {
        answers[i] = idx;
        // reflect selection
        opts.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
        // enable next
        nextBtn.disabled = false;
      });
      opts.appendChild(opt);
    });
  
    wrapper.appendChild(opts);
    questionArea.appendChild(wrapper);
  
    // update nav buttons & progress
    prevBtn.disabled = i === 0;
    nextBtn.textContent = (i === QUESTIONS.length -1) ? 'See result →' : 'Next →';
    updateProgress();
    // disable next if not answered
    nextBtn.disabled = answers[i] === null;
  }
  
  function updateProgress(){
    const pct = Math.round(((currentIndex)/QUESTIONS.length) * 100);
    progressBar.style.width = pct + '%';
  }
  
  prevBtn.addEventListener('click', () => {
    if(currentIndex > 0) currentIndex--;
    renderQuestion(currentIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    if(answers[currentIndex] === null) return;
    if(currentIndex < QUESTIONS.length -1){
      currentIndex++;
      renderQuestion(currentIndex);
    } else {
      showResult();
    }
  });
  
  function showResult(){
    const counts = {0:0,1:0,2:0,3:0,4:0,5:0};
    answers.forEach(a => { if(a !== null) counts[a] = (counts[a]||0) + 1; });
    const best = Object.keys(counts).reduce((a,b)=> counts[a]>=counts[b]?a:b);
    const pub = PUBS[best];
  
    const descriptions = {
        'New Statesman': 'You oscillate between moral superiority and existential despair, buy books on inequality you never finish, and forward screenshots of essays labelled “worth your time.” You long for a Scandinavian-style national mission and secretly wish politics were more romantic. You see politics as a long conversation.',
        'The Economist': 'You believe every human tragedy can be resolved with a chart, think in GDP per capita, and spend weekends drafting policy memos in your Notes app. You describe countries as “promising” or “troubling” with alarming confidence and possess a humour dryer than most deserts. Charts make you happy.',
        'Financial Times': 'You explain bond yields more easily than emotions, and treat Porsche dealerships as escapist fantasy. Irreversibly bourgeois yet terrified of seeming so, you always act as if you were the "adult in the room" about money matters.',
        'The Guardian': 'You are fuelled by guilt—ethical, political, and dietary—and cycle everywhere except when it rains, which is always. Your tote bag contains a novel by an author whose name you mispronounce elegantly, you believe earnest debate can fix anything, and your greatest dread is being mistaken for a centrist.',
        'Daily Mail': 'You wake up offended, subsist on fury and biscuits, and believe civilisation is always one headline from collapse. You sometimes prefer simple stories to nuance and treat celebrity gossip as national security matter. Somehow, you remain inexplicably cheerful about your garden.',
        'London Review of Books': 'You devour 10,000-word essays on medieval agriculture, are perpetually “between books”, which means you are reading at least six simultaneously. Your flat is full of pastel coloured teatowells and strangely unsettling posters. Literary criticisim is a competetive sport for you. Once a year you buy a cookbook and proceed to never cook from it.',
    };
  
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
  
    const breakdown = document.createElement('p');
    breakdown.className = 'small';
    breakdown.textContent = 'Answer breakdown: ' + JSON.stringify(answers.map(x => x===null?null: ['NS','Econ','FT','Guardian','Mail', 'LRB'][x]));
    card.appendChild(breakdown);
  
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
    tweetBtn.textContent = 'Substack';
    tweetBtn.href = `https://booooks.substack.com`;
    tweetBtn.target = '_blank';
    shareRow.appendChild(tweetBtn);
  
    card.appendChild(shareRow);
    resultBox.appendChild(card);
    resultBox.classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');

  
        // Newspaper link + About section
    const extraRow = document.createElement('div');
    extraRow.className = 'extra-row';


    const links = {
'New Statesman': 'https://www.newstatesman.com',
'The Economist': 'https://www.economist.com',
'Financial Times': 'https://www.ft.com',
'The Guardian': 'https://www.theguardian.com',
'The Times': 'https://www.thetimes.co.uk',
'Daily Mail': 'https://www.dailymail.co.uk'
    };


    const siteLink = document.createElement('a');
    siteLink.className = 'btn';
    siteLink.textContent = 'Visit the newspaper website';
    siteLink.href = links[pub];
    siteLink.target = '_blank';


    const aboutBtn = document.createElement('a');
    aboutBtn.className = 'btn';
    aboutBtn.textContent = 'About this quiz';
    aboutBtn.href = 'https://your-substack-or-about-link.com';
    aboutBtn.target = '_blank';


    extraRow.appendChild(siteLink);
    extraRow.appendChild(aboutBtn);
    card.appendChild(extraRow);
    resultBox.appendChild(card);
    resultBox.classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');

}
// initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => renderQuestion(0));
  