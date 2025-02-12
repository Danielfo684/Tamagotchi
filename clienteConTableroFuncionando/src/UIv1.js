import { UI_BUILDER } from "./Ui.js";
import { Directions } from "./entities/Player.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";
export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}


UIv1.setConnectionHandler = (connectionHandler) => {
    UIv1.connectionHandler = connectionHandler;
}


UIv1.drawBoard = (board, players) => {


    if (board !== undefined) {

        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 50px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 50px)`;


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
        playerTile = board[player.x][player.y];
        const playerImage = document.createElement('img');
        playerImage.src = `assets/images/player.png`;
        playerImage.style.transform = UIv1.setImageRotation(player.direction);
        playerTile.dataset.element = player.id;
        playerTile.appendChild(playerImage);
    }

    UIv1.playerButtons = (player) => {
        let playerTile = document.querySelector(`[data-element="${player.player.id}"]`);

        const attackButton = document.createElement('button');
        const swordIcon = document.createElement('img');
        swordIcon.src = 'assets/images/sword.png';
        attackButton.appendChild(swordIcon);

        attackButton.addEventListener('click', () => {
            let playerTile = document.querySelector(`[data-element="${player.player.id}"]`);

            console.log('Attack button clicked');
            let x = player.player.x;
            let y = player.player.y;
            switch (player.player.direction) {
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
            anime ({
                targets: playerTile.querySelector('img'),
                translateX: [0, 50],
                duration: 300,
                easing: 'easeInOutQuad'
            });
            anime ({
                targets: playerTile.querySelector('img'),
                translateX: [50, 0],
                duration: 300,
                easing: 'easeInOutQuad'
            });

            player.player.status = 'attacking';
            setTimeout(() => {
                player.player.status = 'idle';
            }, 100);
            console.log(ConnectionHandler.socket);
            UIv1.ConnectionHandler.socket("ATTACK", { x, y }
            );
    });

    const advanceButton = document.createElement('button');
    const moveIcon = document.createElement('img');
    moveIcon.src = 'assets/images/movement.png';
    advanceButton.appendChild(moveIcon);

    advanceButton.addEventListener('click', () => {
        console.log('Movement button clicked');
        switch (player.player.direction) {
            case Directions.Up:

                if (player.player.x > 0) --player.player.x;
                break;
            case Directions.Right:
                if (player.player.y < 9)
                    ++player.player.y;
                break;
            case Directions.Down:
                if (player.player.x < 9)

                    ++player.player.x;
                break;
            case Directions.Left:
                if (player.player.x > 0)

                    --player.player.y;
                break;
        }
        UIv1.movePlayer(player.player);
        UIv1.ConnectionHandler.socket.emit("MOVE", UIv1.mapPlayer(player.player));
    });

    const rotateButton = document.createElement('button');
    const rotateIcon = document.createElement('img');
    rotateIcon.src = 'assets/images/rotate-right.png';
    rotateButton.appendChild(rotateIcon);
    rotateButton.addEventListener('click', () => {
        console.log('Rotate button clicked');
        let playerTile = document.querySelector(`[data-element="${player.player.id}"]`);
        console.log(playerTile);
        switch (player.player.direction) {
            case Directions.Up:
                player.player.direction = Directions.Right;
                playerTile.querySelector('img').style.transform = `rotate(0deg)`;
                break;
            case Directions.Right:
                player.player.direction = Directions.Down;
                playerTile.querySelector('img').style.transform = `rotate(90deg)`;
                break;
            case Directions.Down:
                player.player.direction = Directions.Left;
                playerTile.querySelector('img').style.transform = `rotate(180deg)`;
                break;
            case Directions.Left:
                player.player.direction = Directions.Up;
                playerTile.querySelector('img').style.transform = `rotate(270deg)`;
                break;
        }
        console.log(`Player direction: ${player.player.direction}`);
        UIv1.ConnectionHandler.emitData("ROTATE", UIv1.mapPlayer(player.player));

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

