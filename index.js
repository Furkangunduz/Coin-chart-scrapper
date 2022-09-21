const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002;
var cors = require('cors')

const { getScreenShot, uploadImg, coinList } = require("./script")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.get('/', (req, res) => {
    res.send('For using this api please add coin shortening name \nlike /btc\n/eth')
})

app.get('/:coinName', async (req, res) => {
    let coinName = req.params?.coinName.toUpperCase()

    if (coinName == "" || coinName == undefined) {
        res.status(404).send("Should provide coin name.")
    }
    if (coinList[coinName]) {
        await getScreenShot(coinList[coinName])
        let uploadedUrl = await uploadImg()
        res.status(200).json({ data: { url: uploadedUrl } })
    }
    else {
        res.status(404).json({ error: `Can not find ${coinName} . ` })
    }
    return
})


app.listen(PORT, () => {
    console.log("run on " + PORT)
})