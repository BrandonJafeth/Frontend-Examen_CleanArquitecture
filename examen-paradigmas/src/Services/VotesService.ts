import axios from 'axios';
import { HubConnectionBuilder, HubConnection, HubConnectionState } from '@microsoft/signalr';
import { Vote } from '../types/Votetype';

class VotesService {
    private apiUrl = 'https://localhost:7201/api/Votes';
    private connection: HubConnection;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7201/ideasHub')
            .withAutomaticReconnect() // Habilitar reconexión automática
            .build();

        this.startConnection();
    }

    private startConnection() {
        if (this.connection.state === HubConnectionState.Disconnected) {
            this.connection.start()
                .then(() => console.log('Conectado a SignalR'))
                .catch(err => {
                    console.error('Error al conectar con SignalR:', err);
                    setTimeout(() => this.startConnection(), 5000); // Intentar reconectar después de 5 segundos
                });
        }

        this.connection.onreconnecting(error => {
            console.warn('SignalR reconectando...', error);
        });

        this.connection.onreconnected(connectionId => {
            console.log('SignalR reconectado. ID de conexión:', connectionId);
        });

        this.connection.onclose(error => {
            console.error('SignalR desconectado. Intentando reconectar...', error);
            setTimeout(() => this.startConnection(), 5000); 
        });
    }

    public async voteForIdea(vote: Vote) {
        try {
            const response = await axios.post(this.apiUrl, vote);
            return response.data;
        } catch (error) {
            console.error('Error al votar por la idea:', error);
            throw error;
        }
    }

    public onVoteReceived(callback: (ideaId: number) => void) {
        this.connection.on('ReceiveVoteNotification', (message: string) => {
            const parts = message.split(' ');
            const ideaId = parseInt(parts[parts.length - 1], 10); 
            if (!isNaN(ideaId)) {
                callback(ideaId);
            } else {
                console.error('Error al extraer el ID de la idea del mensaje:', message);
            }
        });
    }

    public disconnect() {
        this.connection.stop().then(() => console.log('SignalR connection stopped'));
    }
}

export default new VotesService();