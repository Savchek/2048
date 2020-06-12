let size = 3, width = 100, score = 0
let n = []
let field = document.getElementById('field')
let sizeBlock = document.getElementById('size')
let controlsBlock = document.getElementById('controls')
let gameOverBlock = document.getElementById('gameOver')
let startBlock = document.getElementById('startBox')
let scoreBlock = document.getElementById('scoreBlock')
let scoreNode = document.getElementById('score')
let menuButton = document.getElementById('menu')
let boxes


const rand = (min, max) => {
	if (max === undefined) {
		max = min
		min = 0
	}
	return Math.floor(Math.random() * (max + 1 - min)) + min
}

const pickRandomPower = power => {
	let r = rand(power)
	if (r == 0) return 2
	if (r == 1) return 4
	if (r == 2) return 8
	return 16
}

const updateScore = newScore => {
	score = newScore
	scoreNode.innerText = score
}

const changeSize = amount => {
	size += amount
	if (size < 3) size = 3
	if (size > 6) size = 6
	sizeBlock.innerText = size + 'x' + size
}

const updateHTMLBox = () => {
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let index = i * size + j
			// console.log(`i: ${i}, j: ${j}, size: ${size}, index: ${index}`)
			boxes[index].innerText = n[i][j] ? n[i][j] : ''
		}
	}
}

const gameOverCheck = () => {
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let e = n[i][j]
			if (!e ||
				(n[i - 1] && n[i - 1][j] == e) ||
				n[i][j - 1] == e ||
				(n[i + 1] && n[i + 1][j] == e) ||
				n[i][j + 1] == e) {
				return
			}
		}
	}
	controlsBlock.style.display = menuButton.style.display = 'none'
	startBlock.style.display = gameOverBlock.style.display = 'flex'
}

const addNum = num => {
	let available = [...boxes].filter(e => e.innerText == 0)
	if (available.length > 0) {
		let randomBox = available[rand(available.length - 1)]
		randomBox.innerText = num
		let randomBoxId = randomBox.id.split('-')
		let i = randomBoxId[1]
		let j = randomBoxId[2]
		n[i][j] = num
		updateHTMLBox()
	}
}

const swipe = side => {
	let connected = []
	let moved = false
	if (side == 'left') {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (!n[i][j]) {
					continue
				}
				let k = j
				// Slide
				while (k > 0) {
					if (!n[i][k - 1]) {
						n[i][k - 1] = n[i][k]
						n[i][k] = 0
						moved = true
					}
					// Connect two
					if (n[i][k - 1] && n[i][k - 1] == n[i][k] && !connected.find(e => e == i + '' + (k - 1)) && !connected.find(e => e == i + '' + k)) {
						n[i][k - 1] *= 2
						updateScore(score + n[i][k])
						n[i][k] = 0
						connected.push(i + '' + (k - 1))
						moved = true
					}
					k--
				}

			}
		}
	}
	if (side == 'up') {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (!n[i][j]) {
					continue
				}
				let k = i
				// Slide
				while (k > 0) {
					if (!n[k - 1][j]) {
						n[k - 1][j] = n[k][j]
						n[k][j] = 0
						moved = true
					}
					// Connect two
					if (n[k - 1] && n[k - 1][j] == n[k][j] && !connected.find(e => e == (k - 1) + '' + j) && !connected.find(e => e == k + '' + j)) {
						n[k - 1][j] *= 2
						updateScore(score + n[k][j])
						n[k][j] = 0
						connected.push((k - 1) + '' + j)
						moved = true
					}
					k--
				}
			}
		}
	}
	if (side == 'right') {
		for (let i = size - 1; i >= 0; i--) {
			for (let j = size - 1; j >= 0; j--) {
				if (!n[i][j]) {
					continue
				}
				let k = j
				// Slide
				while (k < size - 1) {
					if (!n[i][k + 1]) {
						n[i][k + 1] = n[i][k]
						n[i][k] = 0
						moved = true
					}
					// Connect two
					if (n[i][k + 1] && n[i][k + 1] == n[i][k] && !connected.find(e => e == i + '' + (k + 1)) && !connected.find(e => e == i + '' + k)) {
						n[i][k + 1] *= 2
						updateScore(score + n[i][k])
						n[i][k] = 0
						connected.push(i + '' + (k + 1))
						moved = true
					}
					k++
				}
			}
		}
	}
	if (side == 'down') {
		for (let i = size - 1; i >= 0; i--) {
			for (let j = size - 1; j >= 0; j--) {
				if (!n[i][j]) {
					continue
				}
				let k = i
				// Slide
				while (k < size - 1) {
					if (!n[k + 1][j]) {
						n[k + 1][j] = n[k][j]
						n[k][j] = 0
						moved = true
					}
					// Connect two
					if (n[k + 1] && n[k + 1][j] == n[k][j] && !connected.find(e => e == (k + 1) + '' + j) && !connected.find(e => e == k + '' + j)) {
						n[k + 1][j] *= 2
						updateScore(score + n[k][j])
						n[k][j] = 0
						connected.push((k + 1) + '' + j)
						moved = true
					}
					k++
				}
			}
		}
	}

	if (moved) {
		updateHTMLBox()

		for (let i = 0; i < rand(1, 2); i++)
			addNum(pickRandomPower(2))
	}

	gameOverCheck()
}

const start = () => {

	for (let i = 0; i < size; i++) {
		n.push(new Array())
	}

	field.style.width = field.style.height = width * size + 'px'
	field.innerHTML = ''

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {

			n[i][j] = 0

			let newBox = document.createElement('div')
			newBox.id = `box-${i}-${j}`

			newBox.style.width = newBox.style.height = width + 'px'

			field.appendChild(newBox)
		}
	}

	boxes = document.querySelectorAll('[id^="box"]')

	for (let i = 0; i < rand(2, 4); i++)
		addNum(pickRandomPower(1))

	updateScore(0)

	field.style.display =
		controlsBlock.style.display =
		scoreBlock.style.display =
		menuButton.style.display = 'flex'

	startBlock.style.display = gameOverBlock.style.display = 'none'
}

const goToMenu = () => {
	if (confirm('Go to menu?')) {
		controlsBlock.style.display =
			menuButton.style.display =
			field.style.display =
			scoreBlock.style.display = 'none'
		startBlock.style.display = 'flex'
	}
}

document.getElementById('btn-left').addEventListener('click', () => swipe('left'))
document.getElementById('btn-right').addEventListener('click', () => swipe('right'))
document.getElementById('btn-up').addEventListener('click', () => swipe('up'))
document.getElementById('btn-down').addEventListener('click', () => swipe('down'))

document.getElementById('sizeIncrease').addEventListener('click', () => changeSize(1))
document.getElementById('sizeDecrease').addEventListener('click', () => changeSize(-1))
document.getElementById('startGame').addEventListener('click', start)
menuButton.addEventListener('click', goToMenu)

