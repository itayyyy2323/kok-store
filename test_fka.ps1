$query = "site:footballkitarchive.com Manchester City 2024-25 home kit"
$encodedQuery = [uri]::EscapeDataString($query)
$url = "https://www.bing.com/search?q=$encodedQuery"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
$html = Invoke-RestMethod -Uri $url -Headers $headers

# extract URLs from Bing results
$html -match 'href="https://www.footballkitarchive.com/([^"]+)"'
if ($matches) {
    $pageUrl = "https://www.footballkitarchive.com/" + $matches[1]
    Write-Host "Found page: $pageUrl"
    $pageHtml = Invoke-RestMethod -Uri $pageUrl -Headers $headers
    
    if ($pageHtml -match '<meta property="og:image" content="([^"]+)"') {
        Write-Host "Found image: $($matches[1])"
    }
}
