const express = require("express")
const chalk = require("chalk")
const fs = require("fs")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 4000

app.enable("trust proxy")
app.set("json spaces", 2)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Serve static files
app.use("/", express.static(path.join(__dirname, "api-page")))
app.use("/src", express.static(path.join(__dirname, "src")))

// Load settings
const settingsPath = path.join(__dirname, "./src/settings.json")
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))

// Response middleware
app.use((req, res, next) => {
  const originalJson = res.json
  res.json = function (data) {
    if (data && typeof data === "object") {
      const responseData = {
        status: data.status,
        creator: settings.apiSettings.creator || "Created Using Elle UI",
        ...data,
      }
      return originalJson.call(this, responseData)
    }
    return originalJson.call(this, data)
  }
  next()
})

// Load API routes
let totalRoutes = 0
const apiFolder = path.join(__dirname, "./src/api")

if (fs.existsSync(apiFolder)) {
  fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder)
    if (fs.statSync(subfolderPath).isDirectory()) {
      fs.readdirSync(subfolderPath).forEach((file) => {
        const filePath = path.join(subfolderPath, file)
        if (path.extname(file) === ".js") {
          require(filePath)(app)
          totalRoutes++
          console.log(
            chalk
              .bgHex("#8B5CF6")
              .hex("#FFF")
              .bold(` ✓ Loaded Route: ${path.basename(file)} `),
          )
        }
      })
    }
  })
}

console.log(chalk.bgHex("#10B981").hex("#FFF").bold(" 🚀 Elle API - Load Complete! "))
console.log(chalk.bgHex("#10B981").hex("#FFF").bold(` 📊 Total Routes Loaded: ${totalRoutes} `))

// Main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "index.html"))
})

// Error handlers
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "api-page", "404.html"))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).sendFile(path.join(__dirname, "api-page", "500.html"))
})

app.listen(PORT, () => {
  console.log(chalk.bgHex("#8B5CF6").hex("#FFF").bold(` 🌟 Elle API Server running on port ${PORT} `))
})

module.exports = app
