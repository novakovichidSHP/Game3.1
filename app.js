//берем кнопку
let newGameButton = document.getElementById('game');

//флаг для определения очередности нажатия кнопки
let newButtonClicked = true;

//событие при клике на кнопку
newGameButton.onclick = start;

//счетчик шагов
let moveCounter = 0;
let gameTime = 0;

//срабатывает при нажатии на кнопку новой игры
function start() {
    let dif = 4;
    // let dif = document.querySelector('[name="game-difficulty"]:checked').value;
    if (newButtonClicked) {
        startGame(dif);
        field.style.display = "block";
        startResults();
        newButtonClicked = false; //меняется значение флага
        newGameButton.innerHTML = "Заново";
        //difficulty.style.display = "none";
        result.style.display = "block";
        //window.location.reload();
    } else {
        window.location.reload(); //перезагрузит страницу
    }
}

function startGame(dif) {
    //ищем field
    const field = document.querySelector('.field');

    //размер ячейки
    const cellSize = 100;
    //складываем инфу о ячейках в массив
    const cells = [];
    //создаем и сортируем массив с числами
    // const numbers = [...Array(dif * dif - 1).keys()].sort(() => Math.random() - 0.5);
    const numbers = [10, 8, 5, 1, 6, 0, 3, 7, 12, 9, 13, 14, 4, 11, 2]
    for (let i = 0; i <= dif * dif - 2; i++) {
        //создаем тег
        const cell = document.createElement('div');
        const value = numbers[i] + 1;
        cell.className = 'cell';
        //записываем в ячейку значение
        cell.innerHTML = value;

        //позиция в строке
        const left = i % dif;
        //позиция в столбце
        const top = (i - left) / dif;

        //записываем ячейку в массив
        cells.push({
            value: value,
            left: left,
            top: top,
            element: cell
        });

        //сдвигаем координаты
        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;

        //добавляем ячейку в поле field
        field.append(cell);

        //при обработчике события срабатывает функция
        cell.addEventListener('click', () => {
            move(i);
        })
    }

    //координаты пустой ячейки
    const empty = {
        value: dif * dif,
        top: dif - 1,
        left: dif - 1,
    }
    //заносим пустую ячейку в массив
    cells.push(empty);


    function move(index) {
        //достаем ячейку
        const cell = cells[index];

        //берем разницу по координате
        const leftDiff = Math.abs(empty.left - cell.left);
        const topDiff = Math.abs(empty.top - cell.top);

        //если разница больше одного, то ячейка не является соседней
        if (leftDiff + topDiff > 1) {
            return;
        }
        moveCounter++;
        //перемещаемся на прошлую ячейку
        cell.element.style.left = `${empty.left * cellSize}px`;
        cell.element.style.top = `${empty.top * cellSize}px`;

        //координаты пустой клетки
        const emptyLeft = empty.left;
        const emptyTop = empty.top;

        //записываем координаты текущей ячейки
        empty.left = cell.left;
        empty.top = cell.top;

        //в ячейку передаем записанные значения
        cell.left = emptyLeft;
        cell.top = emptyTop;

        //метод every проверяет условие для каждого элемента
        const isFinished = cells.every(cell => {
            //проверка на правильную координату
            return cell.value === cell.top * dif + cell.left + 1;
        });

        if (isFinished) {
            setTimeout(function(){
                alert('Вы прошли игру за '+ moveCounter + ' шагов');
                //window.location.reload();
            }, 500)
        }
    }

}

//результаты
function startResults() {
    const moveContainer = document.querySelector('.move-text');
    //const timeContainer = document.querySelector('.time-text');
    moveContainer.innerHTML = '' + moveCounter;
    // timeContainer.innerHTML = '' + gameTime;
    //обновляем контейнер шагов
    const movesUpdate = setInterval(
        () => {
            moveContainer.innerHTML = '' + moveCounter;
        },
        100);
    //обновляем контейнер времени
    // const gameInterval = setInterval(
    //     () => {
    //         timeContainer.innerHTML = '' + ++gameTime;
    //     },
    //     1000);
}

