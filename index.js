const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002;
var cors = require('cors')

const { getScreenShot, uploadImg, coinList } = require("./script")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/:coinName', async (req, res) => {
    let coinName = req.params.coinName.toUpperCase()

    if (coinName == "" || coinName == undefined) {
        res.status(404)
        throw new Error("Should provide coin name.")
    }
    if (coinList[coinName]) {
        await getScreenShot(coinList[coinName])
        let uploadedUrl = await uploadImg()
        res.status(200).json({ data: { url: uploadedUrl } })
    }
    return
})


app.listen(PORT, () => {
    console.log("run on " + PORT)
})