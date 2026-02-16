// AI Chatbot functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('aiChatContainer');
    const chatToggle = document.getElementById('aiChatToggle');
    const chatMessages = document.getElementById('aiChatMessages');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const closeBtn = document.getElementById('aiCloseBtn');

    // Knowledge base about Aryan
    const knowledge = {
        name: "Neil Aryan Kota",
        title: "AI & Analytics Student | Product Builder | Aspiring Entrepreneur",
        email: "aryan@akitavault.com",
        github: "https://github.com/AKTHEPRO47",
        linkedin: "https://www.linkedin.com/in/neil-aryan-kota-9ab932304/",
        
        projects: {
            akitavault: {
                name: "AkitaVault",
                role: "CEO & Founder",
                description: "AI-powered web filtering and parental control platform featuring smart content analysis, real-time URL blocking, and comprehensive monitoring dashboard. As CEO & Founder, leading product development and business strategy.",
                tech: ["React", "Vite", "Tailwind CSS", "Firebase", "Python", "Machine Learning"],
                highlights: ["87.3% accuracy in content classification", "Real-time threat detection", "Machine learning models"]
            },
            cricketgame: {
                name: "Mini Cricket Game",
                description: "Extensive Python-based cricket simulation with overs, wickets, strategic shot selection, and dynamic commentary in a terminal-first experience.",
                tech: ["Python", "OOP", "CLI"],
                highlights: ["Multiple match modes", "Ball-by-ball commentary", "Scorecards and targets"]
            },
            bridgegen: {
                name: "BridgeGen",
                description: "Full-stack web application bridging Singapore's elderly and youth populations through collaborative features, gamification, and cultural exchange.",
                tech: ["HTML", "JavaScript", "Bootstrap", "Python", "Flask", "SQLite"],
                highlights: ["Dual user system", "Tech help matching", "Cooking game with 25 recipes", "Voice commands", "Points & rewards system"]
            },
            findustry: {
                name: "Findustry",
                description: "B2B marketplace platform connecting importers with businesses through smart matching and streamlined discovery.",
                tech: ["React", "Vite", "Tailwind CSS", "Firebase"],
                highlights: ["Smart matching algorithm", "Advanced filtering", "ChatGPT-inspired UI"]
            },
            sgresolve: {
                name: "SGResolve",
                description: "Singapore government initiative dispute resolution platform with AI-powered recommendations.",
                tech: ["Python", "Flask", "PostgreSQL", "HTML/CSS", "JavaScript"],
                highlights: ["AI recommendations", "Multi-party mediation", "Secure document management"]
            }
        },
        
        skills: {
            frontend: ["React", "Vite", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
            backend: ["Python", "Flask", "Node.js", "Express", "RESTful APIs"],
            database: ["Firebase", "Firestore", "Oracle SQL", "PostgreSQL", "SQLite"],
            ai: ["Machine Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
            tools: ["Git", "VS Code", "Figma", "Postman", "Docker"]
        },
        
        experience: [
            {
                role: "AI Research Intern",
                company: "Tech Innovation Lab",
                period: "2025 - Present",
                description: "Developing machine learning models for content classification"
            }
        ]
    };

    // AI Response generator
    function generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        
        // Greetings
        if (msg.match(/^(hi|hello|hey|greetings)/)) {
            return `Hello! I'm Aryan's AI assistant. I can help you learn about his projects, skills, experience, and more. What would you like to know?`;
        }
        
        // About Aryan
        if (msg.includes('who') && (msg.includes('you') || msg.includes('aryan'))) {
            return `${knowledge.name} is an ${knowledge.title}. He's passionate about building technology solutions that address real-world problems, from AI-powered safety platforms to intergenerational engagement systems.`;
        }
        
        // Contact info
        if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
            return `You can reach Aryan at:\n📧 ${knowledge.email}\n💼 LinkedIn: ${knowledge.linkedin}\n🐙 GitHub: ${knowledge.github}`;
        }
        
        // Projects
        if (msg.includes('project')) {
            if (msg.includes('akitavault') || msg.includes('vault')) {
                const p = knowledge.projects.akitavault;
                return `**${p.name}**\n${p.description}\n\n🛠️ Tech: ${p.tech.join(', ')}\n\n✨ Key highlights:\n${p.highlights.map(h => '• ' + h).join('\n')}`;
            }
            if (msg.includes('bridgegen') || msg.includes('bridge')) {
                const p = knowledge.projects.bridgegen;
                return `**${p.name}**\n${p.description}\n\n🛠️ Tech: ${p.tech.join(', ')}\n\n✨ Key features:\n${p.highlights.map(h => '• ' + h).join('\n')}`;
            }
            if (msg.includes('findustry')) {
                const p = knowledge.projects.findustry;
                return `**${p.name}**\n${p.description}\n\n🛠️ Tech: ${p.tech.join(', ')}\n\n✨ Highlights:\n${p.highlights.map(h => '• ' + h).join('\n')}`;
            }
            return `Aryan has built several impressive projects:\n\n🛡️ **AkitaVault** - AI-powered web filtering platform\n🌉 **BridgeGen** - Intergenerational connection platform\n💼 **Findustry** - B2B marketplace\n⚖️ **SGResolve** - Dispute resolution platform\n\nAsk me about any specific project!`;
        }
        
        // Skills
        if (msg.includes('skill') || msg.includes('technology') || msg.includes('tech stack')) {
            return `Aryan's technical skills include:\n\n**Frontend:** ${knowledge.skills.frontend.join(', ')}\n\n**Backend:** ${knowledge.skills.backend.join(', ')}\n\n**AI/ML:** ${knowledge.skills.ai.join(', ')}\n\n**Databases:** ${knowledge.skills.database.join(', ')}`;
        }
        
        // Experience
        if (msg.includes('experience') || msg.includes('work') || msg.includes('job')) {
            return `Aryan is currently an **AI Research Intern at Tech Innovation Lab** (2025 - Present), developing machine learning models for content classification. He also has experience building full-stack applications and leading technical projects.`;
        }
        
        // AI/ML specific
        if (msg.includes('machine learning') || msg.includes('ai') || msg.includes('ml')) {
            return `Aryan has strong experience in AI/ML! He's worked with:\n• Machine Learning classification models (87.3% accuracy)\n• TensorFlow and PyTorch\n• NLP and Computer Vision\n• Real-time AI-powered content filtering\n\nHis AkitaVault project showcases advanced ML implementation for web content analysis.`;
        }
        
        // React/Frontend
        if (msg.includes('react') || msg.includes('frontend')) {
            return `Aryan is proficient in modern frontend development! He's built projects using:\n• React with Vite\n• Tailwind CSS for styling\n• TypeScript for type safety\n• Firebase for backend services\n\nCheck out his Findustry and AkitaVault projects to see his React skills in action!`;
        }
        
        // Python/Backend
        if (msg.includes('python') || msg.includes('flask') || msg.includes('backend')) {
            return `Aryan has strong Python/Flask backend experience:\n• Built BridgeGen using Flask\n• SGResolve dispute resolution platform\n• RESTful API development\n• Database integration (SQLite, PostgreSQL)\n• Authentication systems`;
        }
        
        // Specific tech questions
        if (msg.includes('firebase')) {
            return `Aryan uses Firebase extensively in his projects like AkitaVault and Findustry for:\n• Real-time database (Firestore)\n• Authentication\n• Cloud Functions\n• Hosting and deployment`;
        }
        
        // Help/Capabilities
        if (msg.includes('help') || msg.includes('can you') || msg.includes('what can')) {
            return `I can help you with:\n\n✅ Learn about Aryan's projects and technical skills\n✅ Understand his experience and background\n✅ Get contact information\n✅ Explore specific technologies he uses\n✅ Answer questions about his work\n\nJust ask me anything!`;
        }
        
        // Default fallback
        return `I'm not sure about that specific question, but I'd be happy to tell you about:\n\n• Aryan's **projects** (AkitaVault, BridgeGen, Findustry, SGResolve)\n• His **skills** (React, Python, AI/ML, etc.)\n• His **experience** and background\n• How to **contact** him\n\nWhat would you like to know?`;
    }

    // Toggle chat
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
            if (chatContainer.classList.contains('active')) {
                chatInput.focus();
            }
        });
    }

    // Close chat
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });
    }

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot typing';
        typingDiv.innerHTML = '<div class=\"message-content\"><span class=\"typing-dot\"></span><span class=\"typing-dot\"></span><span class=\"typing-dot\"></span></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Generate response
        setTimeout(() => {
            typingDiv.remove();
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
