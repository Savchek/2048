let size = 3
let score = 0
let n = []
let gameBlock = document.getElementById('gameBlock')
let field = document.getElementById('field')
let sizeBlock = document.getElementById('size')
let controlsBlock = document.getElementById('controls')
let gameOverBlock = document.getElementById('gameOver')
let startBlock = document.getElementById('startBlock')
let scoreBlock = document.getElementById('scoreBlock')
let scoreNode = document.getElementById('score')
let menuButton = document.getElementById('menu')
let root = document.documentElement
let boxes

// touch
let xDown = null
let yDown = null


const rand = (min, max) => {
	if (max === undefined) {
		max = min
		min = 0
	}
	return Math.floor(Math.random() * (max + 1 - min)) + min
}

const changeStyle = ([...nodes], property, value) => {
	nodes.forEach(n => n.style.setProperty(property, value))
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
	if (size > 20) size = 20
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
	changeStyle([controlsBlock, menuButton], 'display', 'none')
	changeStyle([startBlock, gameOverBlock], 'display', 'flex')
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

		for (let i = 0; i < rand(1, Math.ceil(size / 4)); i++)
			addNum(pickRandomPower(2))
	}

	gameOverCheck()
}

const checkKey = e => {
	if (window.getComputedStyle(gameBlock, null).getPropertyValue('display') == 'none') {
		return
	}

	/* eslint-disable */
	switch (e.keyCode) {
		case 87: // W
		case 38: // arrow
			swipe('up')
			break
		case 83: // S
		case 40: // arrow
			swipe('down')
			break
		case 65: // A
		case 37: // arrow
			swipe('left')
			break
		case 68: // D
		case 39: // arrow
			swipe('right')
			break

		default:
			break
	}
	/* eslint-enable */
}

const start = () => {

	changeStyle([root], '--size', size)

	for (let i = 0; i < size; i++) {
		n.push(new Array())
	}

	// let fieldWidth = 100 * size + 'px'
	// changeStyle([root], '--field-width', fieldWidth)
	field.innerHTML = ''

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {

			n[i][j] = 0

			let newBox = document.createElement('div')
			newBox.id = `box-${i}-${j}`

			// changeStyle([newBox], 'width', '100px')
			// changeStyle([newBox], 'height', '100px')

			field.appendChild(newBox)
		}
	}

	boxes = document.querySelectorAll('[id^="box"]')

	for (let i = 0; i < rand(2, size - 1); i++)
		addNum(pickRandomPower(1))

	updateScore(0)

	changeStyle([gameBlock, scoreBlock, menuButton], 'display', 'flex')
	changeStyle([startBlock, gameOverBlock], 'display', 'none')
}

const goToMenu = () => {
	if (confirm('Go to menu?')) {
		changeStyle([menuButton, gameBlock, scoreBlock], 'display', 'none')
		changeStyle([startBlock], 'display', 'flex')
	}
}

// touch controls
const handleTouchStart = evt => {
	const firstTouch = evt.touches[0]
	xDown = firstTouch.clientX
	yDown = firstTouch.clientY
}

const handleTouchMove = evt => {
	if (!xDown || !yDown) {
		return
	}

	let xUp = evt.touches[0].clientX
	let yUp = evt.touches[0].clientY

	let xDiff = xDown - xUp
	let yDiff = yDown - yUp

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		if (xDiff > 0) {
			swipe('left')
		} else {
			swipe('right')
		}
	} else {
		if (yDiff > 0) {
			swipe('up')
		} else {
			swipe('down')
		}
	}

	xDown = null
	yDown = null
}

document.getElementById('sizeIncrease').addEventListener('click', () => changeSize(1))
document.getElementById('sizeDecrease').addEventListener('click', () => changeSize(-1))
document.getElementById('startGame').addEventListener('click', start)
menuButton.addEventListener('click', goToMenu)

// Controls
document.getElementById('btn-left').addEventListener('click', () => swipe('left'))
document.getElementById('btn-right').addEventListener('click', () => swipe('right'))
document.getElementById('btn-up').addEventListener('click', () => swipe('up'))
document.getElementById('btn-down').addEventListener('click', () => swipe('down'))

document.addEventListener('keydown', checkKey)

field.addEventListener('touchstart', handleTouchStart, false)
field.addEventListener('touchmove', handleTouchMove, false)
