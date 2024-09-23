import { useState, useEffect } from 'react';
import VotesService from '../Services/VotesService';
import { Vote } from '../types/Votetype';

const useVotes = () => {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleVoteReceived = (message: string) => {
            console.log(message);
         
        };

        VotesService.onVoteReceived(handleVoteReceived);

        return () => {
            VotesService.disconnect();
        };
    }, []);

    const voteForIdea = async (vote: Vote) => {
        setIsLoading(true);
        setError(null);
        try {
            await VotesService.voteForIdea(vote);
            setVotes((prevVotes) => [...prevVotes, vote]);
        } catch (err) {
            setError('Error al votar por la idea');
            console.error('Error al votar por la idea:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return { votes, isLoading, error, voteForIdea };
};

export default useVotes;