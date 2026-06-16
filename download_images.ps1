$ErrorActionPreference = "Continue"

if (!(Test-Path "public/images")) {
    New-Item -ItemType Directory -Path "public/images" | Out-Null
}

$productsPath = "data/products.json"
$products = Get-Content -Raw -Path $productsPath | ConvertFrom-Json

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

foreach ($product in $products) {
    $imgName = $product.images[0]
    $imgPath = "public/images/$imgName"
    
    if (Test-Path $imgPath) {
        if ((Get-Item $imgPath).length -gt 0) {
            Write-Host "Image $imgName already exists, skipping."
            continue
        }
    }
    
    $query = "$($product.teamEn) $($product.type) kit $($product.year) jersey official front"
    if ($product.league -eq "world-cup") {
        $query = "$($product.teamEn) $($product.type) kit $($product.year) world cup jersey official front"
    }
    
    $encodedQuery = [uri]::EscapeDataString($query)
    $url = "https://www.bing.com/images/search?q=$encodedQuery"
    
    Write-Host "Searching image for $($product.id) ($query)..."
    try {
        $html = Invoke-RestMethod -Uri $url -Headers $headers -ErrorAction Stop
        
        # Look for the first image URL
        if ($html -match 'murl&quot;:&quot;([^&]+)&quot;') {
            $imgUrl = $matches[1]
            Write-Host "Downloading $imgUrl -> $imgPath"
            try {
                Invoke-WebRequest -Uri $imgUrl -OutFile $imgPath -Headers $headers -ErrorAction Stop
                Start-Sleep -Milliseconds 500
            } catch {
                Write-Host "Download failed for $imgUrl" -ForegroundColor Red
            }
        } else {
            Write-Host "No image found for $query" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Search failed for $query : $_" -ForegroundColor Red
    }
}

Write-Host "Done downloading images."
