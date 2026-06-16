$query = "Manchester City home kit 2025 jersey"
$url = "https://www.bing.com/images/search?q=" + [uri]::EscapeDataString($query)
$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
$html = Invoke-RestMethod -Uri $url -Headers $headers
if ($html -match 'murl&quot;:&quot;([^&]+)&quot;') {
    $imgUrl = $matches[1]
    Write-Output "FOUND BING IMAGE: $imgUrl"
} else {
    Write-Output "NOT FOUND"
}
