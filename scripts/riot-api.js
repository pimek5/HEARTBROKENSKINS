// Riot API integration for League of Legends champions
class RiotAPIManager {
    constructor() {
        this.champions = [];
        this.championsLoaded = false;
        this.baseUrl = 'https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json';
        this.imageBaseUrl = 'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/';
        
        // Start with fallback data immediately
        this.generateFallbackData();
        // Then try to load real data
        this.init();
    }

    async init() {
        try {
            await this.loadChampions();
        } catch (error) {
            console.log('Using fallback data');
        }
    }

    async loadChampions() {
        try {
            console.log('Loading champions from Riot API...');
            const response = await fetch(this.baseUrl);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            this.champions = Object.values(data.data).map(champion => ({
                id: champion.key,
                name: champion.name,
                title: champion.title,
                blurb: champion.blurb,
                tags: champion.tags,
                image: `${this.imageBaseUrl}${champion.image.full}`,
                difficulty: champion.info.difficulty,
                attack: champion.info.attack,
                defense: champion.info.defense,
                magic: champion.info.magic
            }));

            this.championsLoaded = true;
            console.log(`Loaded ${this.champions.length} champions from API`);
            this.generateContentData();
        } catch (error) {
            console.error('Error loading champions from API:', error);
            // Keep using fallback data
        }
    }

    generateContentData() {
        // Convert champions to our content format
        window.contentData = this.champions.map((champion, index) => ({
            id: parseInt(champion.id) || index + 1,
            title: champion.name,
            description: champion.blurb || `${champion.title} - A powerful champion with unique abilities.`,
            category: this.getCategoryFromTags(champion.tags || ['Fighter']),
            type: this.getRandomType(),
            size: this.getSizeFromDifficulty(champion.difficulty || 5),
            tags: (champion.tags || ['Fighter']).map(tag => tag.toLowerCase()),
            image: champion.image,
            championData: {
                title: champion.title,
                difficulty: champion.difficulty || 5,
                attack: champion.attack || 5,
                defense: champion.defense || 5,
                magic: champion.magic || 5
            },
            downloadUrl: "#",
            details: {
                creator: "Riot Games",
                version: "13.24.1",
                compatibility: "League of Legends",
                fileSize: "2.5 MB",
                downloads: Math.floor(Math.random() * 10000).toLocaleString(),
                rating: (4 + Math.random()).toFixed(1) + "/5"
            }
        }));

        console.log(`Generated ${window.contentData.length} content items`);

        // Notify that data is ready
        if (window.contentManager) {
            window.contentManager.dataLoaded();
        } else {
            // Wait for contentManager to be ready
            setTimeout(() => {
                if (window.contentManager) {
                    window.contentManager.dataLoaded();
                }
            }, 1000);
        }
    }

    getCategoryFromTags(tags) {
        const tagMap = {
            'Assassin': 'assassin',
            'Fighter': 'fighter', 
            'Mage': 'mage',
            'Marksman': 'marksman',
            'Support': 'support',
            'Tank': 'tank'
        };
        
        return tagMap[tags[0]] || 'fighter';
    }

    getRandomType() {
        const types = ['free', 'premium', 'limited'];
        return types[Math.floor(Math.random() * types.length)];
    }

    getSizeFromDifficulty(difficulty) {
        if (difficulty <= 3) return 'small';
        if (difficulty <= 7) return 'medium';
        return 'large';
    }

    generateFallbackData() {
        // Extended fallback data with popular champions
        const fallbackChampions = [
            { name: 'Aatrox', title: 'The Darkin Blade', tags: ['Fighter', 'Tank'] },
            { name: 'Ahri', title: 'The Nine-Tailed Fox', tags: ['Mage', 'Assassin'] },
            { name: 'Akali', title: 'The Rogue Assassin', tags: ['Assassin'] },
            { name: 'Akshan', title: 'The Rogue Sentinel', tags: ['Marksman', 'Assassin'] },
            { name: 'Alistar', title: 'The Minotaur', tags: ['Tank', 'Support'] },
            { name: 'Amumu', title: 'The Sad Mummy', tags: ['Tank', 'Mage'] },
            { name: 'Anivia', title: 'The Cryophoenix', tags: ['Mage', 'Support'] },
            { name: 'Annie', title: 'The Dark Child', tags: ['Mage'] },
            { name: 'Aphelios', title: 'The Weapon of the Faithful', tags: ['Marksman'] },
            { name: 'Ashe', title: 'The Frost Archer', tags: ['Marksman', 'Support'] },
            { name: 'Azir', title: 'The Emperor of the Sands', tags: ['Mage', 'Marksman'] },
            { name: 'Bard', title: 'The Wandering Caretaker', tags: ['Support', 'Mage'] },
            { name: 'Blitzcrank', title: 'The Great Steam Golem', tags: ['Tank', 'Fighter'] },
            { name: 'Brand', title: 'The Burning Vengeance', tags: ['Mage'] },
            { name: 'Braum', title: 'The Heart of the Freljord', tags: ['Support', 'Tank'] },
            { name: 'Caitlyn', title: 'The Sheriff of Piltover', tags: ['Marksman'] },
            { name: 'Camille', title: 'The Steel Shadow', tags: ['Fighter', 'Tank'] },
            { name: 'Cassiopeia', title: 'The Serpents Embrace', tags: ['Mage'] },
            { name: 'Darius', title: 'The Hand of Noxus', tags: ['Fighter', 'Tank'] },
            { name: 'Diana', title: 'Scorn of the Moon', tags: ['Fighter', 'Mage'] },
            { name: 'Draven', title: 'The Glorious Executioner', tags: ['Marksman'] },
            { name: 'Ekko', title: 'The Boy Who Shattered Time', tags: ['Assassin', 'Fighter'] },
            { name: 'Elise', title: 'The Spider Queen', tags: ['Mage', 'Fighter'] },
            { name: 'Evelynn', title: 'Agonys Embrace', tags: ['Assassin', 'Mage'] },
            { name: 'Ezreal', title: 'The Prodigal Explorer', tags: ['Marksman', 'Mage'] },
            { name: 'Fiora', title: 'The Grand Duelist', tags: ['Fighter', 'Assassin'] },
            { name: 'Fizz', title: 'The Tidal Trickster', tags: ['Assassin', 'Fighter'] },
            { name: 'Garen', title: 'The Might of Demacia', tags: ['Fighter', 'Tank'] },
            { name: 'Graves', title: 'The Outlaw', tags: ['Marksman'] },
            { name: 'Jinx', title: 'The Loose Cannon', tags: ['Marksman'] },
            { name: 'Katarina', title: 'The Sinister Blade', tags: ['Assassin', 'Mage'] },
            { name: 'Kayn', title: 'The Shadow Reaper', tags: ['Fighter', 'Assassin'] },
            { name: 'Lee Sin', title: 'The Blind Monk', tags: ['Fighter', 'Assassin'] },
            { name: 'Lux', title: 'The Lady of Luminosity', tags: ['Mage', 'Support'] },
            { name: 'Yasuo', title: 'The Unforgiven', tags: ['Fighter', 'Assassin'] },
            { name: 'Zed', title: 'The Master of Shadows', tags: ['Assassin'] }
        ];

        this.champions = fallbackChampions.map((champion, index) => ({
            id: (index + 1).toString(),
            name: champion.name,
            title: champion.title,
            blurb: `${champion.title} - Master this champion to dominate the Rift.`,
            tags: champion.tags,
            image: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.name}.png`,
            difficulty: Math.floor(Math.random() * 7) + 1,
            attack: Math.floor(Math.random() * 8) + 1,
            defense: Math.floor(Math.random() * 8) + 1,
            magic: Math.floor(Math.random() * 8) + 1
        }));

        this.championsLoaded = true;
        console.log(`Generated ${this.champions.length} fallback champions`);
        this.generateContentData();
    }
}

// Initialize the Riot API manager
console.log('Initializing Riot API Manager...');
window.riotAPI = new RiotAPIManager();