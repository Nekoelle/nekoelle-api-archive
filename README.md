# Elle UI - Modern API Documentation

A beautiful and modern API documentation interface built with Express.js, featuring a sleek dark theme, responsive design, and interactive endpoint testing.

## ✨ Features

- 🌙 **Dark Theme First** - Beautiful dark mode with light theme toggle
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🔍 **Smart Search** - Find endpoints quickly with real-time search
- 🏷️ **Category Filtering** - Organize endpoints by categories with sliding navigation
- 🚀 **Interactive Testing** - Test API endpoints directly from the documentation
- 🎨 **Modern Design** - Clean, professional interface with smooth animations
- ⚡ **Fast & Lightweight** - Optimized for performance
- 🛠️ **Easy Configuration** - Simple JSON-based configuration

## 🚀 Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/elle-ui-api-docs.git
   cd elle-ui-api-docs
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure your API**
   Edit \`src/settings.json\` to customize your API documentation:
   \`\`\`json
   {
     "name": "Your API Name",
     "version": "v1.0.0",
     "description": "Your API description",
     "categories": [
       {
         "name": "Category Name",
         "icon": "fas fa-icon",
         "color": "#6366f1",
         "items": [
           {
             "name": "Endpoint Name",
             "desc": "Endpoint description",
             "path": "/api/endpoint?param=",
             "method": "GET",
             "status": "ready",
             "params": {
               "param": "Parameter description"
             }
           }
         ]
       }
     ]
   }
   \`\`\`

4. **Add your API endpoints**
   Create your API route files in \`src/api/\` directory:
   \`\`\`javascript
   // src/api/example/hello.js
   module.exports = function(app) {
       app.get('/api/hello', (req, res) => {
           res.json({
               status: true,
               message: 'Hello from Elle UI!'
           });
       });
   };
   \`\`\`

5. **Start the server**
   \`\`\`bash
   npm start
   \`\`\`

6. **Open your browser**
   Navigate to \`http://localhost:4000\` to see your API documentation.

## 📁 Project Structure

\`\`\`
elle-ui-api-docs/
├── api-page/           # Frontend files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styles and themes
│   ├── script.js       # JavaScript functionality
│   ├── 404.html        # 404 error page
│   └── 500.html        # 500 error page
├── src/
│   ├── api/            # API endpoint files
│   │   ├── ai/         # AI category endpoints
│   │   ├── utils/      # Utility endpoints
│   │   └── ...         # Other categories
│   └── settings.json   # Configuration file
├── index.js            # Main server file
├── package.json        # Dependencies
├── vercel.json         # Vercel deployment config
└── README.md           # This file
\`\`\`

## 🎨 Customization

### Themes
Elle UI supports both light and dark themes. Users can toggle between themes using the theme switcher in the navigation bar.

### Colors
Customize the color scheme by modifying the CSS variables in \`api-page/styles.css\`:

\`\`\`css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #06b6d4;
}
\`\`\`

### Categories
Add new categories in \`src/settings.json\`:

\`\`\`json
{
  "name": "New Category",
  "icon": "fas fa-star",
  "color": "#10b981",
  "items": [...]
}
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
Elle UI can be deployed on any Node.js hosting platform:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 🛠️ API Endpoint Structure

Create API endpoints by adding files to the \`src/api/\` directory:

\`\`\`javascript
module.exports = function(app) {
    app.get('/api/your-endpoint', async (req, res) => {
        try {
            const { param } = req.query;
            
            // Your API logic here
            
            res.status(200).json({
                status: true,
                data: {
                    // Your response data
                }
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    });
};
\`\`\`

## 📝 Configuration Options

### settings.json Options

| Option | Type | Description |
|--------|------|-------------|
| \`name\` | string | API name displayed in the interface |
| \`version\` | string | API version |
| \`description\` | string | API description |
| \`bannerImage\` | string | Path to banner image |
| \`logo\` | string | Path to logo image |
| \`header.status\` | string | API status indicator |
| \`apiSettings.creator\` | string | Creator name |
| \`categories\` | array | Array of API categories |

### Category Structure

| Option | Type | Description |
|--------|------|-------------|
| \`name\` | string | Category name |
| \`icon\` | string | FontAwesome icon class |
| \`color\` | string | Category color (hex) |
| \`items\` | array | Array of endpoints |

### Endpoint Structure

| Option | Type | Description |
|--------|------|-------------|
| \`name\` | string | Endpoint name |
| \`desc\` | string | Endpoint description |
| \`path\` | string | API endpoint path |
| \`method\` | string | HTTP method (GET, POST, etc.) |
| \`status\` | string | Endpoint status (ready, maintenance) |
| \`params\` | object | Parameter descriptions |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FontAwesome](https://fontawesome.com/) for the beautiful icons
- [Inter Font](https://rsms.me/inter/) for the clean typography
- [Express.js](https://expressjs.com/) for the robust backend framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our Discord community

---

Made with ❤️ by Yeonelle
