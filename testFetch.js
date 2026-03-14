const { fetchSolutionFromGithub } = require('./backend/utils/leetcodeService');

async function test() {
    const slug = 'two-sum';
    console.log(`Testing fetch for slug: ${slug}`);
    const code = await fetchSolutionFromGithub(slug);
    if (code) {
        console.log('SUCCESS! Fetched code snippet:');
        console.log(code.substring(0, 200) + '...');
    } else {
        console.log('FAILED to fetch code.');
    }
}

test();
