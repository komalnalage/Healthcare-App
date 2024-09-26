# HealthCare App

### Description

HealthCare is a mobile application that allows users to book appointments with therapists across different healthcare fields such as psychiatry, physical therapy, and more. The app provides two distinct login experiences: one for users and one for therapists. It also supports biometric authentication for enhanced security and includes a calendar feature where users can manage their upcoming appointments.

### Features

- *User Login:* Patients can log in, view therapist profiles, and book appointments.
- *Therapist Login:* Therapists can log in, manage appointments, and update their availability.
- *Appointment Booking:* Users can schedule appointments with therapists from various fields.
- *Biometric Authentication:* Secure login with fingerprint or face recognition.
- *Appointment Calendar:* View, manage, and track upcoming appointments in a personal calendar.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 
- npm or yarn
- React Native CLI
- Android Studio
- Xcode

### Installation

1. Clone the repository:

   git clone https://github.com/komalnalage/Healthcare-App.git

2. Navigate to the project directory:

   cd Healthcare-App

3. Install dependencies:

   npm install  
   or  
   yarn install

### Running the Application

1. *For Android:*

   - Open Android Studio and start an Android emulator.
   - Run: npx react-native run-android

2. *For iOS:*

   - Open ios/HealthCare.xcworkspace in Xcode.
   - Select the desired simulator and click Run, or run: npx react-native run-ios

### Project Structure


.
├── android             
├── ios                
├── src
│   ├── assets         
│   ├── components     
│   ├── navigation     
│   ├── screens        
│   ├── services       
│   ├── utils          
│   └── App.js         
├── package.json        
├── README.md           
└── .gitignore          


### Dependencies

- React Native
- React Navigation
- React Native Biometrics
- Calendar Module

### Contributing

To contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature-name).
3. Commit your changes (git commit -m 'Add your feature').
4. Push the branch (git push origin feature/your-feature-name).
5. Open a Pull Request.

### Contact

For queries or feedback:

- Email: komaldesaikkd05@gmail.com
- GitHub: https://github.com/komalnalage
