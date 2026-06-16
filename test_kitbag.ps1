$query = "Manchester City home shirt 2024"
$url = "https://www.kitbag.com/en/search/" + [uri]::EscapeDataString($query)
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
try {
    $html = Invoke-RestMethod -Uri $url -Headers $headers
    $matches = [regex]::Matches($html, '<img[^>]+src="([^"]+)"')
    for ($i=0; $i -lt [math]::Min(5, $matches.Count); $i++) {
        Write-Host "Image $($i+1): $($matches[$i].Groups[1].Value)"
    }
} catch {
    Write-Host "Error: $_"
}
