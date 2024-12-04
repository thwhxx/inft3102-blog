# Personal Blog with 11ty and Strapi

A modern, responsive blog built with Eleventy (11ty) as the static site generator and Strapi as the headless CMS.

## Features

- 🚀 Fast static site generation with 11ty
- 📱 Responsive design
- 🎨 Clean and minimal UI
- 📝 Markdown support
- 🏷️ Tag-based categorization
- 📄 Pagination
- 🖼️ Image optimization
- 📊 Reading time estimation
- 🗃️ Headless CMS with Strapi

## Tech Stack

- **Frontend:**

  - [Eleventy (11ty)](https://www.11ty.dev/) - Static Site Generator
  - Liquid Templates
  - CSS (No framework, custom styling)
  - Responsive Design

- **Backend:**
  - [Strapi](https://strapi.io/) - Headless CMS
  - Node.js
  - Postgre SQL

## Prerequisites

- Node.js (v14 or higher)
- npm
- Strapi (v4)

## Getting Started

1. **Install dependencies**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

2. **Environment Setup**

   ```bash
   # In frontend directory, create .env file
   STRAPI_URL=http://localhost:1337

   # In backend directory, Strapi will create its own .env file
   ```

3. **Run the development servers**

   ```bash
   # Start Strapi backend
   cd backend
   npm run develop

   # In a new terminal, start 11ty frontend
   cd frontend
   npm run dev
   ```

4. **Build for production**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   ```

## Deployment

- **Frontend**: Can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages)
- **Backend**: Requires Node.js hosting (Heroku, DigitalOcean, etc.)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## License

[MIT License](LICENSE)

## Contact

Your Name - [@thwhxx](https://github.com/thwhxx)

## Acknowledgments

- [11ty Documentation](https://www.11ty.dev/docs/)
- [Strapi Documentation](https://strapi.io/documentation/)
- Thanks to all contributors
