const fs = require('fs').promises;

const asciiTitle = `
.___ _______    _________________________    _____________________    _____  _________ _____________________ 
|   |\\      \\  /   _____/\\__    ___/  _  \\   \\__    ___/\\______   \\  /  _  \\ \\_   ___ \\\\_   _____/\\______   \\
|   |/   |   \\ \\_____  \\   |    | /  /_\\  \\    |    |    |       _/ /  /_\\  \\/    \\  \\/ |    __)_  |       _/
|   /    |    \\/        \\  |    |/    |    \\   |    |    |    |   \\/    |    \\     \\____|        \\ |    |   \\
|___\\____|__  /_______  /  |____|\\____|__  /   |____|    |____|_  /\\____|__  /\\______  /_______  / |____|_  /
            \\/        \\/                 \\/                     \\/         \\/        \\/        \\/         \\/
`
console.log(asciiTitle);
console.log("✨ InstaTracer - Mau tau siapa yang unfollow kamu diam diam? \n");

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error membaca ${filename}: ${error.message}`);
        return null;
    }
}

async function findNotFollowingBack() {
    const followersData = await readJSON('data/followers_1.json');
    const followingData = await readJSON('data/following.json');

    if (!followersData || !followingData) {
        console.error("⚠️ Gagal membaca data. Pastikan file JSON tersedia dan formatnya benar.");
        return;
    }

    const followers = followersData.map(entry => entry.string_list_data[0].value);
    const following = followingData.relationships_following.map(entry => entry.string_list_data[0].value);

    const notFollowingBack = following
        .filter(username => !followers.includes(username))
        .map((username, index) => ({
            No: index + 1,
            Username: username,
            Profile_URL: `https://www.instagram.com/${username}/`
        }));

    const notFollowedBy = followers
        .filter(username => !following.includes(username))
        .map((username, index) => ({
            No: index + 1,
            Username: username,
            Profile_URL: `https://www.instagram.com/${username}/`
        }));

    if (notFollowingBack.length === 0) {
        console.log("🎉 Selamat! Semua akun yang kamu follow juga follow kamu kembali!");
    } else {
        const maxUsernameLength = Math.max(...notFollowingBack.map(item => item.Username.length), 10);
        const maxProfileURLLength = Math.max(...notFollowingBack.map(item => item.Profile_URL.length), 30);

        console.log("Who unfollowed you");
        console.log("┌────┬──────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐");
        console.log(`│ No │ ${"Username".padEnd(maxUsernameLength)} │ ${"Profile URL".padEnd(maxProfileURLLength)} │`);
        console.log("├────┼──────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤");

        notFollowingBack.forEach(({ No, Username, Profile_URL }) => {
            console.log(`│ ${String(No).padEnd(2)} │ ${Username.padEnd(maxUsernameLength)} │ ${Profile_URL.padEnd(maxProfileURLLength)} │`);
        });

        console.log("└────┴──────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘");
    }

    if (notFollowedBy.length === 0) {
        console.log("🎉 Semua orang yang follow kamu, sudah kamu follow balik!");
    } else {
        const maxUsernameLength = Math.max(...notFollowedBy.map(item => item.Username.length), 10);
        const maxProfileURLLength = Math.max(...notFollowedBy.map(item => item.Profile_URL.length), 30);

        console.log("\nWho you're not following back");
        console.log("┌────┬──────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐");
        console.log(`│ No │ ${"Username".padEnd(maxUsernameLength)} │ ${"Profile URL".padEnd(maxProfileURLLength)} │`);
        console.log("├────┼──────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤");

        notFollowedBy.forEach(({ No, Username, Profile_URL }) => {
            console.log(`│ ${String(No).padEnd(2)} │ ${Username.padEnd(maxUsernameLength)} │ ${Profile_URL.padEnd(maxProfileURLLength)} │`);
        });

        console.log("└────┴──────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘");
    }
}

findNotFollowingBack();
