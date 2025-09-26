/* ===== Game3.1 / app.js (fix) =====
   Ожидается HTML:
   <div id="board" class="board"></div>
   <div class="hud">
     <button id="newGame">Новая игра</button>
     <span id="moves">Ходы: 0</span>
     <button id="hintBtn">Подсказка</button>
   </div>
*/

(() => {
  const N = 4;
  const board = document.getElementById('board');
  const newGameBtn = document.getElementById('newGame');
  const movesEl = document.getElementById('moves');
  const hintBtn = document.getElementById('hintBtn');

  let state = goal();
  let moves = 0;

  function goal() {
    return [...Array(15).keys()].map(n => n + 1).concat(0);
  }

  function indexToRC(i){ return { r: Math.floor(i/N), c: i%N }; }
  function rcToIndex(r,c){ return r*N + c; }

  function isSolvable(a) {
    const tiles = a.filter(x => x !== 0);
    let inv = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j]) inv++;
      }
    }
    const blankIdx = a.indexOf(0);
    const blankRowFromTop = Math.floor(blankIdx / N);
    const blankRowFromBottom = N - blankRowFromTop;
    return ((inv + blankRowFromBottom) % 2) === 1;
  }

  function shuffleSolvable() {
    const a = goal();
    do {
      for (let i = a.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        [a[i], a[k]] = [a[k], a[i]];
      }
    } while (!isSolvable(a) || isTriviallySolved(a));
    return a;
  }

  function isTriviallySolved(a) {
    // чтобы не выдавать сразу собранную
    for (let i = 0; i < 16; i++) if (a[i] !== goal()[i]) return false;
    return true;
  }

  function canSwap(i,j){
    const A=indexToRC(i), B=indexToRC(j);
    return Math.abs(A.r-B.r)+Math.abs(A.c-B.c)===1;
  }

  function render(){
    board.innerHTML = '';
    state.forEach((n,i)=>{
      const {r,c} = indexToRC(i);
      const btn = document.createElement('button');
      btn.className = n===0 ? 'tile empty' : 'tile';
      btn.style.gridRow = (r+1);
      btn.style.gridColumn = (c+1);
      btn.dataset.i = i;
      btn.textContent = n===0 ? '' : n;
      btn.ariaLabel = n===0 ? 'Пустая' : `Плитка ${n}`;
      btn.addEventListener('click', onTileClick);
      board.appendChild(btn);
    });
    movesEl && (movesEl.textContent = `Ходы: ${moves}`);
  }

  function onTileClick(e){
    const i = Number(e.currentTarget.dataset.i);
    moveAt(i);
  }

  function moveAt(i){
    const blank = state.indexOf(0);
    if (!canSwap(i, blank)) return;
    [state[i], state[blank]] = [state[blank], state[i]];
    moves++;
    render();
    checkWin();
  }

  function checkWin(){
    for (let i=0;i<15;i++) if (state[i]!==i+1) return;
    if (state[15]!==0) return;
    board.classList.add('won');
    // alert(`Готово! Ходы: ${moves}`);
  }

  // Примитивная «подсказка»: подсветим любую плитку, которую можно толкнуть в пустоту
  function hint(){
    const blank = state.indexOf(0);
    const {r,c} = indexToRC(blank);
    const candidates = [
      [r-1,c],[r+1,c],[r,c-1],[r,c+1]
    ].filter(([rr,cc])=> rr>=0 && rr<N && cc>=0 && cc<N)
     .map(([rr,cc])=> rcToIndex(rr,cc));
    board.querySelectorAll('.tile').forEach(el=>el.classList.remove('hint'));
    candidates.forEach(i => {
      const el = board.querySelector(`.tile[data-i="${i}"]`);
      if (el) el.classList.add('hint');
    });
    // автоснятие подсветки
    setTimeout(()=>board.querySelectorAll('.hint').forEach(e=>e.classList.remove('hint')), 800);
  }

  // Стрелки с клавиатуры
  document.addEventListener('keydown', (e)=>{
    const blank = state.indexOf(0);
    const {r,c} = indexToRC(blank);
    let target = null;
    switch(e.key){
      case 'ArrowUp':    if (r < N-1) target = rcToIndex(r+1,c); break;
      case 'ArrowDown':  if (r > 0)   target = rcToIndex(r-1,c); break;
      case 'ArrowLeft':  if (c < N-1) target = rcToIndex(r,c+1); break;
      case 'ArrowRight': if (c > 0)   target = rcToIndex(r,c-1); break;
      default: return;
    }
    if (target!=null){ e.preventDefault(); moveAt(target); }
  });

  function newGame(){
    state = shuffleSolvable();
    moves = 0;
    board.classList.remove('won');
    render();
  }

  newGameBtn && newGameBtn.addEventListener('click', newGame);
  hintBtn && hintBtn.addEventListener('click', hint);

  // Старт
  render();
  newGame();
})();
