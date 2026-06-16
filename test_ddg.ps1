$query = "Manchester City kit"
$url = "https://html.duckduckgo.com/html/?q=" + [uri]::EscapeDataString($query)
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
try {
    $html = Invoke-RestMethod -Uri $url -Headers $headers
    $matches = [regex]::Matches($html, 'img[^>]+src="([^"]+)"')
    Write-Host "Found $($matches.Count) images"
    for ($i=0; $i -lt [math]::Min(5, $matches.Count); $i++) {
        Write-Host "Image $($i+1): $($matches[$i].Groups[1].Value)"
    }
} catch {
    Write-Host "Error: $_"
}
