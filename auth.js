// OAuth2.0 scope for basic profile information
const SCOPES = 'https://www.googleapis.com/auth/userinfo.profile';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let clientId = '';

// PHP設定からクライアントIDを取得
fetch('config.php', {
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})
    .then(response => response.json())
    .then(data => {
        clientId = data.client_id;
        gisLoaded();
    })
    .catch(error => console.error('クライアントIDの読み込みエラー:', error));

// Google APIクライアントの初期化
function gapiLoaded() {
    console.log('GAPI loaded');
    gapi.load('client', async () => {
        try {
            await initializeGapiClient();
        } catch (e) {
            console.error('GAPI initialization error:', e);
        }
    });
}

async function initializeGapiClient() {
    console.log('Initializing GAPI client');
    await gapi.client.init({
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest']
    });
    console.log('GAPI client initialized');
    gapiInited = true;
    maybeEnableButtons();
}

// Google Identity Servicesの初期化
function gisLoaded() {
    console.log('GIS loaded, clientId:', clientId ? 'present' : 'missing');
    if (!clientId) {
        console.log('Waiting for clientId...');
        return;
    }
    
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: SCOPES,
            callback: handleAuthResponse
        });
        console.log('Token client initialized');
        gisInited = true;
        maybeEnableButtons();
    } catch (e) {
        console.error('Error initializing token client:', e);
    }
}

// 両APIが初期化されたらボタンを有効化
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('loginButton').classList.remove('hidden');
    }
}

// 認証レスポンスの処理
function handleAuthResponse(response) {
    console.log('Auth response received:', response);
    if (response.error !== undefined) {
        console.error('認証エラー:', response);
        return;
    }
    console.log('Authentication successful, fetching user info');
    
    // アクセストークンを使用してユーザー情報を取得
    gapi.client.oauth2.userinfo.get().then(
        function(response) {
            const userInfo = response.result;
            // Remove hidden class and set display style directly
            const loginStatus = document.getElementById('loginStatus');
            const loginMessage = document.getElementById('loginMessage');
            const userInfoElement = document.getElementById('userInfo');
            
            loginStatus.classList.add('hidden');
            loginStatus.style.display = 'none';
            
            loginMessage.classList.remove('hidden');
            loginMessage.style.display = 'block';
            
            userInfoElement.classList.remove('hidden');
            userInfoElement.style.display = 'block';
            
            // 日本語でユーザー情報を表示
            const displayInfo = {
                "名前": userInfo.name,
                "プロフィール画像": userInfo.picture,
                "ロケール": userInfo.locale
            };
            
            document.getElementById('userInfoContent').textContent = 
                JSON.stringify(displayInfo, null, 2);
        },
        function(error) {
            console.error('ユーザー情報の取得に失敗しました:', error);
        }
    );
}

// ログインボタンのクリックハンドラー
function handleAuthClick() {
    tokenClient.requestAccessToken();
}

// ログアウトボタンのクリックハンドラー
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        const loginStatus = document.getElementById('loginStatus');
        const loginMessage = document.getElementById('loginMessage');
        const userInfoElement = document.getElementById('userInfo');

        loginMessage.classList.add('hidden');
        loginMessage.style.display = 'none';
        
        userInfoElement.classList.add('hidden');
        userInfoElement.style.display = 'none';
        
        loginStatus.classList.remove('hidden');
        loginStatus.style.display = 'block';
    }
}
