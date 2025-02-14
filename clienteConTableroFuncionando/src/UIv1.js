import { UI_BUILDER } from "./Ui.js";
import { Directions } from "./entities/Player.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";
export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.actionsList = {
    "MOVING": (player) => UIv1.do_move(player),
    "ATTACKING": (player) => UIv1.do_attack(player),
    "ROTATING": (player) => UIv1.do_rotate(player)
};


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



    UIv1.playerButtons = (player, connect) => {
        console.log('my player' + player.id);
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);

        const attackButton = document.createElement('button');
        const swordIcon = document.createElement('img');
        swordIcon.src = 'assets/images/sword.png';
        attackButton.appendChild(swordIcon);

        const advanceButton = document.createElement('button');
        const moveIcon = document.createElement('img');
        moveIcon.src = 'assets/images/movement.png';
        advanceButton.appendChild(moveIcon);

        const rotateButton = document.createElement('button');
        const rotateIcon = document.createElement('img');
        rotateIcon.src = 'assets/images/rotate-right.png';
        rotateButton.appendChild(rotateIcon);


        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(attackButton);
        buttonContainer.appendChild(advanceButton);
        buttonContainer.appendChild(rotateButton);

        document.body.appendChild(buttonContainer);

        attackButton.addEventListener('click', () => {
            console.log('Attack button clicked');
            ConnectionHandler.enviarCosas(UIv1.mapPlayer(player, 'ATTACKING'));
        });
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
            // }
            ConnectionHandler.enviarCosas(UIv1.mapPlayer(player, "MOVING", x, y));
        });


        rotateButton.addEventListener('click', () => {
            console.log('Rotate button clicked');

            ConnectionHandler.enviarCosas(UIv1.mapPlayer(player, "ROTATING"));


        });
        // )
        ;


    }
    UIv1.do_rotate = (player) => {
        let playerImage = document.querySelector(`[data-element="${player.id}"] img`);
        playerImage.style.transform = UIv1.setImageRotation(player, playerImage);

        console.log(`Player direction: ${player.direction}`);
    }

    UIv1.do_attack = (player) => {
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);
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

        player.status = 'ATTACKING';
        setTimeout(() => {
            player.status = 'idle';
            UIv1.updatePlayerStatus(player);
        }, 100);
    }
    UIv1.do_action = (player, message) => {
        UIv1.actionsList[message](player);
    }

    UIv1.updatePlayerStatus = (player) => {
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);
        if (playerTile) {
            playerTile.dataset.status = player.status;
        }
    }



    UIv1.do_move = (player) => {
        console.log("Moving player");
        console.log(player);
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);
        playerTile.innerHTML = '';
        playerTile.dataset.element = '';
        playerTile.dataset.ocuppied = false;
        playerTile = board[player.x][player.y];
        const playerImage = document.createElement('img');
        playerImage.src = `assets/images/player.png`;

        playerTile.dataset.element = player.id;
        playerTile.dataset.ocuppied = true;
        playerTile.appendChild(playerImage);
        UIv1.setImageRotation(player);


    }

    UIv1.setImageRotation = (player) => {
        console.log('Setting image rotation');
        console.log(player.direction);
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);
        console.log(playerTile);
        switch (player.direction) {
            case Directions.Up:
                playerTile.querySelector('img').style.transform = `rotate(270deg)`;
                break;
            case Directions.Right:
                playerTile.querySelector('img').style.transform = `rotate(0deg)`;
                break;
            case Directions.Down:
                playerTile.querySelector('img').style.transform = `rotate(90deg)`;
                break;
            case Directions.Left:
                playerTile.querySelector('img').style.transform = `rotate(180deg)`;
                break;
        }


    }

    UIv1.mapPlayer = (player, message, x, y) => {
        let playerTile = document.querySelector(`[data-element="${player.id}"]`);
        let payload = player;


        if (message === 'ATTACKING') {
            payload.state = 'ATTACKING';
        }
        if (message === 'MOVING') {
            payload.x = x;
            payload.y = y;
        }
        if (message === 'ROTATING') {
            switch (player.direction) {
                case Directions.Up:
                    payload.direction = Directions.Right;
                    break;
                case Directions.Right:
                    payload.direction = Directions.Down;
                    break;
                case Directions.Down:
                    payload.direction = Directions.Left;
                    break;
                case Directions.Left:
                    payload.direction = Directions.Up;
                    break;
            }
        }
        console.log(payload);
        return {
            action: message,
            player: {
                id: payload.id,
                x: payload.x,
                y: payload.y,
                state: payload.state,
                direction: payload.direction,
                visibility: payload.visibility
            }
        }
    }
}
UIv1.drawBoard();

