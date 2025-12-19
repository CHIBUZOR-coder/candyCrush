// Create tile → configure tile → place tile → remember tile

let candies = ['Blue', 'Orange', 'Green', 'Yellow', 'Red', 'Purple']
let board = []
// 🎵 Sounds
const bgMusic = new Audio('sounds/bg-music.mp3')
const swapSound = new Audio('sounds/swap.mp3')
const crushSound = new Audio('sounds/crush.wav')
const invalidSound = new Audio('sounds/invalid.wav')

// Settings
bgMusic.loop = true
bgMusic.volume = 0.3
swapSound.volume = 0.6
crushSound.volume = 0.7
invalidSound.volume = 0.6

let rows = 9
let colums = 9
let score = 0
let turns = 0

let startX = 0
let startY = 0

//Actions
let currentTile
let otherTile
document.addEventListener('DOMContentLoaded', () => {
  startGame()

  const startBtn = document.getElementById('startBtn')

  startBtn.addEventListener('click', () => {
    bgMusic.currentTime = 0
    bgMusic.play().catch(err => console.log(err))
    startBtn.style.display = 'none'
  })

  setInterval(() => {
    crushCandy()
  }, 100)
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
      tile.addEventListener('touchstart', touchStart, { passive: false })
      tile.addEventListener('touchmove', touchMove, { passive: false })
      tile.addEventListener('touchend', touchEnd)

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
function touchStart (e) {
  e.preventDefault()
  currentTile = this

  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}
function touchMove (e) {
  e.preventDefault()
}
function touchEnd (e) {
  if (!currentTile) return

  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY

  const dx = endX - startX
  const dy = endY - startY

  // minimum swipe distance
  const threshold = 30

  let targetTile = null

  const [r, c] = currentTile.id.split('-').map(Number)

  if (Math.abs(dx) > Math.abs(dy)) {
    // horizontal swipe
    if (dx > threshold) targetTile = board[r][c + 1] // right
    else if (dx < -threshold) targetTile = board[r][c - 1] // left
  } else {
    // vertical swipe
    if (dy > threshold) targetTile = board[r + 1]?.[c] // down
    else if (dy < -threshold) targetTile = board[r - 1]?.[c] // up
  }

  if (targetTile) {
    otherTile = targetTile
    dragend() // reuse your existing logic 🎯
  }

  currentTile = null
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
  //   Swap -> Check -> Swap back ->Paint -> Result:
  // 👉 User never sees the invalid swap
  if (!currentTile || !otherTile) return

  //get cordinate to help avoid diagonal or distant swapping of candies
  //  the id matches the row and colum position or cordinate
  let currentCurd = currentTile.id.split('-') //id="0-0" => ["0", "0"]
  let r_Cur = parseInt(currentCurd[0])
  let c_Cur = parseInt(currentCurd[1])

  let otherCurd = otherTile.id.split('-')
  let r_othr = parseInt(otherCurd[0])
  let c_othr = parseInt(otherCurd[1])

  //Allow only Ajecency
  let moveLeft = c_othr === c_Cur - 1 && r_othr === r_Cur
  let moveRight = c_othr === c_Cur + 1 && r_othr == r_Cur
  let moveUp = r_othr === r_Cur + 1 && c_Cur === c_othr
  let moveDown = r_othr === r_Cur - 1 && c_Cur === c_othr

  let Adjacent = moveUp || moveDown || moveLeft || moveRight

  if (Adjacent) {
    //swap the image src of both tiles
    let currentStyle = currentTile.style.background
    let otherStyle = otherTile.style.background
    currentTile.style.background = otherStyle
    otherTile.style.background = currentStyle

    //semi last step
    const valid = checkValid()
    if (valid) {
      turns += 1
      swapSound.play()
      crushCandy()
    } else {
      currentTile.style.background = otherStyle
      otherTile.style.background = currentStyle
      invalidSound.play()
    }

    // Math.abs(r_Cur - r_othr) + Math.abs(c_Cur - c_othr) === 1
  }
}

function crushCandy () {
  //this calls all functions to crush candies
  crushFive()
  crushFour()
  crushThree()
  clearCrushedCandies()
  slideCandies()
  generateCandy()
  document.getElementById('score').innerText = score
  document.getElementById('turn').innerText = turns
}

// index < length - (N - 1)
// index < length - (4 - 1)
// index < length - 3

function crushThree () {
  let crushed = false
  //rows
  //crush every matched tiles in a row
  for (let r = 0; r < rows; r++) {
    //outer loop is ment to read throug each row
    // The guard (index < length - (N - 1)) makes sure the loop stops at c=6, so the window never goes past the edge.
    for (let c = 0; c < colums - 2; c++) {
      // inner loop is ment to modify individual candies(colums or tiles) in the current row
      let candy1 = board[r][c]
      let candy2 = board[r][c + 1]
      let candy3 = board[r][c + 2]

      let bg = candy1.style.background

      if (
        bg === candy2.style.background &&
        bg === candy3.style.background &&
        !bg.includes('blank')
      ) {
        // candy1.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy2.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy3.style.background = `url('images/blank.png') center center / cover no-repeat`
        candy1.classList.add('crush')
        candy2.classList.add('crush')
        candy3.classList.add('crush')
        score += 30
        crushed = true
      }
    }
  }

  //columns
  //crush every matched tiles in a culums
  for (let c = 0; c < colums; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c]
      let candy2 = board[r + 1][c]
      let candy3 = board[r + 2][c]

      let bg = candy1.style.background

      if (
        bg === candy2.style.background &&
        bg === candy3.style.background &&
        !bg.includes('blank')
      ) {
        // candy1.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy2.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy3.style.background = `url('images/blank.png') center center / cover no-repeat`
        candy1.classList.add('crush')
        candy2.classList.add('crush')
        candy3.classList.add('crush')
        score += 30
        crushed = true
      }
    }
  }
  if (crushed) {
    crushSound.currentTime = 0
    crushSound.play()
  }
}

function crushFour () {
  //Row
  let crushed
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < colums - 3; c++) {
      let candy1 = board[r][c]
      let candy2 = board[r][c + 1]
      let candy3 = board[r][c + 2]
      let candy4 = board[r][c + 3]

      let bg = candy1.style.background

      if (
        bg === candy2.style.background &&
        bg === candy3.style.background &&
        bg === candy4.style.background &&
        !bg.includes('blank')
      ) {
        // candy1.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy2.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy3.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy4.style.background = `url('images/blank.png') center center / cover no-repeat`
        candy1.classList.add('crush')
        candy2.classList.add('crush')
        candy3.classList.add('crush')
        candy4.classList.add('crush')
        score += 40
        crushed = true
      }
    }
  }

  //Cols
  for (let c = 0; c < colums; c++) {
    for (let r = 0; r < rows - 3; r++) {
      let candy1 = board[r][c]
      let candy2 = board[r + 1][c]
      let candy3 = board[r + 2][c]
      let candy4 = board[r + 3][c]

      let bg = candy1.style.background

      if (
        bg === candy2.style.background &&
        bg === candy3.style.background &&
        bg === candy4.style.background &&
        !bg.includes('blank')
      ) {
        // candy1.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy2.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy3.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy4.style.background = `url('images/blank.png') center center / cover no-repeat`
        candy1.classList.add('crush')
        candy2.classList.add('crush')
        candy3.classList.add('crush')
        candy4.classList.add('crush')
        score += 40
        crushed = true
      }
    }
  }

  if (crushed) {
    crushSound.currentTime = 0
    crushSound.play()
  }
}

function crushFive () {
  let crushed
  //Row
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < colums - 4; c++) {
      let candy1 = board[r][c]
      let candy2 = board[r][c + 1]
      let candy3 = board[r][c + 2]
      let candy4 = board[r][c + 3]
      let candy5 = board[r][c + 4]

      let bg = candy1.style.background

      if (
        bg === candy2.style.background &&
        bg === candy3.style.background &&
        bg === candy4.style.background &&
        bg === candy5.style.background &&
        !bg.includes('blank')
      ) {
        // candy1.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy2.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy3.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy4.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy5.style.background = `url('images/blank.png') center center / cover no-repeat`

        candy1.classList.add('crush')
        candy2.classList.add('crush')
        candy3.classList.add('crush')
        candy4.classList.add('crush')
        candy5.classList.add('crush')
        score += 50
        crushed = true
      }
    }
  }

  //Cols
  for (let c = 0; c < colums; c++) {
    for (let r = 0; r < rows - 4; r++) {
      let candy1 = board[r][c]
      let candy2 = board[r + 1][c]
      let candy3 = board[r + 2][c]
      let candy4 = board[r + 3][c]
      let candy5 = board[r + 4][c]

      let bg = candy1.style.background

      if (
        bg === candy2.style.background &&
        bg === candy3.style.background &&
        bg === candy4.style.background &&
        bg === candy5.style.background &&
        !bg.includes('blank')
      ) {
        // candy1.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy2.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy3.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy4.style.background = `url('images/blank.png') center center / cover no-repeat`
        // candy5.style.background = `url('images/blank.png') center center / cover no-repeat`

        candy1.classList.add('crush')
        candy2.classList.add('crush')
        candy3.classList.add('crush')
        candy4.classList.add('crush')
        candy5.classList.add('crush')
        score += 50
        crushed = true
      }
    }
  }
  if (crushed) {
    crushSound.currentTime = 0
    crushSound.play()
  }
}

function checkMatch (N) {
  // rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= colums - N; c++) {
      let bg = board[r][c].style.background
      if (!bg.includes('blank')) {
        let match = true
        for (let i = 1; i < N; i++) {
          if (board[r][c + i].style.background !== bg) {
            match = false
            break
          }
        }
        if (match) return true
      }
    }
  }

  // cols
  for (let c = 0; c < colums; c++) {
    for (let r = 0; r <= rows - N; r++) {
      let bg = board[r][c].style.background
      if (!bg.includes('blank')) {
        let match = true
        for (let i = 1; i < N; i++) {
          if (board[r + i][c].style.background !== bg) {
            match = false
            break
          }
        }
        if (match) return true
      }
    }
  }

  return false
}

function checkValid () {
  return checkMatch(3) || checkMatch(4) || checkMatch(5)
}

function clearCrushedCandies () {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < colums; c++) {
      if (board[r][c].classList.contains('crush')) {
        board[r][
          c
        ].style.background = `url('images/blank.png') center center / cover no-repeat`
        board[r][c].classList.remove('crush')
      }
    }
  }
}

function slideCandies () {
  // work column by column
  for (let c = 0; c < colums; c++) {
    // start from bottom row
    let idx = rows - 1

    // scan upward
    for (let r = rows - 1; r >= 0; r--) {
      if (!board[r][c].style.background.includes('blank')) {
        board[idx][c].style.background = board[r][c].style.background
        idx--
      }
    }

    // fill remaining spaces at the top with blanks
    for (let r = idx; r >= 0; r--) {
      board[r][
        c
      ].style.background = `url('images/blank.png') center center / cover no-repeat`
    }
  }
}

function generateCandy () {
  for (let c = 0; c < colums; c++) {
    if (board[0][c].style.background.includes('blank')) {
      board[0][
        c
      ].style.background = `url('images/${randomCandy()}.png') center center / cover no-repeat `
    }
  }
}
