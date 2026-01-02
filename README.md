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

### Option 1: Direct Install on Server (Recommended)

#### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3 and pip
sudo apt install -y python3 python3-pip python3-venv

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install serve for frontend
sudo npm install -g serve
```

#### Step 2: Clone and Setup

```bash
# Clone the repo
cd ~
git clone https://github.com/Dfillmo/Workout.git
cd Workout

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend  
cd ../frontend
npm install
npm run build
```

#### Step 3: Create Auto-Start Services

**Create backend service:**
```bash
sudo nano /etc/systemd/system/gym-backend.service
```

Paste this (change `pi` to your username if different):
```ini
[Unit]
Description=Gym Workout Backend
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/Workout/backend
ExecStart=/home/pi/Workout/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**Create frontend service:**
```bash
sudo nano /etc/systemd/system/gym-frontend.service
```

Paste this:
```ini
[Unit]
Description=Gym Workout Frontend
After=network.target gym-backend.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/Workout/frontend
ExecStart=/usr/bin/serve -s dist -l 3000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**Enable and start services:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable gym-backend gym-frontend
sudo systemctl start gym-backend gym-frontend

# Check status
sudo systemctl status gym-backend
sudo systemctl status gym-frontend
```

#### Step 4: Setup Nginx (Reverse Proxy)

Nginx routes traffic to both frontend and backend on a single port.

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/gym
```

Paste this:
```nginx
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/gym /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Step 5: Access Your App

🎉 **Go to:** `http://YOUR_SERVER_IP`

Find your server's IP:
```bash
hostname -I
```

---

### Option 2: Local Development (Windows/Mac)

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

---

### Option 3: Docker Compose

```bash
git clone https://github.com/Dfillmo/Workout.git
cd Workout
docker-compose up -d --build

# Access at http://localhost (port 80)
```

## 🌐 Remote Access with Twingate

Twingate provides secure remote access to your self-hosted app without exposing ports to the internet.

### Step 1: Create a Twingate Account

1. Go to [twingate.com](https://www.twingate.com/) and sign up for a free account
2. Create a new **Network** (e.g., "Home Network")

### Step 2: Deploy a Connector on Your Raspberry Pi

A Connector is a small agent that runs on your Pi and creates secure tunnels.

```bash
# Twingate will give you a command like this in the Admin Console:
# Go to Network → Connectors → Deploy a Connector → Docker

docker run -d \
  --name twingate-connector \
  --restart always \
  --network host \
  -e TWINGATE_NETWORK="your-network" \
  -e TWINGATE_ACCESS_TOKEN="your-token" \
  -e TWINGATE_REFRESH_TOKEN="your-refresh-token" \
  twingate/connector:latest
```

> 💡 The exact command with your tokens is provided in the Twingate Admin Console under **Connectors → Add Connector → Docker**

### Step 3: Add Your Gym App as a Resource

1. In the Twingate Admin Console, go to **Resources** → **Add Resource**
2. Configure:
   - **Name:** `Gym Workout App`
   - **Address:** Your Pi's local IP (e.g., `192.168.1.100`) 
   - **Port:** `80`
   - **Protocol:** TCP
3. Assign the Resource to a **Group** (create one if needed, e.g., "Personal")

### Step 4: Install Twingate Client on Your Phone

1. Download the **Twingate** app:
   - [iOS App Store](https://apps.apple.com/app/twingate/id1501592214)
   - [Google Play Store](https://play.google.com/store/apps/details?id=com.twingate.android)
2. Sign in with your Twingate account
3. Toggle the connection **ON**

### Step 5: Access Your App!

Once connected to Twingate, open your browser and go to:

```
http://192.168.1.100
```
(Replace with your Raspberry Pi's local IP)

> 🎉 You can now access your workout app from anywhere in the world - gym, work, vacation!

### Finding Your Pi's IP Address

```bash
# On the Raspberry Pi, run:
hostname -I

# Or check your router's admin page for connected devices
```

### Optional: Use a Custom Domain Name

Instead of remembering an IP, you can set up a local DNS alias in Twingate:

1. Go to **Resources** → Your gym app resource
2. Under **Alias**, add a friendly name like `gym.local` or `workout.home`
3. Now access via `http://gym.local` when connected to Twingate!

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
