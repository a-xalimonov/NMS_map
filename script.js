const GAL_RAD = 200
const SCALE = (2 * GAL_RAD) / (2 ** 12 - 2)
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
    this.x = 0
    this.y = 0
    this.z = 0
    this.s = 0
    this.p = 0
    this.color = randomColor()
    container.insertAdjacentHTML(
        "afterbegin",
        `<div class="coord-div">
            <input type="text"></input>
            <input type="text"></input>
        </div>`
    )

    const tag = container.firstElementChild
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
        if (
            typeof this.x != undefined &&
            typeof this.y != undefined &&
            typeof this.z != undefined
        ) {
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
        if (
            typeof this.x != undefined &&
            typeof this.y != undefined &&
            typeof this.z != undefined
        ) {
            this.printPortal()
            draw()
        }
    }

    this.printPortal = () => {
        const [x, y, z] = convert(this.x, this.y, this.z)
        const pHex = this.p.toString(16)
        const sHex =
            `0`.repeat(3 - this.s.toString(16).length) + this.s.toString(16)
        const xHex = `0`.repeat(3 - x.toString(16).length) + x.toString(16)
        const yHex = `0`.repeat(2 - y.toString(16).length) + y.toString(16)
        const zHex = `0`.repeat(3 - z.toString(16).length) + z.toString(16)
        this.portalTag.value =
            `${pHex}${sHex}${yHex}${zHex}${xHex}`.toUpperCase()
    }

    this.printBolster = () => {
        const xHex =
            `0`.repeat(4 - this.x.toString(16).length) + this.x.toString(16)
        const yHex =
            `0`.repeat(4 - this.y.toString(16).length) + this.y.toString(16)
        const zHex =
            `0`.repeat(4 - this.z.toString(16).length) + this.z.toString(16)
        const sHex =
            `0`.repeat(4 - this.s.toString(16).length) + this.s.toString(16)
        this.bolsterTag.value = `${xHex}:${yHex}:${zHex}:${sHex}`.toUpperCase()
    }

    this.tag = container.firstElementChild
    this.bolsterTag.addEventListener("input", this.inputBolster)
    this.portalTag.addEventListener("input", this.inputPortal)
}

function draw() {
    ctx.fillStyle = `#000`
    ctx.lineWidth = 2 / SCALE
    ctx.strokeStyle = `#0f0`

    ctx.resetTransform()
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.setTransform(
        SCALE,
        0,
        0,
        SCALE,
        canvas.width / 2 - GAL_RAD,
        canvas.height / 2 - GAL_RAD
    )

    ctx.beginPath()
    ctx.arc(2 ** 11, 2 ** 11, DOT_RAD, 0, 2 * Math.PI)
    ctx.moveTo(0, 0)
    ctx.rect(
        0,
        0,
        2 ** 12,
        2 ** 12
    )
    ctx.stroke()

    ctx.lineWidth = 1 / SCALE
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

function convert(x, y, z) {
    const shift = (a, l) => a < l ? a + l : a - l
    return [shift(x, 2047), shift(y, 127), shift(z, 2047)]
}

function randomColor() {
    const getRand = () => Math.trunc(Math.random() * 128 + 128)
    return `rgb(${getRand()}, ${getRand()}, ${getRand()})`
}
