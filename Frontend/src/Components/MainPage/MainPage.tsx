import { FC, useEffect, useState } from 'react';
import Layout from './layout';
import { Container } from './Styled-Components/MainPage-styles';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import PlaceHolderPhoto from '../../assets/placeholder-photo.jpg';
import { AnimatePresence } from 'motion/react';
import styled from '@emotion/styled';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  dogs: {
    name: string;
    breed: string;
    age: number;
    bio?: string;
    quirks?: string;
    photos?: string[];
  };
}

const BackgroundBlob1 = styled.div`
  height: 200px;
  width: 200px;
  background-color: #f5f5f5;
  border-radius: 71% 29% 65% 35% / 46% 44% 56% 54%;
  opacity: 0.3;
  position: absolute;
  top: 10%;
  right: 15%;
  z-index: 0;
`;

const BackgroundBlob2 = styled.div`
  height: 400px;
  width: 400px;
  background-color: #f5f5f5;
  border-radius: 29% 71% 35% 65% / 44% 46% 54% 56%;
  opacity: 0.3;
  position: absolute;
  bottom: 10%;
  left: 20%;
  z-index: 0;
`;

const BackgroundBlob3 = styled.div`
  height: 250px;
  width: 250px;
  background-color: #f5f5f5;
  border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
  opacity: 0.3;
  position: absolute;
  top: 30%;
  left: 10%;
  z-index: 0;
`;

const BackgroundBlob4 = styled.div`
  height: 200px;
  width: 200px;
  background-color: #f5f5f5;
  border-radius: 42% 58% 37% 63% / 51% 44% 56% 49%;
  opacity: 0.3;
  position: absolute;
  top: 45%;
  right: 45%;
  z-index: 0;
`;

const BackgroundBlob5 = styled.div`
  height: 200px;
  width: 200px;
  background-color: #f5f5f5;
  border-radius: 58% 42% 63% 37% / 44% 51% 49% 56%;
  opacity: 0.3;
  position: absolute;
  bottom: 25%;
  right: 3%;
  z-index: 0;
`;

const BackgroundBlob6 = styled.div`
  height: 180px;
  width: 180px;
  background-color: #f5f5f5;
  border-radius: 37% 63% 51% 49% / 42% 58% 42% 58%;
  opacity: 0.3;
  position: absolute;
  top: 15%;
  left: 30%;
  z-index: 0;
`;

const BackgroundBlob7 = styled.div`
  height: 150px;
  width: 150px;
  background-color: #f5f5f5;
  border-radius: 61% 39% 45% 55% / 48% 52% 48% 52%;
  opacity: 0.3;
  position: absolute;
  top: 25%;
  right: 5%;
  z-index: 0;
`;
const BackgroundBlob8 = styled.div`
  height: 280px;
  width: 280px;
  background-color: #f5f5f5;
  border-radius: 61% 39% 45% 55% / 48% 52% 48% 52%;
  opacity: 0.3;
  position: absolute;
  top: 40%;
  right: 15%;
  z-index: 0;
`;


const MainPage: FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [exitX, setExitX] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setCurrentUser] = useState<User | null>(null);

  // Fetch current user and all users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch current user
        const currentUserResponse = await fetch('https://pawcity.onrender.com/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!currentUserResponse.ok) {
          throw new Error(`HTTP error! status: ${currentUserResponse.status}`);
        }
        
        // Debug the response
        const currentUserText = await currentUserResponse.text();
        console.log('Current user response:', currentUserText);
        
        let currentUserData;
        try {
          currentUserData = JSON.parse(currentUserText);
        } catch (e) {
          console.error('Failed to parse current user JSON:', e);
          return;
        }
        
        setCurrentUser(currentUserData);

        // Fetch all users
        const usersResponse = await fetch('https://pawcity.onrender.com/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }

        // Debug the response
        const usersText = await usersResponse.text();
        console.log('All users response:', usersText);
        
        let usersData;
        try {
          usersData = JSON.parse(usersText);
        } catch (e) {
          console.error('Failed to parse users JSON:', e);
          return;
        }
        
        // Filter out the current user
        const otherUsers = usersData.filter((user: User) => user._id !== currentUserData._id);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const currentProfile = users[currentIndex];

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 100) {
      const direction = offset > 0 ? 1 : -1;
      setExitX(direction * 1000);
      
      if (direction === 1) {
        try {
          const token = localStorage.getItem('token');
          if (!token || !currentProfile) return;

          await fetch(`https://pawcity.onrender.com/matches/${currentProfile._id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log(`✨ Liked ${currentProfile.firstName}'s ${currentProfile.dogs.name}!`);
        } catch (error) {
          console.error('Error creating match:', error);
        }
      } else {
        console.log(`Skipped ${currentProfile.firstName}'s ${currentProfile.dogs.name}`);
      }

      await controls.start({ x: direction * 1000 });
      
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        console.log("You've seen all profiles! Starting over...");
      }
    } else {
      controls.start({ x: 0, y: 0 });
    }
  };

  return (
    <Layout>
      <Container>
        <BackgroundBlob1 />
        <BackgroundBlob2 />
        <BackgroundBlob3 />
        <BackgroundBlob4 />
        <BackgroundBlob5 />
        <BackgroundBlob6 />
        <BackgroundBlob7 />
        <BackgroundBlob8 />
        <div className="flex flex-col items-center justify-center min-h-[500px] relative z-10">
          <div className="mb-4 text-center text-gray-600">
            <p className="text-lg">
              <span className="text-green-500 font-bold">Swipe right</span> to match • 
              <span className="text-red-500 font-bold ml-2">Swipe left</span> to skip
            </p>
          </div>
          <div className="relative w-[400px] h-[600px]">
            <AnimatePresence>
              {users.map((user, index) => (
                index === currentIndex && (
                  <motion.div
                    key={user._id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0, x: exitX }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="absolute cursor-grab active:cursor-grabbing"
                  >
                    <Card className="w-[400px] h-[600px] bg-white shadow-xl overflow-hidden">
                      <div className="h-full flex flex-col">
                        <div className="w-full h-[45%] relative">
                          <img
                            src={user.dogs.photos?.[0] || PlaceHolderPhoto}
                            alt={`${user.dogs.name}'s photo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                          <h2 className="text-4xl font-bold mb-4">{user.dogs.name}</h2>
                          <p className="text-xl text-gray-600 mb-3">
                            <span className="font-bold">Owner:</span> {user.firstName}
                          </p>
                          <p className="text-xl text-gray-600 mb-3">
                            <span className="font-bold">Age:</span> {user.dogs.age}
                          </p>
                          <p className="text-xl text-gray-600 mb-3">
                            <span className="font-bold">Breed:</span> {user.dogs.breed}
                          </p>
                          {user.dogs.quirks && (
                            <p className="text-xl text-gray-600 mb-3">
                              <span className="font-bold">Quirks:</span> {user.dogs.quirks}
                            </p>
                          )}
                          {user.dogs.bio && (
                            <p className="text-lg text-gray-600 italic mt-2 text-center">
                              "{user.dogs.bio}"
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default MainPage;
