const UI = {
    drawBoard: () => { throw new TypeError('Debes cambiar este método para usarlo!') },
    initUI: ()  => { throw new TypeError('Debes cambiar este método para usarlo!') },
    uiElements : {
        board : "board"
    },
    playersPositions: () => {}
}

export const UI_BUILDER = {
    init: () => ({...UI})
}