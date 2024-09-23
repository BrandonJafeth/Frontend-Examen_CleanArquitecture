import { useState, useEffect } from 'react';
import IdeasService from '../Services/IdeasService';
import VotesService from '../Services/VotesService';
import { Idea } from '../types/Ideatype';

const useIdeas = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await IdeasService.fetchIdeas();
                setIdeas(data);
            } catch (err) {
                setError('Error al cargar las ideas');
                console.error('Error al cargar las ideas:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIdeas();

        const handleVoteReceived = (ideaId: number) => {
            setIdeas(prevIdeas =>
                prevIdeas.map(idea =>
                    idea.id === ideaId ? { ...idea, votesCount: idea.votesCount + 1 } : idea
                )
            );
        };

        VotesService.onVoteReceived(handleVoteReceived);

        return () => {
            VotesService.disconnect();
        };
    }, []);

    return { ideas, isLoading, error };
};

export default useIdeas;