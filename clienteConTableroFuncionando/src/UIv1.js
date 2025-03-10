import { UI_BUILDER } from "./Ui.js";
import { Directions } from "./entities/Player.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";
import { GameService } from "./services/GameService.js";
export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.actionsList = {
    "MOVING": (player) => UIv1.do_move(player),
    "ATTACKING": (player) => UIv1.do_attack(player),
    "ROTATING": (player) => UIv1.do_rotate(player),
    "DEFEATING": (player) => UIv1.do_defeatPlayer(player),
    "WINNING": () => UIv1.showVictory(),
};
UIv1.elementEffects = {
    "bush": (player) => {
        player.visibility = false;
    },
    "undefined": (player) => {
        player.visibility = true;
    }
}

UIv1.myPlayer = null;
UIv1.drawBoard = (board, players, myPlayer) => {

    UIv1.myPlayer = myPlayer;
    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';

        base.style.gridTemplateColumns = `repeat(${board.length}, 50px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 50px)`;

        console.log(board);
        board = board.map(column => column.map((row) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.ocuppied = false;
            if (row === 5) {
                tile.style.backgroundColor = 'green';
                tile.dataset.element = 'bush';
            }
            base.appendChild(tile);

            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 100) + 1000,
                easing: 'easeInOutQuad'
            });
            return tile;
        }));
        console.log(board);

        players.forEach(player => {
            const playerTile = board[player.x][player.y];
            const playerImage = document.createElement('img');
            playerImage.src = `assets/images/player.png`;

            playerTile.appendChild(playerImage);
            playerTile.dataset.ocuppied = true;
            if (player.id === UIv1.myPlayer.id) {
                playerTile.style.backgroundColor = '#d2d7df';
            }
        })

        const countDownTexts = ['3', '2', '1', 'YA!'];
        const startingCountDown = document.createElement('div');
        const countDownP = document.createElement('p');
        startingCountDown.classList.add('starting-countdown');
        startingCountDown.appendChild(countDownP);
        base.appendChild(startingCountDown);
        countDownP.innerText = countDownTexts[0];
        let contador = 1;
        const countDownInterval = setInterval(() => {
            countDownP.innerText = countDownTexts[contador];
            contador++;
            if (contador >= countDownTexts.length) {
                //!!!! clearInterval te permite parar intervalos
                clearInterval(countDownInterval);
                startingCountDown.style.opacity = 0;
                setTimeout(() => {
                    startingCountDown.remove();
                    document.getElementById('attack').disabled = false;
                    document.getElementById('rotate').disabled = false;
                    document.getElementById('advance').disabled = false;
                }, 1000);
            }
        }, 1000);

        ConnectionHandler.sendStartingBoard(board);

    }



    UIv1.playerButtons = (player, connect) => {
        let playerTile = board[player.x][player.y];

        const attackButton = document.createElement('button');
        attackButton.id = 'attack';
        const swordIcon = document.createElement('img');
        swordIcon.src = 'assets/images/sword.png';
        attackButton.appendChild(swordIcon);

        const advanceButton = document.createElement('button');
        advanceButton.id = 'advance';
        const moveIcon = document.createElement('img');
        moveIcon.src = 'assets/images/movement.png';
        advanceButton.appendChild(moveIcon);

        const rotateButton = document.createElement('button');
        rotateButton.id = 'rotate';
        const rotateIcon = document.createElement('img');
        rotateIcon.src = 'assets/images/rotate-right.png';
        rotateButton.appendChild(rotateIcon);


        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(attackButton);
        buttonContainer.appendChild(advanceButton);
        buttonContainer.appendChild(rotateButton);

        document.body.appendChild(buttonContainer);
        attackButton.disabled = true;
        rotateButton.disabled = true;
        advanceButton.disabled = true;

        advanceButton.addEventListener('click', () => {
            attackButton.disabled = true;
            rotateButton.disabled = true;
            advanceButton.disabled = true;
            setTimeout(() => {
                attackButton.disabled = false;
                rotateButton.disabled = false;
                advanceButton.disabled = false;
            }, 100);
            let x = player.x;
            let y = player.y;
            // switch (player.direction) {
            //     case Directions.Up:

            //         if (x > 0) --x;
            //         break;
            //     case Directions.Right:
            //         if (y < 9)
            //             ++y;
            //         break;
            //     case Directions.Down:
            //         if (x <= 8)

            //             ++x;
            //         break;
            //     case Directions.Left:
            //         if (y > 0)

            //             --y;
            //         break;
            // }
            // if (board[x][y].dataset.ocuppied === 'true') {
            //     console.log('Tile is occupied');
            // } else {
            player.x = x;
            player.y = y;
            // }
            ConnectionHandler.updatePlayer(UIv1.mapPlayer(player, "MOVING", x, y));
        });


        rotateButton.addEventListener('click', () => {
            attackButton.disabled = true;
            rotateButton.disabled = true;
            advanceButton.disabled = true;
            setTimeout(() => {
                attackButton.disabled = false;
                rotateButton.disabled = false;
                advanceButton.disabled = false;
            }, 100);

            ConnectionHandler.updatePlayer(UIv1.mapPlayer(player, "ROTATING"));


        });
        // )
        ;

        attackButton.addEventListener('click', () => {
            attackButton.disabled = true;
            rotateButton.disabled = true;
            advanceButton.disabled = true;
            setTimeout(() => {
                attackButton.disabled = false;
                rotateButton.disabled = false;
                advanceButton.disabled = false;
            }, 200);
            let playerTile = board[player.x][player.y];
            if (playerTile.dataset.element !== 'bush') {
                ConnectionHandler.updatePlayer(UIv1.mapPlayer(player, 'ATTACKING'));
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
            }
        });
    }
    UIv1.do_rotate = (player) => {

        let playerImage = board[player.x][player.y].querySelector('img');
        playerImage.style.transform = UIv1.setImageRotation(player, playerImage);
    }

    UIv1.do_attack = (player) => {
        console.log('do_attack');
        let playerTile = board[player.x][player.y];
        let x = player.x;
        let y = player.y;
        switch (player.direction) {
            case Directions.Up:
                --x;
                break;
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



    }
    UIv1.do_action = (player, message) => {
        UIv1.actionsList[message](player);
    }

    UIv1.do_defeatPlayer = (player) => {
        console.log(player.id);
        console.log(UIv1.myPlayer.id);

        let playerTile = board[player.x][player.y];

        if (playerTile) {
            playerTile.dataset.state = player.state;
        }
        if (player.state === 'DEFEATED') {

            playerTile.dataset.ocuppied = true;
            playerTile.innerHTML = '';

        }
        if (player.id === UIv1.myPlayer.id) {
            document.querySelectorAll('button').forEach(button => {
                button.disabled = true;
            });
        }
        console.log("player defeated");

        let playerImage = document.createElement('img');
        playerImage.src = `assets/images/dead.png`;
        playerImage.style.position = 'absolute';
        playerImage.style.width = '50px';
        playerImage.style.height = '50px';
        playerTile.appendChild(playerImage);


    }

    UIv1.checkElement = (player, board) => {
        let playerTile = board[player.x][player.y];
        UIv1.elementEffects[playerTile.dataset.element](player);
    }

    UIv1.checkAdjacentTile = (player, board) => {
        let playerTile = board[player.x][player.y];
        switch (player.direction) {
            case Directions.Up:
                if (player.x > 0) {
                    if (board[player.x - 1][player.y].dataset.ocuppied === 'true') {
                        return false;
                    }
                }
                break;
            case Directions.Right:
                if (player.y < 9) {
                    if (board[player.x][player.y + 1].dataset.ocuppied === 'true') {
                        return false;
                    }
                }
                break;
            case Directions.Down:
                if (player.x < 9) {
                    if (board[player.x + 1][player.y].dataset.ocuppied === 'true') {
                        return false;
                    }
                }
                break;
            case Directions.Left:
                if (player.y > 0) {
                    if (board[player.x][player.y - 1].dataset.ocuppied === 'true') {
                        return false;
                    }
                }
                break;
        }
        return true;
    }

    UIv1.do_move = (player) => {
        let previousTile;
        let playerTile = board[player.x][player.y];

        switch (player.direction) {
            case Directions.Up:
                previousTile = board[player.x + 1][player.y];
                break;
            case Directions.Right:
                previousTile = board[player.x][player.y - 1];
                break;
            case Directions.Down:
                previousTile = board[player.x - 1][player.y];
                break;
            case Directions.Left:
                previousTile = board[player.x][player.y + 1];
                break;
        }
        console.log(playerTile.dataset.ocuppied);
        if (playerTile.dataset.ocuppied === 'false') {
            previousTile.innerHTML = '';
            if (previousTile.dataset.element === 'bush') {
                previousTile.style.backgroundColor = 'green';
            }
            else {
                previousTile.style.backgroundColor = 'white';
            }
            previousTile.dataset.ocuppied = false;
            const playerImage = document.createElement('img');
            playerImage.src = `assets/images/player.png`;
            if (player.id === UIv1.myPlayer.id) {
                playerTile.style.backgroundColor = '#d2d7df';
            }
            playerTile.dataset.ocuppied = true;
            playerTile.appendChild(playerImage);
            UIv1.setImageRotation(player);
            UIv1.checkElement(player, board);
            if (player.visibility === false) {
                playerTile.querySelector('img').style.opacity = 0;
                if (player.id === UIv1.myPlayer.id) {
                    playerTile.querySelector('img').style.opacity = 0.2;

                }
            } else {
                playerTile.querySelector('img').style.opacity = 1;
            }
        }
        // else {
        //     switch (player.direction) {
        //         case Directions.Up:
        //             if (player.x > 0) ++player.x;
        //             break;
        //         case Directions.Right:
        //             if (player.y < 9) --player.y;
        //             break;
        //         case Directions.Down:
        //             if (player.x < 9) --player.x;
        //             break;
        //         case Directions.Left:
        //             ++player.y;
        //             break;
        //     }
        // }

    }

    UIv1.setImageRotation = (player) => {

        let playerTile = board[player.x][player.y]
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
        let payload = { ...player };
        if (message === 'DEFEATING') {
            payload.state = 'DEFEATED';
        }

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
    UIv1.showVictory = () => {
        const message = document.createElement('div');
        const boardDiv = document.getElementById('board');
        message.classList.add('victory-message');
        message.textContent = 'YOU WIN!';

        boardDiv.appendChild(message);
        document.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
       
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'New Game';
        newGameButton.addEventListener('click', () => {
            location.reload();
        });
        message.appendChild(newGameButton);

    }
    UIv1.showDefeat = () => {
        const message = document.createElement('div');
        const boardDiv = document.getElementById('board');
        message.classList.add('victory-message');
        message.textContent = 'YOU LOOSE!';

        boardDiv.appendChild(message);
        document.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'New Game';
        newGameButton.addEventListener('click', () => {
            location.reload();
        });
        message.appendChild(newGameButton);

    }
    UIv1.showCancelMessage = () => {
        const message = document.createElement('div');
        let boardDiv = document.getElementById('board');
        message.classList.add('alert');
        message.style.opacity = 0.8;
        boardDiv.appendChild(message);
        setTimeout(() => {
            message.style.opacity = 0;
        }, 10);
        setTimeout(() => {
            boardDiv.removeChild(message);
        }, 500);
    }
}
UIv1.drawBoard();

