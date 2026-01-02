# 🏋️ Gym Workout App

A self-hosted web app for managing workout plans from PDF files. Upload your workout PDFs (like Nick Bare's Embrace the Suck) and access them from your phone with a beautiful mobile-first interface.

![Mobile App](https://img.shields.io/badge/Mobile-First-ff6b35) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED) ![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-Compatible-c51a4a)

## ✨ Features

- 📄 **PDF Import** - Upload workout PDFs and automatically extract exercises, sets, reps, and circuits
- 📱 **Mobile-First UI** - Beautiful dark theme interface optimized for phone usage
- ✅ **Today's Workout Checklist** - Track exercises with checkboxes as you complete them
- 🏃 **Guided Workout Mode** - Timer, set tracking, and exercise navigation
- 💪 **Weight Logging** - Log weights for each exercise with auto-fill from last session
- 📊 **Progress Graphs** - Visualize your weight progress per exercise
- 🔥 **Streak Tracking** - Track workout streaks and total sessions
- 🔄 **Multiple Programs** - Manage multiple workout programs at once
- 🐳 **Docker Ready** - Easy deployment on Raspberry Pi or any Docker host

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/Dfillmo/Workout.git
cd Workout

# Start with Docker Compose
docker-compose up -d --build

# Access at http://localhost (port 80)
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Access at `http://localhost:5173`

## 🍓 Raspberry Pi Deployment

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in
```

### 2. Install Docker Compose

```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 3. Clone and Run

```bash
git clone https://github.com/Dfillmo/Workout.git
cd Workout
docker compose up -d --build
```

### 4. Access via Twingate

1. Create a Twingate account at [twingate.com](https://twingate.com)
2. Add a new Resource pointing to your Raspberry Pi's local IP (e.g., `192.168.1.100`)
3. Set the port to `80`
4. Install Twingate client on your phone
5. Connect and access your workout app from anywhere!

## 📁 Project Structure

```
Workout/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── routes.py        # API endpoints
│   │   ├── database.py      # Database configuration
│   │   └── pdf_parser.py    # PDF extraction logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 📱 Screenshots

The app features:
- **Home Screen** - Today's workout checklist, stats, quick actions
- **Workout List** - Browse all workout days
- **Workout Detail** - See all exercises with emoji icons
- **Active Workout** - Guided mode with timer, set tracking, weight logging
- **Profile** - Workout history, weight progress graphs

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | List all workout plans |
| POST | `/api/plans/upload` | Upload and parse PDF |
| DELETE | `/api/plans/{id}` | Delete a workout plan |
| GET | `/api/days` | List workout days |
| GET | `/api/days/{id}` | Get workout day details |
| POST | `/api/sessions` | Start workout session |
| GET | `/api/sessions` | List all sessions |
| DELETE | `/api/sessions/{id}` | Delete a session |
| GET | `/api/exercises/{id}/history` | Get weight history |
| GET | `/api/stats` | Get user statistics |

## 🛠 Troubleshooting

**Docker build fails on Raspberry Pi:**
```bash
# Increase swap for builds
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # Set CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

**Can't access from phone:**
```bash
# Check firewall
sudo ufw allow 80

# Verify containers are running
docker ps

# Check logs
docker compose logs
```

## 🧰 Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, pdfplumber
- **Frontend:** React, Vite, React Router, Lucide Icons
- **Database:** SQLite
- **Deployment:** Docker, Nginx

## 📄 License

MIT License - feel free to modify and use for personal projects!
