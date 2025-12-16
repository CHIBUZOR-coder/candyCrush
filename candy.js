// Create tile → configure tile → place tile → remember tile

let candies = ['Blue', 'Orange', 'Green', 'Yellow', 'Red', 'Purple']
let board = []

let rows = 9
let colums = 9
let score = 0

//Actions
let currentTile
let otherTile

document.addEventListener('DOMContentLoaded', () => {
  startGame()
})
function randomCandy () {
  return candies[Math.floor(Math.random() * candies.length)]
}

function startGame () {
  for (let r = 0; r < rows; r++) {
    // this row is created in JavaScript only to store references to tiles that exist in the DOM
    let row = []

    for (let c = 0; c < colums; c++) {
      //*****create tile******
      let tile = document.createElement('div')

      // *********configure tile

      //add id
      tile.id = `${r.toString()}-${c.toString()}`

      //add attributes for styling the imge gives => images/Red.png
      tile.setAttribute('class', 'img imge')

      //images/Red.png
      // tile.classList.add('imge')
      tile.style.background = `url('images/${randomCandy()}.png') center center / cover no-repeat `

      //make dragable
      tile.draggable = true

      //Drag start
      tile.addEventListener('dragstart', dragStart) //this initialises the drag process

      //Drag Over
      tile.addEventListener('dragover', dragOver) //Event=>  you start moving the mouse with the drag candy

      //Drag Enter
      tile.addEventListener('dragenter', dragEnter) //when you have the draged candy is about to touch a target candy

      //Drag Leave
      tile.addEventListener('dragleave', dragLeave) //when you dlet go of the click or drag. but leaving the mouse you are clicking

      //Drag Drop
      tile.addEventListener('drop', dragDrop) //

      //Drag End
      tile.addEventListener('dragend', dragend)

      // ******* place tile***
      document.getElementById('board').append(tile)

      // ********remember tile*******
      // storing a reference to the tile in the current row
      row.push(tile)
    }

    // store a reference to the completed row inside the board
    board.push(row)
  }
  console.log('board:', board)
  // board[0][0].style.border = '3px solid red'
}

function dragStart () {
  //this refers to the tile(candy) that was clicked and drag
  currentTile = this
}

function dragOver (e) {
  //this refers to the candy that was clicked and drag
  e.preventDefault()
}

function dragEnter (e) {
  //this refers to the candy that was clicked and drag
  e.preventDefault()
}

function dragLeave (e) {
  //this refers to the candy that was clicked and drag
  e.preventDefault()
}

function dragDrop () {
  //this refers to the target tile(candy) that was drop on and
  otherTile = this
}

function dragend () {
  if (!currentTile || !otherTile) return

  //swap the image src of both tiles
  let currentStyle = currentTile.style.background
  let otherStyle = otherTile.style.background

  currentTile.style.background = otherStyle
  otherTile.style.background = currentStyle
}
