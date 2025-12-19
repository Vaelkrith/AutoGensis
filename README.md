# AutoGenesis - AI-Powered App Generator

AutoGenesis is an intelligent application that uses AI to automatically generate complete web applications based on user descriptions. It combines a FastAPI backend with a modern React/TypeScript frontend to create a seamless user experience.

## Demo Video

[![Watch the AutoGenesis Demo](https://img.shields.io/badge/▶%20Watch-Demo%20Video-red)](./Autogenesis_demo.mp4)

**[Click here to watch the demo video](./Autogenesis_demo.mp4)**

## Project Overview

AutoGenesis leverages AI technology to:
- Generate complete web applications from natural language descriptions
- Create functional backend and frontend code automatically
- Provide a user-friendly interface for app generation
- Store and manage generated applications

## Project Structure

```
AutoGenesis/
├── backend/                 # FastAPI Backend
│   ├── api.py             # Main API endpoints
│   ├── auth.py            # Authentication logic
│   ├── database.py        # Database configuration
│   ├── main.py            # Application entry point
│   ├── models.py          # Database models
│   ├── schemas.py         # Request/Response schemas
│   └── output/            # Generated applications output
│
├── frontend/              # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Entry point
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
│
├── env/                   # Python virtual environment
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Authentication**: JWT
- **AI Integration**: Google Generative AI

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv ../env
../env/Scripts/activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r ../requirements.txt
```

4. Run the server:
```bash
uvicorn api:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

✨ **AI-Powered Generation**: Automatically generate applications from descriptions
📱 **Responsive Design**: Works seamlessly on all devices
🔐 **Secure Authentication**: JWT-based user authentication
💾 **Persistent Storage**: Save and manage generated applications
⚡ **Real-time Updates**: Watch your app being generated in real-time

## API Documentation

Once the backend is running, access the interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Generated Applications

Successfully generated applications are stored in `backend/output/` directory, each with:
- `app.py`: Generated application code
- `README.md`: Application documentation
- `evocore_memory.json`: AI memory/context for the generation

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is developed as part of the Chitkara University FED curriculum.

## Contact

For questions or support, please reach out to the development team.

---

