// Elle UI - API Documentation Script
class ElleUI {
  constructor() {
    this.settings = {}
    this.currentCategory = "all"
    this.endpoints = []
    this.filteredEndpoints = []
    this.isLoading = true

    this.init()
  }

  async init() {
    try {
      await this.loadSettings()
      this.setupEventListeners()
      this.populateContent()
      this.renderCategories()
      this.renderEndpoints()
      this.initTheme()
    } catch (error) {
      console.error("Failed to initialize Elle UI:", error)
      this.showToast("Failed to load API documentation", "error")
    } finally {
      this.hideLoadingScreen()
    }
  }

  async loadSettings() {
    try {
      const response = await fetch("/src/settings.json")
      if (!response.ok) throw new Error("Failed to load settings")
      this.settings = await response.json()

      // Flatten endpoints for easier searching
      this.endpoints = []
      this.settings.categories.forEach((category) => {
        category.items.forEach((item) => {
          this.endpoints.push({
            ...item,
            category: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
          })
        })
      })

      this.filteredEndpoints = [...this.endpoints]
    } catch (error) {
      throw new Error("Failed to load settings: " + error.message)
    }
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Search functionality
    const searchInput = document.getElementById("searchInput")
    const searchClear = document.getElementById("searchClear")

    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value))
    }

    if (searchClear) {
      searchClear.addEventListener("click", () => this.clearSearch())
    }

    // Category slider navigation
    const categoryPrev = document.getElementById("categoryPrev")
    const categoryNext = document.getElementById("categoryNext")
    const categorySlider = document.getElementById("categorySlider")

    if (categoryPrev) {
      categoryPrev.addEventListener("click", () => this.scrollCategories("prev"))
    }

    if (categoryNext) {
      categoryNext.addEventListener("click", () => this.scrollCategories("next"))
    }

    // Modal events
    const apiModal = document.getElementById("apiModal")
    const modalClose = document.getElementById("modalClose")
    const modalCancel = document.getElementById("modalCancel")
    const tryEndpoint = document.getElementById("tryEndpoint")
    const copyUrl = document.getElementById("copyUrl")
    const copyResponse = document.getElementById("copyResponse")

    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeModal())
    }

    if (modalCancel) {
      modalCancel.addEventListener("click", () => this.closeModal())
    }

    if (tryEndpoint) {
      tryEndpoint.addEventListener("click", () => this.executeEndpoint())
    }

    if (copyUrl) {
      copyUrl.addEventListener("click", () => this.copyToClipboard("url"))
    }

    if (copyResponse) {
      copyResponse.addEventListener("click", () => this.copyToClipboard("response"))
    }

    // Close modal on overlay click
    if (apiModal) {
      apiModal.addEventListener("click", (e) => {
        if (e.target === apiModal) {
          this.closeModal()
        }
      })
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal()
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchInput?.focus()
      }
    })
  }

  populateContent() {
    // Update page title and brand
    const pageTitle = document.getElementById("pageTitle")
    const brandName = document.getElementById("brandName")
    const brandVersion = document.getElementById("brandVersion")
    const heroTitle = document.getElementById("heroTitle")
    const heroSubtitle = document.getElementById("heroSubtitle")
    const apiStatus = document.getElementById("apiStatus")
    const footerCopyright = document.getElementById("footerCopyright")

    if (pageTitle) pageTitle.textContent = this.settings.name || "Elle UI"
    if (brandName) brandName.textContent = this.settings.name || "Elle UI"
    if (brandVersion) brandVersion.textContent = this.settings.version || "v1.0.0"
    if (heroTitle) heroTitle.textContent = this.settings.name || "Elle API Hub"
    if (heroSubtitle) heroSubtitle.textContent = this.settings.description || "Modern API Documentation"
    if (apiStatus) apiStatus.textContent = this.settings.header?.status || "🟢 Online"

    // Update stats
    const totalEndpoints = document.getElementById("totalEndpoints")
    const totalCategories = document.getElementById("totalCategories")

    if (totalEndpoints) {
      this.animateNumber(totalEndpoints, this.endpoints.length)
    }

    if (totalCategories) {
      this.animateNumber(totalCategories, this.settings.categories?.length || 0)
    }

    // Update footer
    if (footerCopyright) {
      const year = new Date().getFullYear()
      const creator = this.settings.apiSettings?.creator || "Elle UI Team"
      footerCopyright.textContent = `© ${year} ${creator}. All rights reserved.`
    }
  }

  renderCategories() {
    const categorySlider = document.getElementById("categorySlider")
    if (!categorySlider || !this.settings.categories) return

    // Add "All" category
    const allCategory = {
      name: "All Categories",
      icon: "fas fa-th-large",
      color: "#6366f1",
      items: this.endpoints,
    }

    const categories = [allCategory, ...this.settings.categories]

    categorySlider.innerHTML = categories
      .map(
        (category) => `
            <div class="category-item ${this.currentCategory === (category.name === "All Categories" ? "all" : category.name) ? "active" : ""}" 
                 data-category="${category.name === "All Categories" ? "all" : category.name}"
                 style="--category-color: ${category.color}">
                <div class="category-icon" style="background: ${category.color}">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.items?.length || 0} endpoints</p>
                </div>
            </div>
        `,
      )
      .join("")

    // Add click events to category items
    categorySlider.querySelectorAll(".category-item").forEach((item) => {
      item.addEventListener("click", () => {
        const category = item.dataset.category
        this.filterByCategory(category)
      })
    })
  }

  renderEndpoints() {
    const endpointsGrid = document.getElementById("endpointsGrid")
    const noResults = document.getElementById("noResults")

    if (!endpointsGrid) return

    if (this.filteredEndpoints.length === 0) {
      endpointsGrid.style.display = "none"
      if (noResults) noResults.style.display = "block"
      return
    }

    endpointsGrid.style.display = "grid"
    if (noResults) noResults.style.display = "none"

    endpointsGrid.innerHTML = this.filteredEndpoints
      .map(
        (endpoint) => `
            <div class="endpoint-card" data-endpoint='${JSON.stringify(endpoint)}'>
                <div class="endpoint-header">
                    <span class="endpoint-method method-${endpoint.method?.toLowerCase() || "get"}">
                        ${endpoint.method || "GET"}
                    </span>
                    <span class="endpoint-status">
                        ${endpoint.status === "ready" ? "✓ Ready" : endpoint.status}
                    </span>
                </div>
                <h3 class="endpoint-title">${endpoint.name}</h3>
                <p class="endpoint-description">${endpoint.desc}</p>
                <div class="endpoint-url">
                    <code>${window.location.origin}${endpoint.path.split("?")[0]}</code>
                </div>
            </div>
        `,
      )
      .join("")

    // Add click events to endpoint cards
    endpointsGrid.querySelectorAll(".endpoint-card").forEach((card) => {
      card.addEventListener("click", () => {
        const endpointData = JSON.parse(card.dataset.endpoint)
        this.openEndpointModal(endpointData)
      })
    })
  }

  filterByCategory(category) {
    this.currentCategory = category

    // Update active category
    document.querySelectorAll(".category-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.category === category)
    })

    // Filter endpoints
    if (category === "all") {
      this.filteredEndpoints = [...this.endpoints]
    } else {
      this.filteredEndpoints = this.endpoints.filter((endpoint) => endpoint.category === category)
    }

    this.renderEndpoints()
  }

  handleSearch(query) {
    const searchClear = document.getElementById("searchClear")

    if (searchClear) {
      searchClear.classList.toggle("visible", query.length > 0)
    }

    if (!query.trim()) {
      this.filteredEndpoints =
        this.currentCategory === "all"
          ? [...this.endpoints]
          : this.endpoints.filter((endpoint) => endpoint.category === this.currentCategory)
    } else {
      const searchTerm = query.toLowerCase()
      const baseEndpoints =
        this.currentCategory === "all"
          ? this.endpoints
          : this.endpoints.filter((endpoint) => endpoint.category === this.currentCategory)

      this.filteredEndpoints = baseEndpoints.filter(
        (endpoint) =>
          endpoint.name.toLowerCase().includes(searchTerm) ||
          endpoint.desc.toLowerCase().includes(searchTerm) ||
          endpoint.category.toLowerCase().includes(searchTerm),
      )
    }

    this.renderEndpoints()
  }

  clearSearch() {
    const searchInput = document.getElementById("searchInput")
    const searchClear = document.getElementById("searchClear")

    if (searchInput) {
      searchInput.value = ""
      searchInput.focus()
    }

    if (searchClear) {
      searchClear.classList.remove("visible")
    }

    this.handleSearch("")
  }

  scrollCategories(direction) {
    const categorySlider = document.getElementById("categorySlider")
    if (!categorySlider) return

    const scrollAmount = 300
    const currentScroll = categorySlider.scrollLeft

    if (direction === "prev") {
      categorySlider.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: "smooth",
      })
    } else {
      categorySlider.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  openEndpointModal(endpoint) {
    const modal = document.getElementById("apiModal")
    const modalTitle = document.getElementById("modalTitle")
    const modalMethod = document.getElementById("modalMethod")
    const modalDescription = document.getElementById("modalDescription")
    const endpointUrl = document.getElementById("endpointUrl")
    const parametersSection = document.getElementById("parametersSection")
    const parametersForm = document.getElementById("parametersForm")

    if (!modal) return

    // Populate modal content
    if (modalTitle) modalTitle.textContent = endpoint.name
    if (modalMethod) {
      modalMethod.textContent = endpoint.method || "GET"
      modalMethod.className = `modal-method method-${(endpoint.method || "GET").toLowerCase()}`
    }
    if (modalDescription) modalDescription.textContent = endpoint.desc
    if (endpointUrl) endpointUrl.textContent = `${window.location.origin}${endpoint.path.split("?")[0]}`

    // Handle parameters
    if (endpoint.params && Object.keys(endpoint.params).length > 0) {
      if (parametersSection) parametersSection.style.display = "block"
      if (parametersForm) {
        parametersForm.innerHTML = Object.entries(endpoint.params)
          .map(
            ([key, description]) => `
                    <div class="parameter-group">
                        <label class="parameter-label">${key} *</label>
                        <input type="text" class="parameter-input" data-param="${key}" placeholder="Enter ${key}...">
                        <div class="parameter-description">${description}</div>
                    </div>
                `,
          )
          .join("")
      }
    } else {
      if (parametersSection) parametersSection.style.display = "none"
    }

    // Store current endpoint
    this.currentEndpoint = endpoint

    // Show modal
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    const modal = document.getElementById("apiModal")
    const responseSection = document.getElementById("responseSection")
    const loadingResponse = document.getElementById("loadingResponse")

    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = ""
    }

    // Reset response section
    if (responseSection) responseSection.style.display = "none"
    if (loadingResponse) loadingResponse.style.display = "none"

    this.currentEndpoint = null
  }

  async executeEndpoint() {
    if (!this.currentEndpoint) return

    const parametersForm = document.getElementById("parametersForm")
    const responseSection = document.getElementById("responseSection")
    const responseContent = document.getElementById("responseContent")
    const loadingResponse = document.getElementById("loadingResponse")
    const tryEndpoint = document.getElementById("tryEndpoint")

    // Collect parameters
    const params = new URLSearchParams()
    if (parametersForm) {
      const inputs = parametersForm.querySelectorAll(".parameter-input")
      let hasEmptyRequired = false

      inputs.forEach((input) => {
        const value = input.value.trim()
        const paramName = input.dataset.param

        if (!value) {
          hasEmptyRequired = true
          input.style.borderColor = "var(--error)"
        } else {
          input.style.borderColor = ""
          params.append(paramName, value)
        }
      })

      if (hasEmptyRequired) {
        this.showToast("Please fill in all required parameters", "error")
        return
      }
    }

    // Show loading
    if (loadingResponse) loadingResponse.style.display = "flex"
    if (responseSection) responseSection.style.display = "none"
    if (tryEndpoint) tryEndpoint.disabled = true

    try {
      const url = `${window.location.origin}${this.currentEndpoint.path.split("?")[0]}?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()

      // Show response
      if (responseContent) {
        responseContent.textContent = JSON.stringify(data, null, 2)
      }

      if (responseSection) responseSection.style.display = "block"
      this.showToast("Request executed successfully", "success")
    } catch (error) {
      console.error("API request failed:", error)

      if (responseContent) {
        responseContent.textContent = JSON.stringify(
          {
            error: "Request failed",
            message: error.message,
          },
          null,
          2,
        )
      }

      if (responseSection) responseSection.style.display = "block"
      this.showToast("Request failed: " + error.message, "error")
    } finally {
      if (loadingResponse) loadingResponse.style.display = "none"
      if (tryEndpoint) tryEndpoint.disabled = false
    }
  }

  async copyToClipboard(type) {
    let textToCopy = ""

    if (type === "url") {
      const endpointUrl = document.getElementById("endpointUrl")
      textToCopy = endpointUrl?.textContent || ""
    } else if (type === "response") {
      const responseContent = document.getElementById("responseContent")
      textToCopy = responseContent?.textContent || ""
    }

    if (!textToCopy) {
      this.showToast("Nothing to copy", "error")
      return
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      this.showToast("Copied to clipboard", "success")
    } catch (error) {
      console.error("Failed to copy:", error)
      this.showToast("Failed to copy to clipboard", "error")
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem("elle-ui-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const themeToggle = document.getElementById("themeToggle")

    if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
      document.body.classList.remove("dark-theme")
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      }
    } else {
      document.body.classList.add("dark-theme")
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      }
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme")
    const themeToggle = document.getElementById("themeToggle")

    if (isDark) {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("elle-ui-theme", "light")
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      }
      this.showToast("Switched to light theme", "info")
    } else {
      document.body.classList.add("dark-theme")
      localStorage.setItem("elle-ui-theme", "dark")
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      }
      this.showToast("Switched to dark theme", "info")
    }
  }

  animateNumber(element, target) {
    let current = 0
    const increment = target / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current)
    }, 20)
  }

  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer")
    if (!toastContainer) return

    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`

    const icons = {
      success: "fas fa-check",
      error: "fas fa-exclamation-circle",
      info: "fas fa-info-circle",
    }

    toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `

    toastContainer.appendChild(toast)

    // Show toast
    setTimeout(() => toast.classList.add("show"), 100)

    // Remove toast
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen")
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add("fade-out")
        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 500)
      }, 1000)
    }
  }
}

// Global functions
function clearSearch() {
  if (window.elleUI) {
    window.elleUI.clearSearch()
  }
}

// Initialize Elle UI when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.elleUI = new ElleUI()
})
