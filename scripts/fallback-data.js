// Simple fallback data to ensure champions load
console.log('Loading simple fallback data...');

window.contentData = [
    {
        id: 1,
        title: "Aatrox",
        description: "A powerful warrior champion with dark abilities.",
        category: "fighter",
        type: "premium",
        size: "large",
        tags: ["fighter", "tank"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.5 MB",
            downloads: "12,431",
            rating: "4.8/5"
        }
    },
    {
        id: 2,
        title: "Ahri",
        description: "A magical champion with charm and mobility.",
        category: "mage",
        type: "free",
        size: "medium",
        tags: ["mage", "assassin"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Ahri.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.8 MB",
            downloads: "18,892",
            rating: "4.6/5"
        }
    },
    {
        id: 3,
        title: "Akali",
        description: "A stealthy ninja with deadly precision.",
        category: "assassin",
        type: "premium",
        size: "hard",
        tags: ["assassin", "ninja"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Akali.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "3.1 MB",
            downloads: "15,267",
            rating: "4.7/5"
        }
    },
    {
        id: 4,
        title: "Akshan",
        description: "A marksman seeking justice and redemption.",
        category: "marksman",
        type: "limited",
        size: "medium",
        tags: ["marksman", "assassin"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Akshan.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.9 MB",
            downloads: "8,934",
            rating: "4.5/5"
        }
    },
    {
        id: 5,
        title: "Alistar",
        description: "A tanky support champion with crowd control.",
        category: "tank",
        type: "free",
        size: "medium",
        tags: ["tank", "support"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Alistar.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.3 MB",
            downloads: "22,156",
            rating: "4.4/5"
        }
    },
    {
        id: 6,
        title: "Amumu",
        description: "A tank mage with area of effect abilities.",
        category: "tank",
        type: "free",
        size: "easy",
        tags: ["tank", "mage"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Amumu.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.1 MB",
            downloads: "19,743",
            rating: "4.3/5"
        }
    },
    {
        id: 7,
        title: "Jinx",
        description: "A chaotic marksman with explosive power.",
        category: "marksman",
        type: "premium",
        size: "medium",
        tags: ["marksman", "chaos"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Jinx.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "3.2 MB",
            downloads: "25,891",
            rating: "4.9/5"
        }
    },
    {
        id: 8,
        title: "Yasuo",
        description: "A wind-based fighter with high mobility.",
        category: "fighter",
        type: "premium",
        size: "hard",
        tags: ["fighter", "assassin"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Yasuo.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "3.0 MB",
            downloads: "31,245",
            rating: "4.6/5"
        }
    },
    {
        id: 9,
        title: "Lux",
        description: "A light-wielding mage with powerful abilities.",
        category: "mage",
        type: "free",
        size: "medium",
        tags: ["mage", "support"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Lux.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.7 MB",
            downloads: "28,567",
            rating: "4.7/5"
        }
    },
    {
        id: 10,
        title: "Zed",
        description: "A shadow-based assassin with high mobility.",
        category: "assassin",
        type: "premium",
        size: "hard",
        tags: ["assassin", "shadow"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Zed.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "3.3 MB",
            downloads: "22,834",
            rating: "4.8/5"
        }
    },
    {
        id: 11,
        title: "Garen",
        description: "A tanky fighter with defensive abilities.",
        category: "fighter",
        type: "free",
        size: "easy",
        tags: ["fighter", "tank"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Garen.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.4 MB",
            downloads: "35,123",
            rating: "4.5/5"
        }
    },
    {
        id: 12,
        title: "Ashe",
        description: "A frost archer marksman with crowd control.",
        category: "marksman",
        type: "free",
        size: "easy",
        tags: ["marksman", "support"],
        image: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Ashe.png",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "13.24.1",
            compatibility: "League of Legends",
            fileSize: "2.6 MB",
            downloads: "41,892",
            rating: "4.4/5"
        }
    }
];

console.log('Fallback data loaded:', window.contentData.length, 'champions');

// Trigger content manager if it exists
if (window.contentManager) {
    window.contentManager.dataLoaded();
}