$ErrorActionPreference = "Continue"

if (!(Test-Path "public/images")) {
    New-Item -ItemType Directory -Path "public/images" | Out-Null
}

$productsPath = "data/products.json"
$products = Get-Content -Raw -Path $productsPath | ConvertFrom-Json

foreach ($product in $products) {
    $imgName = $product.images[0]
    $imgPath = "public/images/$imgName"
    
    $teamQuery = [uri]::EscapeDataString($product.teamEn)
    $url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=$teamQuery"
    
    try {
        $json = Invoke-RestMethod -Uri $url -ErrorAction Stop
        if ($json.teams -and $json.teams.Count -gt 0) {
            $team = $json.teams[0]
            $imgUrl = $team.strEquipment
            
            # Fallback to badge if equipment is missing
            if ([string]::IsNullOrWhiteSpace($imgUrl)) {
                $imgUrl = $team.strBadge
            }
            
            if (-not [string]::IsNullOrWhiteSpace($imgUrl)) {
                Write-Host "Downloading $imgUrl -> $imgPath"
                Invoke-WebRequest -Uri $imgUrl -OutFile $imgPath -ErrorAction Stop
                Start-Sleep -Milliseconds 200
            } else {
                Write-Host "No equipment or badge found for $($product.teamEn)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Team not found in SportsDB: $($product.teamEn)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Failed to fetch for $($product.teamEn) : $_" -ForegroundColor Red
    }
}

Write-Host "Done downloading SportsDB images."
