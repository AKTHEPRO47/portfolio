# Neil Aryan Kota - Portfolio

A modern portfolio website built with Flask, HTML, CSS, JavaScript, and Three.js.

## Features

- 🎨 Modern, responsive design with smooth animations
- 🌐 3D interactive hero section using Three.js
- 📱 Mobile-friendly navigation
- 🚀 Fast loading and optimized performance
- 💼 Project showcase with expandable details
- 📧 Contact form with backend API

## Tech Stack

### Backend
- **Python 3.x** - Programming language
- **Flask** - Web framework
- **Jinja2** - Template engine

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with custom properties and animations
- **JavaScript (ES6+)** - Interactivity
- **Three.js** - 3D graphics and animations

## Installation

1. **Clone or navigate to the repository:**
```bash
cd "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"
```

2. **Create a virtual environment (recommended):**
```bash
python -m venv venv
```

3. **Activate the virtual environment:**
- Windows:
```bash
venv\Scripts\activate
```
- Mac/Linux:
```bash
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Add your profile image:**
Place your profile photo at `static/images/profile.jpg`

6. **Copy BridgeGen screenshots:**
```bash
xcopy "c:\Users\Aryan Kota\Desktop\project 47\portfolio\public\images\projects\bridgegen\*.png" "static\images\projects\bridgegen\" /I
```

## Running the Application

1. **Start the Flask development server:**
```bash
python app.py
```

2. **Open your browser and visit:**
```
http://localhost:5000
```

The application will run on port 5000 by default.

## Project Structure

```
portfolio-flask/
│
├── app.py                 # Flask application and routes
├── requirements.txt       # Python dependencies
├── README.md             # This file
│
├── templates/            # HTML templates (Jinja2)
│   ├── base.html         # Base template with navigation and footer
│   ├── home.html         # Homepage with hero section
│   ├── about.html        # About page
│   ├── projects.html     # Projects showcase
│   ├── skills.html       # Skills and certifications
│   ├── experience.html   # Experience timeline
│   └── contact.html      # Contact form
│
└── static/               # Static files
    ├── css/
    │   └── style.css     # Main stylesheet
    ├── js/
    │   ├── main.js       # Global JavaScript
    │   ├── hero-animation.js  # Three.js 3D animation
    │   ├── projects.js   # Project cards functionality
    │   └── contact.js    # Contact form handling
    └── images/
        ├── profile.jpg   # Profile photo (add this!)
        └── projects/
            └── bridgegen/  # Project screenshots
```

## Pages

- **Home** (`/`) - Landing page with 3D animation and introduction
- **About** (`/about`) - Personal background and interests
- **Projects** (`/projects`) - Showcase of key projects with expandable details
- **Skills** (`/skills`) - Technical skills and certifications
- **Experience** (`/experience`) - Education and leadership timeline
- **Contact** (`/contact`) - Contact form and social links

## Customization

### Updating Content
- Edit the HTML templates in the `templates/` folder
- Modify styles in `static/css/style.css`
- Update colors and theming in CSS `:root` variables

### Adding Projects
Edit `templates/projects.html` and add a new project card with the same structure.

### Changing 3D Animation
Modify `static/js/hero-animation.js` to customize the Three.js scene.

## Deployment

### Production Considerations
1. Set `debug=False` in `app.py`
2. Use a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn app:app
```

3. Consider hosting on:
- **Heroku** - Easy deployment with Git
- **PythonAnywhere** - Free Python hosting
- **DigitalOcean** - VPS with more control
- **AWS/Google Cloud** - Scalable cloud hosting

## Contact

- **Email:** aryan@akitavault.com
- **GitHub:** [AKTHEPRO47](https://github.com/AKTHEPRO47)
- **LinkedIn:** [Neil Aryan Kota](https://www.linkedin.com/in/neil-aryan-kota-9ab932304/)

## License

© 2026 Neil Aryan Kota. All rights reserved.
