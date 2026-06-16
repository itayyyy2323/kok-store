$urls = @{
    "lyon-home-2025.jpg" = "https://logo.clearbit.com/ol.fr"
    "england-home-2026.jpg" = "https://logo.clearbit.com/thefa.com"
    "spain-home-2026.jpg" = "https://logo.clearbit.com/rfef.es"
    "alnassr-home-2025.jpg" = "https://logo.clearbit.com/alnassr.sa"
    "liverpool-home-2025.jpg" = "https://logo.clearbit.com/liverpoolfc.com"
    "liverpool-away-2025.jpg" = "https://logo.clearbit.com/liverpoolfc.com"
    "juventus-home-2025.jpg" = "https://logo.clearbit.com/juventus.com"
    "juventus-away-2025.jpg" = "https://logo.clearbit.com/juventus.com"
}

foreach ($item in $urls.GetEnumerator()) {
    $imgPath = "public/images/$($item.Key)"
    Write-Host "Downloading $($item.Value) to $imgPath"
    try {
        Invoke-WebRequest -Uri $item.Value -OutFile $imgPath -ErrorAction Stop
    } catch {
        Write-Host "Failed to download $($item.Key): $_"
    }
}
Write-Host "All done!"
