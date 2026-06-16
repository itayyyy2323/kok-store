$ErrorActionPreference = "Continue"

$productsPath = "data/products.json"
$products = Get-Content -Raw -Path $productsPath | ConvertFrom-Json

foreach ($product in $products) {
    $imgName = $product.images[0]
    $imgPath = "public/images/$imgName"
    
    # Check if image is missing or too small (e.g., error page)
    if (Test-Path $imgPath) {
        $size = (Get-Item $imgPath).length
        if ($size -gt 10000) {
            # Likely a valid image (over 10KB), skip
            continue
        }
    }
    
    $teamEn = $product.teamEn
    if ($teamEn -eq "Al-Hilal") { $teamEn = "Al Hilal" }
    if ($teamEn -eq "Al-Nassr") { $teamEn = "Al Nassr" }
    if ($teamEn -eq "Al-Ittihad") { $teamEn = "Al Ittihad" }

    $teamQuery = [uri]::EscapeDataString($teamEn)
    $url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=$teamQuery"
    
    try {
        Start-Sleep -Seconds 2 # Avoid rate limits
        $json = Invoke-RestMethod -Uri $url -ErrorAction Stop
        if ($json.teams -and $json.teams.Count -gt 0) {
            $team = $json.teams[0]
            $imgUrl = $team.strEquipment
            if ([string]::IsNullOrWhiteSpace($imgUrl)) {
                $imgUrl = $team.strBadge
            }
            if (-not [string]::IsNullOrWhiteSpace($imgUrl)) {
                Write-Host "Downloading $imgUrl -> $imgPath"
                Invoke-WebRequest -Uri $imgUrl -OutFile $imgPath -ErrorAction Stop
            } else {
                Write-Host "No image for $teamEn" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Team not found in SportsDB: $teamEn" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Failed to fetch for $teamEn : $_" -ForegroundColor Red
    }
}
Write-Host "Done filling missing images."
