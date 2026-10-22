# Oracle Cloud PM2 Deployment & Update Guide (Port 3001)

This guide covers how to update your existing app running with **PM2** on Oracle Cloud using the GitHub repository:  
**`https://github.com/skding/projectinfo`**

---

## ⚡ Quick Update Guide (For Running PM2 Server)

When you have pushed your latest changes to GitHub, run these steps on your Oracle Cloud instance to update the live app:

### Step 1: SSH into your Oracle Cloud Instance
```bash
ssh -i /path/to/your-key.key ubuntu@<YOUR_SERVER_IP>
```
*(Replace `ubuntu` with `opc` if using Oracle Linux).*

---

### Step 2: Navigate to your Project Directory
```bash
cd ~/projectinfo
```
*(Or the directory where your repository is cloned, e.g. `/var/www/projectinfo` or `/opt/projectinfo`).*

---

### Step 3: Check Current PM2 Status
```bash
pm2 status
```
> Note the **App name** or **id** (e.g., `projectinfo` or `0`).

---

### Step 4: Pull the Latest Code from GitHub
```bash
git pull origin main
```
*(If you have uncommitted changes on the server, you can run `git stash` before pulling).*

---

### Step 5: Install Dependencies & Sync Database Schema
```bash
npm install
npx prisma generate
npx prisma db push
```

---

### Step 6: Build the Production Application
```bash
npm run build
```

---

### Step 7: Restart the App in PM2
Restart by app name (or id):
```bash
pm2 restart projectinfo
```
*(Or simply `pm2 restart all` if it is your only app).*

If you want PM2 to use the included `ecosystem.config.js`:
```bash
pm2 start ecosystem.config.js
```

---

### Step 8: Verify Live Status & Logs
```bash
pm2 status
pm2 logs --lines 50
```

Open your browser:
```
http://<YOUR_SERVER_IP>:3001
```

---

## 🚀 Initial / Fresh PM2 Setup (For Reference)

If setting up on a brand new instance or fresh directory:

### 1. Ensure Port 3001 is open in firewall
- **Oracle Cloud Console**: In your VCN Default Security List, add Ingress Rule for TCP port `3001` from `0.0.0.0/0`.
- **Instance OS Firewall**:
  ```bash
  sudo ufw allow 3001/tcp
  sudo ufw reload
  ```
  *(Or on Oracle Linux: `sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT && sudo netfilter-persistent save`)*

### 2. Clone the repository
```bash
git clone https://github.com/skding/projectinfo.git
cd projectinfo
```

### 3. Install packages & build
```bash
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run build
```

### 4. Start with PM2 on Port 3001
Using the provided `ecosystem.config.js`:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Or directly via npm:
```bash
PORT=3001 pm2 start npm --name "projectinfo" -- run start
pm2 save
pm2 startup
```

---

## 🛠️ Helpful PM2 Commands

| Action | Command |
|---|---|
| View running apps & CPU/Memory | `pm2 status` |
| View real-time logs | `pm2 logs` |
| View logs for this app specifically | `pm2 logs projectinfo` |
| Restart app | `pm2 restart projectinfo` |
| Reload with zero-downtime | `pm2 reload projectinfo` |
| Stop app | `pm2 stop projectinfo` |
| Save current processes to revive on boot | `pm2 save` |
| Real-time terminal dashboard | `pm2 monit` |
