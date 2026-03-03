export type Game = 'BGMI' | 'Free Fire' | 'COD Mobile';

export type Category = 
  | 'Battle Royale (Squad)' 
  | 'TDM (4v4)' 
  | 'TDM (2v2)' 
  | '1v1 (Solo)' 
  | 'Team Deathmatch (TDM)' 
  | 'Search & Destroy (S&D)';

export interface GameConfig {
  name: Game;
  image: string;
  categories: {
    name: Category;
    maxSlots: number; // This represents number of Registrations (Teams or Solo)
    fee: number;
    isTeam: boolean;
    minPlayers: number;
    maxPlayers: number;
  }[];
}

export const GAMES_CONFIG: GameConfig[] = [
  {
    name: 'BGMI',
    image: 'https://i.postimg.cc/MZjN5KLN/bgmi.webp',
    categories: [
      { name: 'Battle Royale (Squad)', maxSlots: 128, fee: 100, isTeam: true, minPlayers: 4, maxPlayers: 4 },
      { name: 'TDM (4v4)', maxSlots: 16, fee: 100, isTeam: true, minPlayers: 4, maxPlayers: 4 },
      { name: 'TDM (2v2)', maxSlots: 8, fee: 100, isTeam: true, minPlayers: 2, maxPlayers: 2 },
      { name: '1v1 (Solo)', maxSlots: 40, fee: 50, isTeam: false, minPlayers: 1, maxPlayers: 1 },
    ]
  },
  {
    name: 'Free Fire',
    image: 'https://i.postimg.cc/SKv1Lw75/free-fire.webp',
    categories: [
      { name: 'Battle Royale (Squad)', maxSlots: 52, fee: 100, isTeam: true, minPlayers: 4, maxPlayers: 4 },
      { name: 'TDM (4v4)', maxSlots: 16, fee: 100, isTeam: true, minPlayers: 4, maxPlayers: 4 },
      { name: 'TDM (2v2)', maxSlots: 8, fee: 100, isTeam: true, minPlayers: 2, maxPlayers: 2 },
      { name: '1v1 (Solo)', maxSlots: 32, fee: 50, isTeam: false, minPlayers: 1, maxPlayers: 1 },
    ]
  },
  {
    name: 'COD Mobile',
    image: 'https://i.postimg.cc/c4Rjqk0b/cod.jpg',
    categories: [
      { name: 'Team Deathmatch (TDM)', maxSlots: 20, fee: 100, isTeam: true, minPlayers: 5, maxPlayers: 5 },
    ]
  }
];

export const EVENT_DATE = new Date('2026-03-16T10:00:00');
