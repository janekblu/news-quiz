// Quiz data: 10 questions (A-F per option)
const QUESTIONS = [
    { q: 'Your ideal morning vibe is:', a: ['Deep political thoughts before breakfast','Efficient scan of global news','Market charts and business signals','Ethical coffee + long article','Calm, grown-up reporting','Outrage with your toast'] },
    { q: 'Which crisis feels most real to you?', a: ['Democracy is fragile','The global economy is wobbling','Markets are nervous','Climate + housing + inequality','Government competence','Society is collapsing because everything is terrible'] },
    { q: 'Pick a drink:', a: ['Black filter coffee','Airport cold brew','Flat white','Organic tea','Earl Grey','Anything strong, I have complaints'] },
    { q: 'What’s your preferred type of drama?', a: ['Ideological disputes','Geopolitical tensions','Financial volatility','Social-justice arguments','Quiet political infighting','Celebrity scandal + weather panic'] },
    { q: 'What motivates you intellectually?', a: ['Big ideas','Global systems','Money and incentives','Social fairness','Stability and order','Having strong opinions'] },
    { q: 'Your favourite headline tone:', a: ['“The Future of Society”','“The World in 2030”','“Markets React to…”','“How We Can Fix This”','“What Ministers Are Planning”','“SHOCKING NEW CRISIS”'] },
    { q: 'Pick a hobby:', a: ['Arguing about politics','Tracking global trends','Following markets','Writing opinions online','Listening to a news podcast','Being furious on social media'] },
    { q: 'Your ideal home looks like:', a: ['Books everywhere','Airport lounge minimalism','Sleek and expensive','Plants and posters','Traditional comfort','Too many headlines open'] },
    { q: 'What do you secretly judge people for?', a: ['Ignoring history','Not understanding economics','Not budgeting','Not recycling','Being disorganised','Everything'] },
    { q: 'Choose a political mood:', a: ['Left-ish intellectual','Centrist globalist','Market-friendly realist','Liberal activist','Moderate establishment','Angry conservative'] }
  ];
  
  // Map letter indices to publications
  const PUBS = ['New Statesman','The Economist','Financial Times','The Guardian','The Times','Daily Mail'];
  
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
      'New Statesman': 'A bookish, left-leaning thinker who loves long arguments about society. You care about ideas and cultural change. You enjoy serious essays and moral conviction. You are opinionated in a thoughtful way. You see politics as a long conversation.',
      'The Economist': 'A global, analytical mind that loves data and efficient explanations. You prefer big-picture logic to outrage. You value clarity and pragmatic solutions. You are curious about systems and incentives. Charts make you happy.',
      'Financial Times': 'Serious, financially minded, and practical. You follow markets and care about incentives. You value professionalism and stability. You prefer crisp analysis to drama. You are the "adult in the room" about money matters.',
      'The Guardian': 'Ethical, creative, and socially minded. You care about fairness and culture. You like long features and care deeply about climate and social issues. You believe activism and empathy can help. You are idealistic but practical.',
      'The Times': 'A calm, sensible consumer of news who prefers steady reporting. You value order, tradition, and competence. You like clear reporting and reliable sources. You prefer quiet competence over loud spectacle. You are a grown-up about politics.',
      'Daily Mail': 'A dramatic, emotional instinct: you love scandal and punchy headlines. You enjoy outrage, clear villains, and strong takes. You like stories that provoke a feeling. You sometimes prefer simple stories to nuance. You are passionate and vivid.'
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
    breakdown.textContent = 'Answer breakdown: ' + JSON.stringify(answers.map(x => x===null?null: ['NS','Econ','FT','Guardian','Times','Mail'][x]));
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
    tweetBtn.textContent = 'Share on X';
    tweetBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent('I got '+pub+' on this fun quiz!')}`;
    tweetBtn.target = '_blank';
    shareRow.appendChild(tweetBtn);
  
    card.appendChild(shareRow);
    resultBox.appendChild(card);
    resultBox.classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');
  }
  
  // initialize after DOM is ready
  document.addEventListener('DOMContentLoaded', () => renderQuestion(0));
  