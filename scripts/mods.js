document.addEventListener('DOMContentLoaded', function() {
    const championSearch = document.getElementById('championSearch');
    const championsList = document.getElementById('championsList');
    const postsGrid = document.getElementById('postsGrid');
    let allChampions = [];
    let allPosts = [];

    // Load champions data
    fetch('https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json')
        .then(response => response.json())
        .then(data => {
            allChampions = Object.values(data.data);
            displayChampions(allChampions);
        })
        .catch(error => console.error('Error loading champions:', error));

    // Load posts data (you'll need to implement this based on your data structure)
    function loadPosts() {
        // Example post structure
        allPosts = [
            {
                title: "Chibi Lulu",
                description: "Chibi version of Lulu",
                image: "path_to_image.jpg",
                price: "Free",
                date: "26.09.2025",
                tags: ["champion mod", "pimek"]
            }
            // Add more posts here
        ];
        displayPosts(allPosts);
    }

    function displayChampions(champions) {
        championsList.innerHTML = champions.map(champion => `
            <div class="champion-item" data-champion="${champion.id.toLowerCase()}">
                <img src="https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.id}.png" alt="${champion.name}">
                <span>${champion.name}</span>
            </div>
        `).join('');

        // Add click event listeners
        document.querySelectorAll('.champion-item').forEach(item => {
            item.addEventListener('click', () => {
                const championId = item.dataset.champion;
                filterPostsByChampion(championId);
            });
        });
    }

    function displayPosts(posts) {
        postsGrid.innerHTML = posts.map(post => `
            <div class="post-card">
                <img src="${post.image}" alt="${post.title}" class="post-image">
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <p>${post.description}</p>
                    <div class="post-meta">
                        <span>${post.date}</span>
                        <span>${post.price}</span>
                    </div>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function filterPostsByChampion(championId) {
        const filteredPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(championId) ||
            post.tags.some(tag => tag.toLowerCase().includes(championId))
        );
        displayPosts(filteredPosts);
    }

    // Search functionality
    championSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredChampions = allChampions.filter(champion =>
            champion.name.toLowerCase().includes(searchTerm)
        );
        displayChampions(filteredChampions);
    });

    // Initialize
    loadPosts();
});