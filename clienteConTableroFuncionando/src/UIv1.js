import { UI_BUILDER } from "./Ui.js";

export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board, players) => {
   
    // for (var i = players.length - 1; i >= 0; i--) {
    //     var j = Math.floor(Math.random() * (i + 1));
    //     var temp = players[i];
    //     players[i] = players[j];
    //     players[j] = temp;
    // }       
    
    console.log(board);
    if (board !== undefined) {

        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        board.forEach(column => column.forEach((row) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (row === 5) {
                tile.style.backgroundColor = 'green';
                tile.dataset.element = 'bush';
            }
    column[row] = tile;
        base.appendChild(tile);
        
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
        console.log(board);
    }

}



UIv1.drawBoard();

