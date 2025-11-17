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