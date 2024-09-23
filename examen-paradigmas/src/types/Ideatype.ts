import { Vote } from "./Votetype";

export interface Idea {
    id: number;
    title: string;
    description: string;
    createdBy: string; 
    createdDate: string; 
    votesCount: number;
    votes: Vote[]; 
  }