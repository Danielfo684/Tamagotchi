export const Directions = {
    Right: "right",
    Down: "down",
    Left: "left",
    Up: "up"
}


export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.status = 0;
        this.direction = Directions.Right;
        this.visibility = true;
    }
}