# 🌌 Gadi Rapaport | Interactive AI Portfolio 2.0

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-2.4.0-blue)
![Role](https://img.shields.io/badge/Role-DevOps%20%26%20AI-red)

ברוכים הבאים לפורטפוליו האינטראקטיבי שלי. זהו לא סתם אתר "כרטיס ביקור", אלא מערכת המשלבת גרפיקה תלת-ממדית (WebGL), בינה מלאכותית לזיהוי מחוות ידיים בזמן אמת, וטרמינל פקודות מלא המדמה סביבת עבודה של DevOps Engineer.

## 🚀 תכונות מרכזיות (Key Features)

### 1. **Interactive Particle Galaxy**
מערכת של מעל 14,000 חלקיקים המנוהלת באמצעות **Three.js**. הגלקסיה מגיבה לתנועת העכבר ולגלילה, ומשנה את צורתה וצבעה בהתאם לפעולות המשתמש.

### 2. **AI Hand Tracking (MediaPipe)**
באמצעות ספריית MediaPipe של Google, האתר מאפשר שליטה בחלקיקים ללא מגע:
* **🖐️ יד פתוחה:** החלקיקים נמשכים אל כף היד ויוצרים "ענן" מרחף.
* **✊ אגרוף קמוץ:** החלקיקים מתגבשים לכדור אנרגיה סגול ומרוכז (Cyber Sphere).

### 3. **DevOps Style Terminal**
טרמינל פקודות (Shell) מובנה המאפשר ניווט באתר, הורדת קורות חיים, ובדיקת סטטוסים של קונטיינרים דמיוניים (Docker/K8s). 

### 4. **Special Commands**
* **`render <text>`**: הטרמינל נעלם, והחלקיקים מסתדרים במרחב התלת-ממדי כדי ליצור את המילה שכתבתם.
* **`matrix`**: מצב האקרים שמשנה את כל האתר לצבעי ירוק-זוהר והופך את הגלקסיה ל"גשם קוד" נופל.
* **`clear`**: ניקוי מסך הטרמינל.

## 🛠 טכנולוגיות (Tech Stack)

* **Frontend:** HTML5, CSS3 (Modern UI/UX).
* **Animation:** [GSAP](https://greensock.com/gsap/) (ScrollTrigger, TextPlugin).
* **3D Engine:** [Three.js](https://threejs.org/) (WebGL).
* **AI/ML:** [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html).
* **Data:** JSON based command system.

## 📦 התקנה והרצה (Setup)

1.  שכפל את הרפוזיטורי:
    ```bash
    git clone [https://github.com/gad-rapaport/portfolio.git](https://github.com/gad-rapaport/portfolio.git)
    ```
2.  ודא שקובץ ה-`commands.json` נמצא באותה תיקייה עם ה-`index.html`.
3.  הרץ את האתר באמצעות שרת מקומי (Live Server ב-VS Code או פקודת `python -m http.server`).

> **הערה:** לשימוש ביכולות ה-AI, יש לאשר גישה למצלמה בדפדפן. כל עיבוד הוידאו מתבצע מקומית במכשיר שלך ואינו נשמר בשום מקום (Privacy First).

## 👨‍💻 אודותיי

אני **גדי רפפורט**, סטודנט לדבאופס ומפתח אפליקציות המתמחה בשילוב של תשתיות ענן חזקות עם פתרונות AI מתקדמים. הפרויקט הזה מייצג את התשוקה שלי לחדשנות ולחוויית משתמש יוצאת דופן.

---
*Created with ❤️ by Gadi Rapaport - 2026*
