document.addEventListener('DOMContentLoaded', () => {
    const teamAInput = document.getElementById('teamAInput');
    const teamBInput = document.getElementById('teamBInput');
    const oversInput = document.getElementById('oversInput');
    const startBtn = document.getElementById('startMatchBtn');
    const resetBtn = document.getElementById('resetMatchBtn');
    const autoOverBtn = document.getElementById('autoOverBtn');
    const commentaryLog = document.getElementById('commentaryLog');

    const battingTeamEl = document.getElementById('battingTeam');
    const bowlingTeamEl = document.getElementById('bowlingTeam');
    const battingScoreEl = document.getElementById('battingScore');
    const bowlingScoreEl = document.getElementById('bowlingScore');
    const battingOversEl = document.getElementById('battingOvers');
    const requiredRateEl = document.getElementById('requiredRate');

    const shotButtons = Array.from(document.querySelectorAll('[data-shot]'));

    const outcomes = {
        defensive: [0, 0, 1, 1, 2, 'W'],
        balanced: [0, 1, 1, 2, 3, 4, 'W'],
        aggressive: [0, 1, 2, 4, 6, 6, 'W', 'W']
    };

    let match = null;
    let autoInterval = null;

    const initMatch = () => {
        const teamAName = teamAInput.value.trim() || 'Team A';
        const teamBName = teamBInput.value.trim() || 'Team B';
        const oversLimit = parseInt(oversInput.value, 10) || 20;

        match = {
            teams: [
                { name: teamAName, score: 0, wickets: 0, overs: 0, balls: 0 },
                { name: teamBName, score: 0, wickets: 0, overs: 0, balls: 0 }
            ],
            oversLimit,
            innings: 1,
            battingIndex: 0,
            bowlingIndex: 1,
            target: null,
            isComplete: false
        };

        const tossWinner = Math.random() > 0.5 ? 0 : 1;
        const tossChoice = Math.random() > 0.5 ? 'bat' : 'bowl';
        if (tossChoice === 'bat') {
            match.battingIndex = tossWinner;
            match.bowlingIndex = tossWinner === 0 ? 1 : 0;
        } else {
            match.bowlingIndex = tossWinner;
            match.battingIndex = tossWinner === 0 ? 1 : 0;
        }

        commentaryLog.innerHTML = '';
        addCommentary(`${match.teams[tossWinner].name} won the toss and chose to ${tossChoice}.`);
        updateScoreboard();
        enableControls(true);
    };

    const resetMatch = () => {
        match = null;
        commentaryLog.innerHTML = '<p class="commentary-item">Click "Start Match" to begin.</p>';
        battingTeamEl.textContent = '-';
        bowlingTeamEl.textContent = '-';
        battingScoreEl.textContent = '0/0';
        bowlingScoreEl.textContent = 'Target: -';
        battingOversEl.textContent = '0.0 overs';
        requiredRateEl.textContent = 'Required RR: -';
        enableControls(false);
        stopAuto();
    };

    const enableControls = (isEnabled) => {
        shotButtons.forEach(btn => {
            btn.disabled = !isEnabled;
        });
        autoOverBtn.disabled = !isEnabled;
    };

    const addCommentary = (text) => {
        const item = document.createElement('p');
        item.className = 'commentary-item';
        item.textContent = text;
        commentaryLog.prepend(item);
    };

    const formatOvers = (team) => `${team.overs}.${team.balls}`;

    const updateScoreboard = () => {
        if (!match) return;
        const batting = match.teams[match.battingIndex];
        const bowling = match.teams[match.bowlingIndex];

        battingTeamEl.textContent = batting.name;
        bowlingTeamEl.textContent = bowling.name;
        battingScoreEl.textContent = `${batting.score}/${batting.wickets}`;
        battingOversEl.textContent = `${formatOvers(batting)} overs`;

        if (match.target) {
            bowlingScoreEl.textContent = `Target: ${match.target}`;
            const ballsLeft = match.oversLimit * 6 - (batting.overs * 6 + batting.balls);
            const runsNeeded = Math.max(match.target - batting.score, 0);
            const requiredRR = ballsLeft > 0 ? (runsNeeded / (ballsLeft / 6)).toFixed(2) : '0.00';
            requiredRateEl.textContent = `Required RR: ${requiredRR}`;
        } else {
            bowlingScoreEl.textContent = 'Target: -';
            requiredRateEl.textContent = 'Required RR: -';
        }
    };

    const nextBall = (shotType) => {
        if (!match || match.isComplete) return;
        const batting = match.teams[match.battingIndex];
        const bowling = match.teams[match.bowlingIndex];

        const outcome = outcomes[shotType][Math.floor(Math.random() * outcomes[shotType].length)];

        if (outcome === 'W') {
            batting.wickets += 1;
            addCommentary(`Wicket! ${batting.name} now ${batting.score}/${batting.wickets}.`);
        } else {
            batting.score += outcome;
            addCommentary(`${outcome} run(s). ${batting.name} ${batting.score}/${batting.wickets}.`);
        }

        batting.balls += 1;
        if (batting.balls === 6) {
            batting.overs += 1;
            batting.balls = 0;
            addCommentary(`Over completed. ${batting.name} ${batting.score}/${batting.wickets}.`);
        }

        if (match.target && batting.score >= match.target) {
            addCommentary(`${batting.name} chased the target!`);
            match.isComplete = true;
            stopAuto();
        }

        if (!match.isComplete && (batting.overs === match.oversLimit || batting.wickets === 10)) {
            if (match.innings === 1) {
                match.innings = 2;
                match.target = batting.score + 1;
                addCommentary(`Innings break. Target set to ${match.target}.`);
                match.battingIndex = match.bowlingIndex;
                match.bowlingIndex = match.battingIndex === 0 ? 1 : 0;
            } else {
                match.isComplete = true;
                addCommentary(`${batting.name} completed the chase.`);
                stopAuto();
            }
        }

        if (match.isComplete) {
            showResult();
            enableControls(false);
        }

        updateScoreboard();
    };

    const showResult = () => {
        const teamA = match.teams[0];
        const teamB = match.teams[1];
        if (teamA.score > teamB.score) {
            addCommentary(`Result: ${teamA.name} win by ${teamA.score - teamB.score} runs.`);
        } else if (teamB.score > teamA.score) {
            addCommentary(`Result: ${teamB.name} win by ${10 - teamB.wickets} wickets.`);
        } else {
            addCommentary('Result: Match tied!');
        }
    };

    const startAuto = () => {
        if (autoInterval || !match) return;
        autoInterval = setInterval(() => nextBall('balanced'), 800);
    };

    const stopAuto = () => {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    };

    const toggleAutoOver = () => {
        if (!match || match.isComplete) return;
        if (autoInterval) {
            stopAuto();
            autoOverBtn.textContent = 'Auto Play Over';
        } else {
            startAuto();
            autoOverBtn.textContent = 'Stop Auto';
        }
    };

    shotButtons.forEach(btn => {
        btn.addEventListener('click', () => nextBall(btn.dataset.shot));
    });

    document.addEventListener('keydown', (event) => {
        if (!match || match.isComplete) return;
        if (event.key === '1') nextBall('defensive');
        if (event.key === '2') nextBall('balanced');
        if (event.key === '3') nextBall('aggressive');
    });

    startBtn.addEventListener('click', initMatch);
    resetBtn.addEventListener('click', resetMatch);
    autoOverBtn.addEventListener('click', toggleAutoOver);

    resetMatch();
});
