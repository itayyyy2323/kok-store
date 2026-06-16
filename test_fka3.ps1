$query = "Manchester City 2024 2025 home kit footballkitarchive.com"
$encodedQuery = [uri]::EscapeDataString($query)
$url = "https://www.bing.com/images/search?q=$encodedQuery"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
$html = Invoke-RestMethod -Uri $url -Headers $headers

if ($html -match 'murl&quot;:&quot;([^&]+)&quot;') {
    Write-Host "Found image: $($matches[1])"
} else {
    Write-Host "No image found."
}
