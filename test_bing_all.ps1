$query = "Manchester City 2024 2025 home kit"
$encodedQuery = [uri]::EscapeDataString($query)
$url = "https://www.bing.com/images/search?q=$encodedQuery"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
$html = Invoke-RestMethod -Uri $url -Headers $headers

$pattern = 'murl&quot;:&quot;([^&]+)&quot;'
$matches = [regex]::Matches($html, $pattern)
for ($i=0; $i -lt [math]::Min(5, $matches.Count); $i++) {
    Write-Host "Match $($i+1): $($matches[$i].Groups[1].Value)"
}
