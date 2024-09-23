import useIdeas from '../Hooks/useIdeas';
import useVotes from '../Hooks/useVotes';
import { Vote } from '../types/Votetype';
import { useState } from 'react';

const IdeasList = () => {
    const { ideas, isLoading, error } = useIdeas();
    const { voteForIdea } = useVotes();
    const [following, setFollowing] = useState<number[]>([]); 

    const handleVote = (ideaId: number) => {
        const vote: Vote = {
            id: Date.now(), 
            voterName: 'Usuario', 
            ideaId: ideaId
        };
        voteForIdea(vote);
    };

    const handleFollow = (ideaId: number) => {
        setFollowing((prev) => 
            prev.includes(ideaId) ? prev.filter(id => id !== ideaId) : [...prev, ideaId]
        );
    };

    if (isLoading) return <div className="text-center">Cargando...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Ideas de Proyectos</h1>
            <ul className="space-y-4">
                {ideas.map((idea) => (
                    <li key={idea.id} className="p-4 border rounded shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-semibold">{idea.title}</h2>
                        <p className="mt-2 mb-4 text-gray-600">{idea.description}</p>
                        <p className="text-sm text-gray-500">Creado por: {idea.createdBy}</p>
                        <p className="text-sm text-gray-500">Fecha: {new Date(idea.createdDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Votos: {idea.votesCount}</p>
                        <div className="flex items-center mt-4 space-x-4">
                            <button
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() => handleVote(idea.id)}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                Like
                            </button>
                            <button
                                className={`flex items-center px-4 py-2 ${
                                    following.includes(idea.id)
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400`}
                                onClick={() => handleFollow(idea.id)}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                {following.includes(idea.id) ? 'Siguiendo' : 'Seguir'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IdeasList;
