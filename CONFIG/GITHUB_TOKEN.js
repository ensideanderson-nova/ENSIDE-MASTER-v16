// Token GitHub para integração com IA e sistema ENSIDE
const GITHUB_CONFIG = {
    token: 'Github_pat_11B2HPWRQ0jAY7HwKQQBR9_XBQOZWISGDOf45h8a0ByyrbMlfw2r3peS4J2IGNQax3HOF6FYPXFVRng6A8',
    owner: 'ensideanderson-nova',
    repo: 'ENSIDE-MASTER-v16',
    branch: 'main'
};

// Função para usar o token em requisições
async function githubAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`https://api.github.com${endpoint}`, options);
    return response.json();
}

// Exportar para uso global
window.GITHUB_CONFIG = GITHUB_CONFIG;
window.githubAPI = githubAPI;
console.log('✅ GitHub Token integrado com sucesso!');
