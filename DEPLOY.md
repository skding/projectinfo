# Deployment Guide - Oracle Cloud

This guide explains how to deploy the **Project Record App** to your Oracle Cloud Compute Instance on **Port 4000**.

## Prerequisites
1.  **Oracle Cloud Instance** (Ubuntu or Oracle Linux) with:
    -   Docker installed.
    -   Docker Compose installed.
2.  **SSH Access** and `sudo` privileges.

## Step 1: Open Port 4000 (Critical)
Oracle Cloud has a strict firewall. You must open port 4000 in **TWO** places:

### 1. Oracle Cloud Console (VCN Security List)
1.  Go to **Networking** -> **Virtual Cloud Networks**.
2.  Click on your VCN -> **Security Lists** -> **Default Security List**.
3.  Click **Add Ingress Rules**.
    -   **Source CIDR**: `0.0.0.0/0`
    -   **IP Protocol**: TCP
    -   **Destination Port Range**: `4000`
4.  Click **Add Ingress Rules**.

### 2. Instance Firewall (iptables)
Run these commands on your instance to open the port:

**For Ubuntu (using UFW):**
```bash
sudo ufw allow 4000/tcp
sudo ufw reload
```

**For Oracle Linux / Ubuntu (using iptables):**
```bash
# This inserts a rule to accept traffic on port 4000
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 4000 -j ACCEPT

# Save the rules so they persist after reboot
sudo netfilter-persistent save
```

## Step 2: Prepare the Server
Create a directory for the app:
```bash
mkdir -p /opt/project-record
cd /opt/project-record
```

## Step 3: Transfer Files
You need to copy the project files to the server.

**Option A: Using Git (Recommended)**
1.  Push your code to GitHub/GitLab.
2.  Clone on the server:
    ```bash
    git clone https://github.com/your-username/your-repo.git .
    ```

**Option B: Using SCP**
From your local terminal:
```bash
scp -r * ubuntu@your_instance_ip:/opt/project-record/
```

## Step 4: Configure Environment
Create a `.env` file on the server:
```bash
nano .env
```
Paste (Update `AUTH_SECRET` and `AUTH_URL`):
```env
# Database URL (internal docker network)
DATABASE_URL="postgresql://postgres:postgres@db-prod:5432/project_record_prod"

# Auth Secret (Generate: openssl rand -base64 32)
AUTH_SECRET="CHANGE_THIS_TO_A_LONG_RANDOM_STRING"

# Auth URL (Your Public IP + Port)
AUTH_URL="http://your_instance_public_ip:4000"
```

## Step 5: Build and Run
Start the application:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Step 6: Database Setup
Initialize the database:

1.  **Push Schema**:
    ```bash
    docker exec -it project-record-app npx prisma db push
    ```

2.  **Seed User**:
    ```bash
    docker exec -it project-record-app node prisma/seed.js
    ```

## Step 7: Verify
Open `http://your_instance_public_ip:4000`.
Login: `admin@example.com` / `password123`.

**(Important)**: Verify that you can access the page. If it loads but hangs, check the Oracle Cloud Security List again. If it says "Connection Refused", check that the container is running or try simpler firewall rules.
