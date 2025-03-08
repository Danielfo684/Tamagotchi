import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;

    constructor() {
        this.board = {
            size: 10,
            elements: []
        }
        const map: Array<number[]> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        let bush = 10;
        console.log("se crea el tablero");
        let probability = 2;
        for (let i = 0; i < this.board.size; i++) {
            for (let j = 0; j < this.board.size; j++) {
                if (map[i][j] == 0 && i != 0 && j != 0 && i != this.board.size - 1 && j != this.board.size - 1) {
                    if (!this.board.elements.includes({ x: (i - 1), y: j })) {
                        if (!this.board.elements.includes({ x: i, y: (j -1) })) {
                            if (Math.random() * 100 < probability) {
                                this.board.elements.push({ x: i, y: j });
                                console.log("bush");
                                console.log(this.board.elements);
                                probability = 2;
                            }
                            else {
                                probability += 1;
                            }
                        }
                    }
                }
            }
        }
    }

    public getBoard(): Board {
        return this.board;
    }
}