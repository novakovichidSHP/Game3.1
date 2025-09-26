/* Game3.1 / app.js — фиксированная решаемая стартовая позиция, без рандома */
(() => {
  const N = 4;
  const START = [1,2,3,4, 5,6,7,8, 9,10,12,15, 13,14,0,11];

  const board = document.getElementById('board')
             || document.querySelector('.board')
             || document.querySelector('.game');
  if (!board) { console.error('Не найден контейнер поля (#board/.board/.game)'); return; }

  let state = START.slice();
  let won = false;

  const idx2rc = i => ({ r: Math.floor(i / N), c: i % N });
  const rc2idx = (r, c) => r * N + c;
  const isAdj = (i, j) => {
    const A = idx2rc(i), B = idx2rc(j);
    return Math.abs(A.r - B.r) + Math.abs(A.c - B.c) === 1;
  };

  function render() {
    board.innerHTML = '';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    board.style.gridTemplateRows    = `repeat(${N}, 1fr)`;
    state.forEach((n, i) => {
      const { r, c } = idx2rc(i);
      const el = document.createElement('button');
      el.className = n === 0 ? 'tile empty' : 'tile';
      el.style.gridRow = String(r + 1);
      el.style.gridColumn = String(c + 1);
      el.dataset.i = i;
      el.textContent = n === 0 ? '' : String(n);
      el.addEventListener('click', () => tryMove(i));
      board.appendChild(el);
    });
  }

  function tryMove(i) {
    if (won) return;
    const blank = state.indexOf(0);
    if (!isAdj(i, blank)) return;
    [state[i], state[blank]] = [state[blank], state[i]];
    render();
    checkWin();
  }

  function checkWin() {
    for (let i = 0; i < 15; i++) if (state[i] !== i + 1) return;
    if (state[15] !== 0) return;
    won = true;
    board.classList.add('won');
  }

  document.addEventListener('keydown', (e) => {
    const blank = state.indexOf(0);
    const { r, c } = idx2rc(blank);
    let target = null;
    switch (e.key) {
      case 'ArrowUp':    if (r < N - 1) target = rc2idx(r + 1, c); break;
      case 'ArrowDown':  if (r > 0)     target = rc2idx(r - 1, c); break;
      case 'ArrowLeft':  if (c < N - 1) target = rc2idx(r, c + 1); break;
      case 'ArrowRight': if (c > 0)     target = rc2idx(r, c - 1); break;
      default: return;
    }
    if (target != null) { e.preventDefault(); tryMove(target); }
  });

  render();
})();
