import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserMatchmaker, useMatches } from '@/integrations/supabase';

const Index = () => {
  const userId = '333e05cd-70b9-4455-b15c-928c890bdd02'; // Marius Wilsch's ID
  const { data: user, isLoading: userLoading, error: userError } = useUserMatchmaker(userId);
  const { data: matches, isLoading: matchesLoading, error: matchesError } = useMatches();

  if (userLoading || matchesLoading) return <div>Loading...</div>;
  if (userError) return <div>Error loading user: {userError.message}</div>;
  if (matchesError) return <div>Error loading matches: {matchesError.message}</div>;
  if (!user) return <div>User not found</div>;

  const userMatches = matches?.filter(match => match.user_id === userId) || [];
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-600">MatchMaker</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 p-4">
        {/* Left sidebar */}
        <div className="w-[30%] mr-4">
          <div className="flex flex-col items-center mb-4">
            <Avatar className="w-32 h-32 mb-2">
              <AvatarImage src={user.image_url || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.current_title}</p>
          </div>
          <Card className="mb-4 p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 bg-white rounded-lg">
            <p className="font-bold">Company:</p>
            <p>{user.company_name || 'Veloxforce'}</p>
            <p className="font-bold mt-2">Location:</p>
            <p>{user.location}</p>
            <p className="font-bold mt-2">Industry:</p>
            <p>{user.industry || 'AI/Software'}</p>
          </Card>
          <Card className="mb-4 p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 bg-white rounded-lg">
            <p className="font-bold">Email:</p>
            <p>{user.main_email}</p>
            <p className="font-bold mt-2">LinkedIn:</p>
            <p><a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a></p>
          </Card>
          <Card className="mb-4 p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 bg-white rounded-lg">
            <p className="font-bold">Website:</p>
            <p><a href={user.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Veloxforce</a></p>
            <p className="font-bold mt-2">LinkedIn:</p>
            <p><a href={user.company_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Company Page</a></p>
          </Card>
          <Button className="w-full">Expand Profile</Button>
        </div>

        {/* Main content area */}
        <div className="w-[70%]">
          <Tabs defaultValue="list" className="mb-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="tabs">Tabs View</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Match summaries */}
          {userMatches.map((match) => (
            <Card key={match.id} className="mb-4 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={match.matched_user_image || "/placeholder.svg"} alt={match.matched_user_name} />
                    <AvatarFallback>{match.matched_user_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{match.matched_user_name}</h2>
                    <p className="text-sm text-gray-600">{match.current_title}</p>
                    <p className="text-sm text-gray-600">{match.company_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">Match Score: {match.matching_score}/10</p>
                  <p className="text-sm text-gray-600">{match.location}</p>
                </div>
              </div>
              <p className="mb-2 text-sm"><strong>Industry:</strong> {match.industry}</p>
              <p className="mb-2 text-sm"><strong>Expertise:</strong> {match.areas_of_expertise?.slice(0, 3).join(', ')}</p>
              <p className="mb-2"><strong>Why it's a good match:</strong> {match.explanation}</p>
              <div className="flex justify-end mt-4">
                <Button size="sm" className="mr-2">View Full Profile</Button>
                <Button size="sm" className="mr-2">Connect</Button>
                <Button size="sm" variant="outline" as="a" href={match.matched_user_linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white p-4 shadow-sm">
        <div className="text-center text-sm text-gray-600">
          DataSyncIndicator
        </div>
      </footer>
    </div>
  );
};

export default Index;
