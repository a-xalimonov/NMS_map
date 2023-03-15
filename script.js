const GAL_RAD = 200
const SCALE = (2 * GAL_RAD) / (16 ** 3 - 2)
const DOT_RAD = 4 / SCALE

const coord_arr = []

const canvas = document.getElementsByClassName(`canvas`)[0]
const container = document.getElementsByClassName(`container`)[0]
document.getElementsByClassName(`add-btn`)[0].addEventListener(`click`, () => {
    coord_arr.push(new coord())
})
const ctx = canvas.getContext(`2d`)
draw()

function coord() {
    this.x = undefined
    this.y = undefined
    this.z = undefined
    this.s = undefined
    this.p = undefined
    this.color = randomColor()
    container.insertAdjacentHTML(
        `beforeend`,
        `<div class="coord-div" style="border-color: ${this.color}">
            <input type="text"></input>
            <input type="text"></input>
        </div>`
    )

    const tag = container.lastElementChild
    this.bolsterTag = tag.firstElementChild
    this.portalTag = tag.lastElementChild

    this.inputPortal = (e) => {
        const str = e.target.value
        this.p = parseInt(str[0], 16)
        this.s = parseInt(str.slice(1, 4), 16)
        const y = parseInt(str.slice(4, 6), 16)
        const z = parseInt(str.slice(6, 9), 16)
        const x = parseInt(str.slice(9, 12), 16)
        ;[this.x, this.y, this.z] = convert(x, y, z)
        if (!isNaN(this.x) && !isNaN(this.y) && !isNaN(this.z)) {
            console.log(this.x, this.y, this.z)
            this.printBolster()
            draw()
        }
    }

    this.inputBolster = (e) => {
        const str = e.target.value.split(`:`).join(``)
        this.x = parseInt(str.slice(0, 4), 16)
        this.y = parseInt(str.slice(4, 8), 16)
        this.z = parseInt(str.slice(8, 12), 16)
        this.s = parseInt(str.slice(12, 16), 16)
        this.p = 1
        if (!isNaN(this.x) && !isNaN(this.y) && !isNaN(this.z)) {
            this.printPortal()
            draw()
        }
    }

    this.printPortal = () => {
        const [x, y, z] = convert(this.x, this.y, this.z, false)
        const pHex = this.p.toString(16)
        let sHex = this.s.toString(16)
        sHex = `0`.repeat(3 - sHex.length) + sHex
        let xHex = x.toString(16)
        xHex = `0`.repeat(3 - xHex.length) + xHex
        let yHex = y.toString(16)
        yHex = `0`.repeat(2 - yHex.length) + yHex
        let zHex = z.toString(16)
        zHex = `0`.repeat(3 - zHex.length) + zHex
        this.portalTag.value =
            `${pHex}${sHex}${yHex}${zHex}${xHex}`.toUpperCase()
    }

    this.printBolster = () => {
        let xHex = this.x.toString(16)
        xHex = `0`.repeat(4 - xHex.length) + xHex
        let yHex = this.y.toString(16)
        yHex = `0`.repeat(4 - yHex.length) + yHex
        let zHex = this.z.toString(16)
        zHex = `0`.repeat(4 - zHex.length) + zHex
        let sHex = this.s.toString(16)
        sHex = `0`.repeat(4 - sHex.length) + sHex
        this.bolsterTag.value = `${xHex}:${yHex}:${zHex}:${sHex}`.toUpperCase()
    }

    this.tag = container.firstElementChild
    this.bolsterTag.addEventListener("input", this.inputBolster)
    this.portalTag.addEventListener("input", this.inputPortal)
}

function draw() {
    ctx.setTransform(
        SCALE,
        0,
        0,
        SCALE,
        canvas.width / 2 - GAL_RAD,
        canvas.height / 2 - GAL_RAD
    )

    drawGrid()
    drawCoords()
}

function drawGrid() {
    ctx.lineWidth = 2 / SCALE
    ctx.fillStyle = `#000`
    ctx.strokeStyle = `#0f0`

    ctx.save()
    ctx.resetTransform()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()

    ctx.beginPath()
    ctx.arc(2 ** 11, 2 ** 11, DOT_RAD, 0, 2 * Math.PI)
    ctx.moveTo(0, 0)
    ctx.rect(0, 0, 2 ** 12, 2 ** 12)
    ctx.stroke()

    ctx.lineWidth = 0.5 / SCALE
    ctx.beginPath()
    for (let i = 1; i <= 8; i++) {
        const step = i * 16 ** 2 * 2
        ctx.moveTo(0, step)
        ctx.lineTo(16 ** 3, step)
        ctx.moveTo(step, 0)
        ctx.lineTo(step, 16 ** 3)
    }
    ctx.stroke()
}

function drawCoords() {
    ctx.lineWidth = 1.5 / SCALE
    coord_arr.forEach((c) => {
        ctx.strokeStyle = c.color
        const dotPos = c.z + 127 - c.y

        ctx.beginPath()
        ctx.moveTo(c.x, c.z)
        ctx.lineTo(c.x, dotPos)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(c.x, dotPos, DOT_RAD, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    })
}

function convert(x, y, z, toBolster = true) {
    let shift
    if (toBolster) {
        shift = (a, l) => (a < l + 1 ? a + l - 1 : a - l - 1)
    } else {
        shift = (a, l) => (a < l - 1 ? a + l + 1 : a - l + 1)
    }
    return [shift(x, 2048), shift(y, 128), shift(z, 2048)]
}

function randomColor() {
    const getRand = () => Math.trunc(Math.random() * 256)
    return `rgb(${getRand()}, ${getRand()}, ${getRand()})`
}
