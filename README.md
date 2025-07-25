<<<<<<< HEAD
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cef5ebd8-8054-4fae-84d5-4cc6868e96de

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cef5ebd8-8054-4fae-84d5-4cc6868e96de) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cef5ebd8-8054-4fae-84d5-4cc6868e96de) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
=======
#  SmartSlot – AI-Powered Hospital Queue System

>  Reimagining hospital wait experiences with intelligent triage, real-time transparency, and streamlined patient flow.

---

##  Problem Statement

Hospitals today face significant challenges in managing outpatient queues:

-  Endless Waits: Patients wait for hours with no visibility or time estimates.
-  Chaotic Crowds: Overcrowded lobbies cause confusion, distress, and health risks.
-  Zero Transparency: No real-time updates for patients or staff.
-  Overworked Staff: Manual queue management stresses hospital teams.
-  Patient Dissatisfaction: Leads to reduced trust, negative reviews, and inefficient operations.

---

##  Solution Overview

SmartSlot is a smart, AI-powered hospital queue management prototype built to:

-  Deliver real-time queue transparency to patients and staff.
-  Optimize triage and resource allocation using AI.
-  Enable proactive communication via chatbots and voice assistants.
-  Provide actionable analytics to continuously improve operations.
-  Streamline entry, reduce crowding, and enhance trust.

---

##  Key Features (MVP Focus)

 Smart AI-Based Triage: Patients are classified intelligently based on urgency.

 Real-Time Queue Updates: Patients can view live wait times and their position in the queue.

 Predictive Wait-Time Estimates: Estimate how long a patient will wait based on queue load and condition.

 Chatbot & Voice Integration: Patients can ask queue-related queries through natural conversation.

 Personalized Dashboards: Simple interfaces for both patients and hospital staff.

 Alerts & Notifications: Automatic updates or emergency alerts.

 Data-Driven Insights: Visualized queue performance metrics for admins.

---

##  Tech Stack (Simplified for MVP)

| Component                   | Tech Used                                    | Purpose                                                 |
|-----------------------------|----------------------------------------------|---------------------------------------------------------|
|  AI & NLP                   | Gemini 1.5 Pro (Vertex AI), Tesseract OCR    | Queue triage, OCR scanning of physical tokens           |    
|  Conversational AI          | Vertex AI Agent Builder + Custom NLP         | Handle chat/voice interactions with patients            |
|  Authentication             | Firebase Auth                                | Secure patient & staff login                            |
|  Web Dashboard              | React.js                                     | Interactive patient/staff front-end                     |
|  Visualizations             | Chart.js                                     | Real-time queue stats                                   |
|   Hosting & Backend         | Firebase Hosting + Cloud Functions           | Host app, lightweight backend logic                     |
|  Scalable APIs              | Cloud Run (Flask/Node.js)                    | REST APIs for bookings, priority logic                  |
|  Analytics & Storage        | BigQuery                                     | Historical queue data, analytics & dashboards           |

---

##  Demo Walkthrough (for Hackathon MVP)

1. User opens SmartSlot on web or hospital kiosk.
2. Authenticates securely.
3. AI Triage: System asks a few questions to assess urgency.
4. Queue Ticket Generated with estimated time.
5. Patient can:
   - See live queue updates
   - Chat with bot to ask about delays or reschedule
   - Receive emergency alerts if needed
6. Hospital staff see analytics dashboard with live queue status.

---

##  Installation & Setup (For MVP Review)

```bash
# Clone the repo
https://github.com/Ebenezer-03/SmartSlot
cd smartslot-mvp

# Frontend
cd client
npm install
npm start

# Backend (Optional for live APIs)
cd server
npm install
npm run dev
```

---

##  Sample Screens (Add visuals here in actual repo)

-  Patient Queue Dashboard
-  Staff Admin Panel
-  Chatbot Conversation Sample
-  Triage Flow Form

---

##  Team SmartSlot

| Name             | Role                     | GitHub             |
|------------------|--------------------------|--------------------|
| GR Nitheshraj    | AI & Backend Developer | github.com/member1   |
| G Priyadharsan   | Frontend Developer     | github.com/member2   |
| Dharun Krishna T | UI/UX & Docs           | github.com/member3   |

Contact: 

---

##  Submission Checklist

-  GitHub Repo with full MVP code
-  Google Form with GitHub + Demo Video link
-  README.md with documentation
-   Live Hosted Link or Screenshots

---

##  Pitch Video Script (Summary)

"Hi, we’re Team SmartSlot and we’re solving hospital queue chaos using AI. With real-time tracking, automated triage, and chatbot assistance, we make the patient journey more transparent and less stressful. Here's how it works… [https://drive.google.com/file/d/1g8g-uuhcn79Rhjx93rF7vDesWfIWFJ5L/view]. Thanks for watching!"

---

Let’s make hospitals faster, calmer, and smarter.
>>>>>>> 39014f39908e09a4aeb98505a8f233cb0d2049fe
