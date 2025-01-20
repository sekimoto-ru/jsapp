<?php
// リファラーとXMLHttpRequestチェック
$isXhr = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$isValidReferer = strpos($referer, $_SERVER['HTTP_HOST']) !== false;

if (!$isXhr || !$isValidReferer) {
    // 直接アクセスやXHR以外のリクエストを拒否
    header('HTTP/1.0 403 Forbidden');
    exit('Access denied');
}

// Get Google OAuth2.0 credentials from environment variable
$client_id = getenv('GOOGLE_CLIENT_ID');

if (!$client_id) {
    header('HTTP/1.0 500 Internal Server Error');
    exit('GOOGLE_CLIENT_ID environment variable is not set');
}

// Output client ID as JSON for JavaScript to consume
header('Content-Type: application/json');
echo json_encode(['client_id' => $client_id]);
