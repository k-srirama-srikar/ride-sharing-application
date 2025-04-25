// src/pages/About.js
import React from 'react';

// Define some basic styles (you could move these to a CSS file/module for larger projects)
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto', // Add top/bottom margin and center horizontally
    padding: '2rem 3rem', // More padding inside
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    backgroundColor: '#f9f9f9', // Light background for the content area
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Subtle shadow
    color: '#333', // Default text color
  },
  heading: {
    textAlign: 'center',
    color: '#0056b3', // A blue heading color
    marginBottom: '1.5rem',
    borderBottom: '2px solid #eee', // Separator line
    paddingBottom: '0.5rem',
  },
  subHeading: {
    color: '#0056b3',
    marginTop: '2rem',
    marginBottom: '1rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.3rem',
  },
  paragraph: {
    marginBottom: '1rem',
    textAlign: 'justify', // Justify text for a cleaner look
  },
  featureList: {
    listStyle: 'disc',
    paddingLeft: '20px',
    marginBottom: '1.5rem',
  },
  teamList: {
    listStyle: 'none', // Remove default bullets
    padding: 0,
  },
  teamMember: {
    backgroundColor: '#ffffff',
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontWeight: 'bold',
  },
  teamId: {
    fontStyle: 'italic',
    color: '#555',
    fontSize: '0.9em',
  }
};

// Team data array
const teamMembers = [
  { name: "Kakaraparty Srirama Srikar", id: "142301013" },
  { name: "Kalava Dheeraj Ram", id: "142301015" },
  { name: "Suryadevara Eswar Sai Ramakrishna", id: "142301034" }
];

const About = () => (
  <div style={styles.container}>
    <h1 style={styles.heading}>About Our Ride Sharing Platform</h1>

    {/* <h2 style={styles.subHeading}>Project Vision</h2>
    <p style={styles.paragraph}>
      This application aims to provide a seamless, efficient, and reliable platform
      connecting riders seeking transportation with available drivers nearby. Our goal is to
      optimize the ride-sharing experience through smart matching, real-time updates,
      and a user-friendly interface, ensuring convenience and safety for both riders and drivers.
    </p>

    <h2 style={styles.subHeading}>Key Features</h2>
    <ul style={styles.featureList}>
      <li>User Registration and Authentication for Riders and Drivers.</li>
      <li>Intuitive Ride Requesting based on current location and destination.</li>
      <li>Intelligent Driver Matching Algorithm (conceptual).</li>
      <li>Real-time Driver Location Tracking on map interface.</li>
      <li>Dynamic Route Calculation and Display using Google Maps API.</li>
      <li>Support for Ride Pooling to optimize resource usage (as demonstrated in tracking).</li>
      <li>(Potential Future Features: Fare Estimation, Ride History, Rating System).</li>
    </ul>

     <h2 style={styles.subHeading}>Project Context</h2>
     <p style={styles.paragraph}>
       This platform was developed as part of a Database Management Systems (DBMS) project,
       focusing on the practical application of database design, data management,
       and system integration concepts within the context of a real-world application scenario.
     </p> */}

    <h2 style={styles.subHeading}>Team Members</h2>
    <h4 style={styles.subHeading}>Project Report will be used in this page</h4>
    <ul style={styles.teamList}>
      {teamMembers.map((member) => (
        <li key={member.id} style={styles.teamMember}>
          <span style={styles.teamName}>{member.name}</span>
          <span style={styles.teamId}>Roll no.: {member.id}</span>
        </li>
      ))}
    </ul>

  </div>
);

export default About;