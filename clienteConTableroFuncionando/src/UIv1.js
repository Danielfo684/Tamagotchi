import { UI_BUILDER } from "./Ui.js";
import { Directions } from "./entities/Player.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";
export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}




UIv1.drawBoard = (board, players) => {


    if (board !== undefined) {

        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 20px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 20px)`;


        board = board.map(column => column.map((row) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (row === 5) {
                tile.style.backgroundColor = 'green';
                tile.dataset.element = 'bush';
            }
            base.appendChild(tile);

            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
            return tile;
        }));

        console.log(board);
        console.log(players);
        players.forEach(player => {
            const playerTile = board[player.x][player.y];
            const playerImage = document.createElement('img');
            playerImage.src = `assets/images/player.png`;
            playerTile.appendChild(playerImage);
            playerTile.dataset.element = player.id;
        })



    }

    UIv1.movePlayer = (player) => {
        console.log("Moving player");
        console.log(player);
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);
        playerTile.innerHTML = '';
        playerTile.dataset.element = '';
        playerTile.dataset.ocuppied = false;
        playerTile = board[player.x][player.y];
        const playerImage = document.createElement('img');
        playerImage.src = `assets/images/player.png`;
        playerImage.style.transform = UIv1.setImageRotation(player.direction);
        playerTile.dataset.element = player.id;
        playerTile.dataset.ocuppied = true;
        playerTile.appendChild(playerImage);
    }

    UIv1.playerButtons = (player, connect) => {
        console.log('my player' + player.id);
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);

        const attackButton = document.createElement('button');
        const swordIcon = document.createElement('img');
        swordIcon.src = 'assets/images/sword.png';
        attackButton.appendChild(swordIcon);

        attackButton.addEventListener('click', () => {
            let playerTile = document.querySelector(`[data-element="${player.id}"]`);

            console.log('Attack button clicked');
            let x = player.x;
            let y = player.y;
            switch (player.direction) {
                case Directions.Up:
                    --x;
                case Directions.Right:
                    ++y;
                    break;
                case Directions.Down:
                    ++x;
                    break;
                case Directions.Left:
                    --y;
                    break;
            }
            anime({
                targets: playerTile.querySelector('img'),
                translateX: [0, 50],
                duration: 300,
                easing: 'easeInOutQuad'
            });
            anime({
                targets: playerTile.querySelector('img'),
                translateX: [50, 0],
                duration: 300,
                easing: 'easeInOutQuad'
            });

            player.status = 'attacking';
            setTimeout(() => {
                player.status = 'idle';
            }, 100);
            ConnectionHandler.enviarCosas(player);   
        });

        const advanceButton = document.createElement('button');
        const moveIcon = document.createElement('img');
        moveIcon.src = 'assets/images/movement.png';
        advanceButton.appendChild(moveIcon);

        advanceButton.addEventListener('click', () => {
            console.log('Movement button clicked');
            let x = player.x;
            let y = player.y;
            switch (player.direction) {
                case Directions.Up:

                    if (x > 0) --x;
                    break;
                case Directions.Right:
                    if (y < 9)
                        ++y;
                    break;
                case Directions.Down:
                    if (x < 9)

                        ++x;
                    break;
                case Directions.Left:
                    if (x >= 0)

                        --y;
                    break;
            }
            // if (board[x][y].dataset.ocuppied === 'true') {
            //     console.log('Tile is occupied');
            // } else {
                player.x = x;
                player.y = y;
                UIv1.movePlayer(player);
            // }
ConnectionHandler.enviarCosas(player);        });

        const rotateButton = document.createElement('button');
        const rotateIcon = document.createElement('img');
        rotateIcon.src = 'assets/images/rotate-right.png';
        rotateButton.appendChild(rotateIcon);
        rotateButton.addEventListener('click', () => {
            console.log(player.x);
            console.log(player.y);
            console.log('Rotate button clicked');
            let playerTile = document.querySelector(`[data-element="${player.id}"]`);
            console.log(playerTile);
            switch (player.direction) {
                case Directions.Up:
                    player.direction = Directions.Right;
                    playerTile.querySelector('img').style.transform = `rotate(0deg)`;
                    break;
                case Directions.Right:
                    player.direction = Directions.Down;
                    playerTile.querySelector('img').style.transform = `rotate(90deg)`;
                    break;
                case Directions.Down:
                    player.direction = Directions.Left;
                    playerTile.querySelector('img').style.transform = `rotate(180deg)`;
                    break;
                case Directions.Left:
                    player.direction = Directions.Up;
                    playerTile.querySelector('img').style.transform = `rotate(270deg)`;
                    break;
            }
            console.log(`Player direction: ${player.direction}`);
            ConnectionHandler.enviarCosas(player);   

        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(attackButton);
        buttonContainer.appendChild(advanceButton);
        buttonContainer.appendChild(rotateButton);

        document.body.appendChild(buttonContainer);
    }

    UIv1.setImageRotation = (direction) => {
        switch (direction) {
            case Directions.Up:
                return `rotate(270deg)`;
            case Directions.Right:
                return `rotate(0deg)`;
            case Directions.Down:
                return `rotate(90deg)`;
            case Directions.Left:
                return `rotate(180deg)`;
        }


    }

    UIv1.mapPlayer = (player) => {
        return {
            id: player.id.id,
            x: player.x,
            y: player.y,
            state: player.state,
            direction: player.direction,
            visibility: player.visibility
        }
    }
}
UIv1.drawBoard();

