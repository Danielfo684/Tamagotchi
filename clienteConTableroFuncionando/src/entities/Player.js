export const Directions = {
    Right: "right",
    Down: "down",
    Left: "left",
    Up: "up"
}

export const PlayerStates = {
    Defeated: "defeated", 
    Attacking: "attacking", 
    Alive: "alive"
}

export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.state = PlayerStates.Alive;
        this.direction = Directions.Right;
        this.visibility = true;
    }
}