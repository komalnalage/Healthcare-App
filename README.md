

# HealthCare App

## Description
HealthCare is a mobile application designed to streamline the process of booking appointments with therapists across various healthcare fields, including psychiatry, physical therapy, and more. The application provides a user-friendly interface for both patients and therapists, offering distinct login experiences tailored to each group's needs. With added security features like biometric authentication, users can log in securely using their fingerprint or face recognition. The app also includes a comprehensive calendar feature that enables users to manage and track their upcoming appointments seamlessly.

## Features
### User Features
- **User Login:** Patients can easily log in to their accounts, where they can:
  - View detailed profiles of therapists, including their specialties, experience, and availability.
  - Book, reschedule, or cancel appointments with just a few taps.
  - Access a personalized dashboard to view past and upcoming appointments.
  
- **Appointment Booking:** Users can:
  - Schedule appointments with therapists across different healthcare fields.
  - Receive notifications and reminders about upcoming appointments.
  
- **Appointment Calendar:** Users can:
  - View, manage, and track all upcoming appointments in a personal calendar.
  - Sync their appointments with their device's native calendar (Google Calendar, iCal, etc.).

### Therapist Features
- **Therapist Login:** Therapists can:
  - Manage their profiles, including specialties and availability.
  - View a list of upcoming appointments and patient details.
  - Communicate with patients directly through the app.

- **Availability Management:** Therapists can:
  - Set and update their availability to ensure patients can only book during open slots.
  - Block out specific times for personal appointments or time off.

### Security Features
- **Biometric Authentication:** Users can log in using:
  - Fingerprint recognition for quick and secure access.
  - Face recognition to enhance security further.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- npm or yarn
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)

## Installation
1. **Clone the repository:**
   git clone https://github.com/komalnalage/Healthcare-App.git

2. **Navigate to the project directory:**
   cd Healthcare-App

3. **Install dependencies:**
   npm install
   or
   yarn install

## Running the Application

### For Android:
1. Open Android Studio and start an Android emulator.
2. Run the application:
   npx react-native run-android


## Project Structure

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

## Dependencies
The project relies on several key libraries:
- **React Native:** The core framework for building the mobile application.
- **React Navigation:** For managing navigation within the app.
- **React Native Biometrics:** For implementing biometric authentication.
- **Calendar Module:** To enable the appointment calendar functionality.

## Contributing
We welcome contributions to enhance the app! To contribute:
1. **Fork the repository.**

2. **Create a new branch:**
   git checkout -b feature/your-feature-name

3. **Make your changes and commit:**
   git commit -m 'Add your feature'

4. **Push the branch to your fork:**
   git push origin feature/your-feature-name

5. **Open a Pull Request** to the main repository.

### Code of Conduct
Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) when contributing to this project.

## Contact
For queries, feedback, or support, feel free to reach out:
- **Email:** [komaldesaikkd05@gmail.com](mailto:komaldesaikkd05@gmail.com)
- **GitHub:** [komalnalage](https://github.com/komalnalage)

