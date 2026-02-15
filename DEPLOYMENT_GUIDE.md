# Deployment Guide - Flask Portfolio

## Quick Hosting Options

### Option 1: PythonAnywhere (Easiest - Free Tier Available)

**Best for:** Quick deployment, free hosting for small projects

1. **Sign up** at [pythonanywhere.com](https://www.pythonanywhere.com)

2. **Upload your code:**
   ```bash
   # Create a zip file
   cd "c:\Users\Aryan Kota\Desktop\project 47"
   Compress-Archive -Path "portfolio-flask\*" -DestinationPath "portfolio-flask.zip"
   ```
   - Go to PythonAnywhere Dashboard → Files
   - Upload `portfolio-flask.zip`
   - Extract it

3. **Install dependencies:**
   - Go to Consoles → Bash
   ```bash
   cd ~/portfolio-flask
   pip install --user -r requirements.txt
   ```

4. **Configure WSGI:**
   - Go to Web → Add a new web app
   - Select Flask, Python 3.10
   - Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:
   ```python
   import sys
   path = '/home/yourusername/portfolio-flask'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import app as application
   ```

5. **Set static files:**
   - URL: `/static/`
   - Directory: `/home/yourusername/portfolio-flask/static`

6. **Reload** and visit: `yourusername.pythonanywhere.com`

---

### Option 2: Render (Modern - Free Tier Available)

**Best for:** Professional deployment with CI/CD

1. **Sign up** at [render.com](https://render.com)

2. **Create `render.yaml`** in your project:
```yaml
services:
  - type: web
    name: portfolio
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

3. **Install Gunicorn:**
```bash
cd "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"
venv\Scripts\activate
pip install gunicorn
pip freeze > requirements.txt
```

4. **Push to GitHub** (install Git first from git-scm.com):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/AKTHEPRO47/portfolio.git
git push -u origin main
```

5. **Connect to Render:**
   - New → Web Service
   - Connect GitHub repository
   - Deploy automatically

**Your site:** `portfolio-xxxx.onrender.com`

---

### Option 3: Vercel (Fast - Free Tier)

**Best for:** Fast global CDN deployment

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Create `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ]
}
```

3. **Install Vercel CLI:**
```bash
npm install -g vercel
```

4. **Deploy:**
```bash
cd "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"
vercel
```

---

### Option 4: Railway (Easy - Free $5 Credits)

**Best for:** Simple deployment with database support

1. **Sign up** at [railway.app](https://railway.app)

2. **Install Railway CLI:**
```bash
npm install -g @railway/cli
railway login
```

3. **Deploy:**
```bash
cd "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"
railway init
railway up
```

4. **Generate domain:**
```bash
railway domain
```

---

### Option 5: Heroku (Popular - Paid)

**Best for:** Professional hosting with add-ons

1. **Sign up** at [heroku.com](https://heroku.com)

2. **Create `Procfile`:**
```
web: gunicorn app:app
```

3. **Create `runtime.txt`:**
```
python-3.11.0
```

4. **Install Heroku CLI** from heroku.com/cli

5. **Deploy:**
```bash
cd "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"
heroku login
heroku create portfolio-aryan
git init
git add .
git commit -m "Deploy"
git push heroku main
```

---

### Option 6: Cloudflare Pages + Backend (Recommended for Maximum Performance)

**Best for:** Maximum speed, security, and Cloudflare protection

**Setup Architecture:**
- **Backend:** Render/Railway (Flask app)
- **Frontend:** Cloudflare Pages (static assets + CDN)
- **DNS:** Cloudflare (security, caching, performance)

#### Step 1: Deploy Backend to Render

```bash
cd "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"

# Install Gunicorn
pip install gunicorn

# Update requirements
pip freeze > requirements.txt

# Create render.yaml
```

Create `render.yaml`:
```yaml
services:
  - type: web
    name: portfolio-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

Push to GitHub and connect to Render (auto-deploys).
Note your backend URL: `https://portfolio-xxxxx.onrender.com`

#### Step 2: Set Up Cloudflare

1. **Sign up** at [cloudflare.com](https://cloudflare.com)

2. **Add your domain:**
   - Enter your domain
   - Cloudflare scans your DNS records
   - Update your registrar's nameservers to Cloudflare's

3. **Create DNS Records:**
   - Go to DNS → Records
   - **API Subdomain:**
     - Type: CNAME
     - Name: `api`
     - Content: `portfolio-xxxxx.onrender.com`
     - Proxy: DNS only (orange cloud)
   
   - **Main Domain:**
     - Type: CNAME
     - Name: `@` (or `www`)
     - Content: `your-backend-domain.onrender.com`
     - Proxy: Proxied (orange cloud)

#### Step 3: Configure Cloudflare Rules

1. **Enable Caching for Static Files:**
   - Rules → Page Rules
   - URL: `yourdomain.com/static/*`
   - Cache Level: Cache Everything
   - Browser Cache TTL: 1 month

2. **Enable Security:**
   - SSL/TLS: Full (strict)
   - HTTP to HTTPS: Always on
   - Automatic HTTPS: Enabled

3. **Performance:**
   - Speed → Optimization
   - Enable Rocket Loader, Mirage, Polish

#### Step 4: Update Flask for Cloudflare

Edit `app.py`:
```python
from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Trust Cloudflare's X-Forwarded-For header
@app.before_request
def before_request():
    if 'CF_CONNECTING_IP' in request.headers:
        request.remote_addr = request.headers['CF_CONNECTING_IP']

@app.route('/')
def home():
    return render_template('home.html')

# ... rest of your routes ...

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
```

#### Step 5: CORS Configuration (if needed)

If frontend and backend are separate domains:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

Install: `pip install flask-cors`

#### Benefits of This Setup:
✅ **Free SSL/TLS** from Cloudflare  
✅ **Global CDN** for fast delivery  
✅ **DDoS Protection** (free plan)  
✅ **Automatic Caching** of static assets  
✅ **Page Rules** for custom caching  
✅ **Analytics** built-in  
✅ **Email Forwarding** free  

#### Cloudflare Pricing:
- **Free Plan:** Enough for most portfolios
- **Pro ($20/mo):** Email routing, advanced rules
- **Business ($200+/mo):** Enterprise features

---

## Preparing for Production

### 1. Update app.py for production:

```python
import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### 2. Create `.gitignore`:
Already created! Includes venv, __pycache__, etc.

### 3. Add Gunicorn (for production):
```bash
pip install gunicorn
pip freeze > requirements.txt
```

---

## Custom Domain Setup

After deploying to any platform:

1. **Buy domain** from Namecheap, GoDaddy, Google Domains
2. **Add DNS records:**
   - Type: A or CNAME
   - Name: @ or www
   - Value: Your hosting platform's IP/domain
3. **Enable SSL/HTTPS** (usually automatic on modern platforms)

---

## Recommended: PythonAnywhere for Quick Start

**Steps:**
1. Go to [pythonanywhere.com](https://www.pythonanywhere.com)
2. Sign up (free account)
3. Upload your portfolio-flask folder
4. Follow the WSGI configuration above
5. Your site will be live at: `yourusername.pythonanywhere.com`

**Free tier includes:**
- 512 MB storage
- Always-on web app
- HTTPS enabled
- Custom domain support (paid)

---

## Getting a Custom Domain (Optional)

**Cheap domains:**
- Namecheap: ~$10/year (.com)
- Porkbun: ~$8/year (.com)
- Google Domains: ~$12/year (.com)

**Free domains:**
- Freenom: .tk, .ml, .ga (not recommended)
- GitHub Pages: username.github.io (static only)

---

## Cost Comparison

| Platform | Free Tier | Custom Domain | Best For |
|----------|-----------|---------------|----------|
| PythonAnywhere | Yes (limited) | Paid add-on | Beginners |
| Render | Yes | Free | Modern apps |
| Vercel | Yes | Free | Fast CDN |
| Railway | $5 credit | Free | Quick start |
| Heroku | No (discontinued) | Free | Professional |

---

## Need Help?

1. Start with **PythonAnywhere** - easiest for Flask
2. Upgrade to **Render** or **Railway** when you need more features
3. Add custom domain when ready

**Your portfolio is ready to deploy!** 🚀
