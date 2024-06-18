import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase'; // Adjust the path as per your project structure

export default function AppDevelopment() {
  const [appData, setAppData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appDevelopment'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAppData(data);
      } catch (error) {
        console.error('Error fetching app development data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>App Development Data</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Website Name</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appData.map((item) => (
            <tr key={item.id}>
              <td>{item.fullName}</td>
              <td>{item.websiteName}</td>
              <td>{item.registrationDate}</td>
              <td>
                <Link to={`/app-development/${item.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
