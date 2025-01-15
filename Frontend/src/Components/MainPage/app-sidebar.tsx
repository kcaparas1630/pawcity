import { useState, useEffect } from 'react';
import PlaceHolderPhoto from '../../assets/placeholder-photo.jpg';
import { Heart, Trash2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '../ui/sidebar';
import { Card } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { StyledSidebarMenu, StyledSidebarMenuItem, LogoutButton } from './Styled-Components/MainPage-styles';


interface Location {
  streetAddress: string;
  apartmentUnit?: string;
  city: string;
  province: string;
  postalCode: string;
}

interface Dog {
  name: string;
  breed: string;
  age: number;
  bio?: string;
  quirks?: string;
  photos?: string[];
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  photo?: string;
  location: Location;
  dogs: Dog;
  createdAt?: Date;
}

interface Match {
  id: string;
  userId: string;
  firstName: string;
  dogName: string;
  dogPhoto?: string;
  dogAge: number;
  dogBreed: string;
  isMatched: boolean;
}

const MatchedView = ({ 
  user1, 
  user2, 
  setShowMatchedView 
}: { 
  user1: User, 
  user2: User, 
  setShowMatchedView: (value: string | null) => void 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="bg-white p-8 rounded-lg flex flex-col items-center"
    >
      <div className="flex items-center justify-center gap-8">
        {/* First Card - Current User */}
        <Card className="w-[300px] h-[400px] bg-white shadow-xl overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="w-full h-[45%] relative">
              <img
                src={user1.dogs?.photos?.[0] || PlaceHolderPhoto}
                alt={`${user1.dogs?.name}'s photo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-4xl font-bold mb-4 text-center">{user1.dogs.name}</h2>
            </div>
          </div>
        </Card>

        {/* Beating Heart */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-red-500"
        >
          <Heart size={64} fill="currentColor" />
        </motion.div>

        {/* Second Card - Matched User */}
        <Card className="w-[300px] h-[400px] bg-white shadow-xl overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="w-full h-[45%] relative">
              <img
                src={user2.dogs?.photos?.[0] || PlaceHolderPhoto}
                alt="Matched dog's photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-4xl font-bold mb-4 text-center">{user2.dogs.name}</h2>
            </div>
          </div>
        </Card>
      </div>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-red-500 mt-8"
      >
        You have found your woofing match! 
      </motion.p>
      
      <button 
        onClick={() => setShowMatchedView(null)}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchedView, setShowMatchedView] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        // Get the user's token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('https://pawcity.onrender.com/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log('Full user data:', userData);
        console.log('Dog photos array:', userData.dogs?.photos);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('https://pawcity.onrender.com/matches', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch matches');
        const matchesData = await response.json();
        console.log('Matches data:', matchesData);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleMatchToggle = async (matchId: string) => {
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return;
      
      // Update local state
      setMatches(matches.map(m => 
        m.id === matchId ? { ...m, isMatched: !m.isMatched } : m
      ));

      // Show matched view if checked
      if (!match.isMatched) {
        setShowMatchedView(matchId);
      } else {
        setShowMatchedView(null);
      }
      
      console.log('Match toggled successfully!');
    } catch (error) {
      console.error('Error toggling match:', error);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`https://pawcity.onrender.com/matches/${matchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete match');
      
      setMatches(matches.filter(match => match.id !== matchId));
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px'}}>
                  <img
                    src={user.dogs?.photos?.[0] || PlaceHolderPhoto}
                    alt={`${user.dogs?.name || 'Dog'}'s Photo`}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      marginRight: '10px',
                      objectFit: 'cover',
                    }}
                  />
                  <h2 style={{ fontSize: '1.2rem', color: '#333333', fontWeight: '800'}}>{user.firstName}</h2>
                </div>
              ) : (
                <span>Loading...</span>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <StyledSidebarMenu>
                {matches.map((match) => (
                  <StyledSidebarMenuItem key={match.id}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px',
                      borderBottom: '4px solid #e5e7eb',
                      fontSize: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{match.firstName}'s {match.dogName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={match.isMatched}
                          onChange={() => handleMatchToggle(match.id)}
                        />
                        <Trash2
                          onClick={() => handleDeleteMatch(match.id)}
                          style={{ cursor: 'pointer', color: '#e5989b' }}
                          size={20}
                        />
                      </div>
                    </div>
                  </StyledSidebarMenuItem>
                ))}
              </StyledSidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </Sidebar>

      <AnimatePresence>
        {showMatchedView && user && (
          <MatchedView 
            user1={user}
            user2={{
              email: '',
              firstName: matches.find(m => m.id === showMatchedView)?.firstName || '',
              lastName: '',
              location: {
                streetAddress: '',
                city: '',
                province: '',
                postalCode: ''
              },
              dogs: {
                name: matches.find(m => m.id === showMatchedView)?.dogName || '',
                photos: matches.find(m => m.id === showMatchedView)?.dogPhoto ? [matches.find(m => m.id === showMatchedView)!.dogPhoto!] : undefined,
                age: matches.find(m => m.id === showMatchedView)?.dogAge || 0,
                breed: matches.find(m => m.id === showMatchedView)?.dogBreed || '',
              }
            }}
            setShowMatchedView={setShowMatchedView}
          />
        )}
      </AnimatePresence>
    </>
  );
}
