import axios from 'axios';
import { Idea } from '../types/Ideatype';

class IdeasService {
    private apiUrl = 'https://localhost:7201/api/Ideas';

    public async fetchIdeas(): Promise<Idea[]> {
        try {
            const response = await axios.get<Idea[]>(this.apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las ideas:', error);
            throw error;
        }
    }
}

export default new IdeasService();