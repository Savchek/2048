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
let boxWidth

let boxProperties = {
	2: [0.6, '#ffcc99'],
	4: [0.6, '#ff9933'],
	8: [0.6, '#ff5500'],
	16: [0.5, '#ff80aa'],
	32: [0.5, '#ff8080'],
	64: [0.5, '#ff1a1a'],
	128: [0.45, '#ff99ff'],
	256: [0.45, '#d24dff'],
	512: [0.45, '#9966ff'],
	1024: [0.35, '#3333ff'],
	2048: [0.35, '#1aff1a'],
	4096: [0.35, '#1aff1a'],
	8192: [0.35, '#1aff1a'],
	1: [0.25, '#e600e6'],
}

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
	nodes.forEach(n => n.style.cssText = `${property}: ${value};`)
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
			let propIndex = n[i][j] > 8192 ? 1 : n[i][j]
			let index = i * size + j
			if (n[i][j]) {
				boxes[index].innerText = n[i][j]
				boxes[index].style.fontSize = boxWidth * boxProperties[propIndex][0] + 'px'
				boxes[index].style.backgroundColor = boxProperties[propIndex][1]
			} else {
				boxes[index].innerText = ''
				boxes[index].style.backgroundColor = 'transparent'
			}

			setTimeout(() => {
				boxes[index].style.inset = '0 0 0 0'
				boxes[index].style.zIndex = '1'
				boxes[index].style.opacity = '1'
			}, 200)

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
						boxes[i * size + j].style.left = parseFloat(boxes[i * size + j].style.left) - boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
						moved = true
					}
					// Connect two
					if (n[i][k - 1] && n[i][k - 1] == n[i][k] && !connected.find(e => e == i + '' + (k - 1)) && !connected.find(e => e == i + '' + k)) {
						n[i][k - 1] *= 2
						updateScore(score + n[i][k])
						n[i][k] = 0
						connected.push(i + '' + (k - 1))
						boxes[i * size + j].style.left = parseFloat(boxes[i * size + j].style.left) - boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
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
						boxes[i * size + j].style.top = parseFloat(boxes[i * size + j].style.top) - boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
					}
					// Connect two
					if (n[k - 1] && n[k - 1][j] == n[k][j] && !connected.find(e => e == (k - 1) + '' + j) && !connected.find(e => e == k + '' + j)) {
						n[k - 1][j] *= 2
						updateScore(score + n[k][j])
						n[k][j] = 0
						connected.push((k - 1) + '' + j)
						moved = true
						boxes[i * size + j].style.top = parseFloat(boxes[i * size + j].style.top) - boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
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
						boxes[i * size + j].style.left = parseFloat(boxes[i * size + j].style.left) + boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
					}
					// Connect two
					if (n[i][k + 1] && n[i][k + 1] == n[i][k] && !connected.find(e => e == i + '' + (k + 1)) && !connected.find(e => e == i + '' + k)) {
						n[i][k + 1] *= 2
						updateScore(score + n[i][k])
						n[i][k] = 0
						connected.push(i + '' + (k + 1))
						moved = true
						boxes[i * size + j].style.left = parseFloat(boxes[i * size + j].style.left) + boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
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
						boxes[i * size + j].style.top = parseFloat(boxes[i * size + j].style.top) + boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
					}
					// Connect two
					if (n[k + 1] && n[k + 1][j] == n[k][j] && !connected.find(e => e == (k + 1) + '' + j) && !connected.find(e => e == k + '' + j)) {
						n[k + 1][j] *= 2
						updateScore(score + n[k][j])
						n[k][j] = 0
						connected.push((k + 1) + '' + j)
						moved = true
						boxes[i * size + j].style.top = parseFloat(boxes[i * size + j].style.top) + boxWidth + 'px'
						boxes[i * size + j].style.zIndex = '-1'
						boxes[i * size + j].style.opacity = '0.5'
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

	if (window.innerWidth > (window.innerHeight * 0.8)) {
		field.classList.add('b-h')
		field.classList.add('f-h')
	} else {
		field.classList.add('b-w')
		field.classList.add('f-w')
	}

	for (let i = 0; i < size; i++) {
		n.push(new Array())
	}

	field.innerHTML = ''

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {

			n[i][j] = 0

			let newBox = document.createElement('div')
			newBox.id = `box-${i}-${j}`

			field.appendChild(newBox)
		}
	}

	boxes = document.querySelectorAll('[id^="box"]')


	for (let i = 0; i < rand(2, size - 1); i++)
		addNum(pickRandomPower(1))

	updateScore(0)

	changeStyle([gameBlock, scoreBlock, menuButton], 'display', 'flex')
	changeStyle([startBlock, gameOverBlock], 'display', 'none')

	boxWidth = document.getElementById('box-0-0').offsetWidth
	updateHTMLBox()
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

	let threshold = 100
	let dir = null

	if (Math.abs(xDiff) > threshold) {
		if (xDiff > 0) {
			dir = 'left'
		} else {
			dir = 'right'
		}
	} else if (Math.abs(yDiff) > threshold) {
		if (yDiff > 0) {
			dir = 'up'
		} else {
			dir = 'down'
		}
	}

	if (dir) {
		swipe(dir)
		xDown = null
		yDown = null
	}
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

