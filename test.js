const marks = [5, 6, 3, 7, 9]
const marksII = [5, 6, 4, 7, 8]

//ExerciseI: Find the sum and average of each mark
let sum = 0
let avrage

for (i = 0; i < marks.length; i++) {
  sum += marks[i]
}
avrage = sum / marks.length

console.log('sum:', sum)
console.log('average:', avrage)

//ExerciseII: Find the count of even numbers and odd numbers in the array
let odd = 0
let even = 0
for (i = 0; i <= 10; i++) {
  if (i % 2 === 0) {
    even++
  } else {
    odd++
  }
}

// console.log(`even are ${even}`)
// console.log(`odd are ${odd}`)

//ExerciseIII: calculate the sum of individual elements of an array
let sumArray = []
let num
for (i = 0; i < marks.length; i++) {
  num = marks[i] + marksII[i]
  // sumArray.push(num)
  sumArray[i] = num
}

console.log('summarray:', sumArray)

// let a = Array.from({ length: 2 }, () => Array(3).fill(0))
// Array.from({ length: ROWS }, () => Array(COLUMNS).fill(VALUE))

function startGame () {
  board = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: colums }, (_, c) => {
      let tile = document.createElement('div')

      tile.id = `${r}-${c}`
      tile.classList.add('img', 'imge')
      tile.style.background = `url('images/${randomCandy()}.png') center center / cover no-repeat`

      document.getElementById('board').append(tile)
      return tile
    })
  )

  console.log('board:', board)
}

const mat = [
  [1, 2, 3],
  [4, 5, 6]
]
let mat2 = []

for (i = 0; i < 2; i++) {
  let rows = []

  for (j = 0; j < 3; j++) {
    rows.push(mat[i][j])
  }

  mat2.push(rows)
}
console.log(mat2)
mat2.forEach(row => {
  console.log(row.join('\t'))
})
