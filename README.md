# Heartbyte Chapter Splitter

This is a web app that lets users upload `.txt` files and split them into chapters. You can split chapters automatically or manually, and you can also merge chapters.

---

## Features

- Upload `.txt` novel files
- Auto-detect chapter headings like “Chapter 1” or “CHAPTER TWO”
- Insert `====SPLIT CHAPTER====` anywhere to split manually
- Split one chapter into many using the markers
- Merge the current chapter with the next one
- Clean, simple interface inspired by the Figma design

---

## Tech Stack

- Next.js 14
- Tailwind CSS
- NextUI
- TypeScript
- Framer Motion
- Next Themes

---

## Sample Files

There are sample `.txt` files in the `input-txt/` folder to test chapter detection.

---

## How to Run

1. Clone the repo:

git clone https://github.com/your-username/heartbyte-chapter-splitter.git
cd heartbyte-chapter-splitter

2. Install dependencies:

npm install


3. Start the development server:

npm run dev


Then go to `http://localhost:3000` in your browser.

---

## About

Built by Irfan Rahman for the HeartByte SWE Internship OA.
