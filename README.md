
# ResumeFlow AI - A Next.js Resume Builder

Welcome to ResumeFlow AI, a powerful resume builder created in Firebase Studio. This application is built with Next.js, ShadCN UI, Tailwind CSS, and Google's Gemini models via Genkit to provide a seamless, AI-powered resume creation experience.

## Features

- **AI-Powered Content Generation**: Automatically generate professional summaries, rewrite job descriptions, and get skill suggestions based on job postings.
- **Real-Time Preview**: Instantly see how your resume looks as you edit it.
- **Multiple Professional Templates**: Choose from a variety of beautifully designed templates (Professional, Modern, Creative, Classic, Minimalist).
- **Customizable Design**: Adjust colors, fonts, and font sizes to match your personal brand.
- **PDF Export**: Preview and download your resume as a high-quality PDF.
- **AI Chatbot**: Get real-time advice and even ask the AI to make direct edits to your resume.
- **Resume Parsing**: Automatically fill out the form by importing an existing PDF resume.

## Getting Started: Running Locally

To run this project on your local machine, follow these steps.

### Prerequisites

- **Node.js**: Make sure you have Node.js (version 18 or later) installed.
- **npm**: This project uses `npm` for package management, which comes with Node.js.
- **Gemini API Key**: The AI features are powered by Google's Gemini. You will need a free API key to use them.
  - Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup and Installation

1.  **Clone the Repository**:
    If you have cloned this repository, navigate to the project directory.

2.  **Create an Environment File**:
    Create a new file in the root of the project named `.env.local`.

3.  **Add Your API Key**:
    Open the `.env.local` file and add your Gemini API key like this:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Install Dependencies**:
    Open a terminal in the project's root directory and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

5.  **Run the Development Server**:
    Once the installation is complete, start the local development server:
    ```bash
    npm run dev
    ```

6.  **View Your App**:
    Open your web browser and navigate to **http://localhost:3000** to see your application live. Any changes you make to the code will be reflected instantly.

### Using the Convenience Script

A shell script, `run-local.sh`, is included to simplify the process. After setting up your `.env.local` file, you can just run:

```bash
bash run-local.sh
```

This will install dependencies and start the development server for you.

## Deployment

This application is pre-configured for easy deployment with **Firebase App Hosting**.

### Prerequisites

- **Firebase Account**: You need a Firebase account. You can create one for free at [firebase.google.com](https://firebase.google.com/).
- **Firebase CLI**: Install the Firebase command-line tools globally on your machine.
  ```bash
  npm install -g firebase-tools
  ```

### Deployment Steps

1.  **Login to Firebase**:
    Authenticate with your Firebase account in the terminal.
    ```bash
    firebase login
    ```

2.  **Initialize Firebase**:
    If you haven't already, initialize Firebase in your project directory.
    ```bash
    firebase init hosting
    ```
    - Follow the prompts:
      - Select **"Use an existing project"** and choose your Firebase project.
      - When asked for your web app's build directory, enter **`.next`**.
      - The `apphosting.yaml` file is already configured, so the CLI will automatically set up the App Hosting backend.

3.  **Deploy Your App**:
    After initialization, deploy your application to Firebase with this single command:
    ```bash
    firebase deploy
    ```

After the deployment is complete, the Firebase CLI will provide you with the URL where your live application is hosted.
