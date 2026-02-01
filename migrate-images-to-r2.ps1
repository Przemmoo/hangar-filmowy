# Skrypt migracji obrazków z Supabase Storage do Cloudflare R2
# Pobiera obrazki z Supabase i przesyła je do R2 bucket

Write-Host "🖼️  Migracja obrazków Supabase → Cloudflare R2" -ForegroundColor Cyan
Write-Host ""

# Pobierz listę obrazków z bazy danych
Write-Host "📋 Pobieranie listy obrazków z bazy danych..." -ForegroundColor Yellow
$queryResult = npx wrangler d1 execute hangar-filmowy-db --remote --command "SELECT url FROM media WHERE url LIKE 'https://egzyaaeifdwpmmksqzeg.supabase.co%'" --json 2>&1 | Where-Object { $_ -match '^\[' -or $_ -match '^\{' } | Out-String
$mediaData = $queryResult | ConvertFrom-Json

# Wyciągnij URL-e z wyników
$mediaList = @()
if ($mediaData[0].results) {
    $mediaList = $mediaData[0].results
}

if ($mediaList.Count -eq 0) {
    Write-Host "✅ Brak obrazków do migracji (wszystkie już na R2)" -ForegroundColor Green
    exit 0
}

# Stwórz folder tymczasowy
$tempDir = ".\temp-media-migration"
if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

Write-Host "📥 Znaleziono $($mediaList.Count) obrazków do migracji" -ForegroundColor Green
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($media in $mediaList) {
    $url = $media.url
    
    # Wyciągnij nazwę pliku z URL
    # Format: https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/FILENAME.png
    $filename = $url.Split('/')[-1]
    
    Write-Host "🔄 Przetwarzanie: $filename" -ForegroundColor Cyan
    
    try {
        # 1. Pobierz obrazek z Supabase
        $localPath = Join-Path $tempDir $filename
        Write-Host "  📥 Pobieranie z Supabase..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $url -OutFile $localPath -ErrorAction Stop
        
        # 2. Prześlij do R2
        Write-Host "  📤 Przesyłanie do R2..." -ForegroundColor Gray
        npx wrangler r2 object put "hangar-filmowy-media/$filename" --file="$localPath" --content-type="image/png" | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Sukces: $filename" -ForegroundColor Green
            $successCount++
            
            # Usuń lokalny plik
            Remove-Item $localPath -Force
        } else {
            Write-Host "  ❌ Błąd przesyłania do R2: $filename" -ForegroundColor Red
            $errorCount++
        }
        
    } catch {
        Write-Host "  ❌ Błąd: $_" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host ""
}

# Usuń folder tymczasowy jeśli jest pusty
if ((Get-ChildItem $tempDir).Count -eq 0) {
    Remove-Item $tempDir -Force
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Podsumowanie migracji obrazków:" -ForegroundColor Cyan
Write-Host "   ✅ Sukces: $successCount" -ForegroundColor Green
Write-Host "   ❌ Błędy:  $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "⚠️  NASTĘPNY KROK:" -ForegroundColor Yellow
    Write-Host "   Uruchom skrypt update-urls-to-r2.sql aby zaktualizować URL-e w bazie:" -ForegroundColor Yellow
    Write-Host "   npx wrangler d1 execute hangar-filmowy-db --remote --file=./update-urls-to-r2.sql" -ForegroundColor White
    Write-Host ""
}
