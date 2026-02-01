# Prosty skrypt migracji obrazków z Supabase do R2
# Lista obrazków pobrana z bazy danych

Write-Host "🖼️  Migracja obrazków Supabase → Cloudflare R2" -ForegroundColor Cyan
Write-Host ""

# Lista URL-i z bazy danych (pobrana wcześniej)
$imageUrls = @(
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/2d4c9bdb-be33-490e-a77f-15eae702af66.png",
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/e22e59d9-e184-486e-978e-23564a6442c7.png",
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/5599a0e6-f9e1-4823-a8db-51e7bc283d91.png",
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/2193db9a-af2b-49e6-9aad-8981287b4bd9.png",
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/b76cab8f-f023-40a5-9cf4-512ce30e726e.png",
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/be46b7f9-0db2-43a4-b1c8-f09d28395bd4.png",
    "https://egzyaaeifdwpmmksqzeg.supabase.co/storage/v1/object/public/hangar-media/571ceffa-20f8-4ac6-8387-d057be4f1dde.png"
)

# Stwórz folder tymczasowy
$tempDir = ".\temp-media-migration"
if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

Write-Host "📥 Znaleziono $($imageUrls.Count) obrazków do migracji" -ForegroundColor Green
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($url in $imageUrls) {
    # Wyciągnij nazwę pliku
    $filename = $url.Split('/')[-1]
    
    Write-Host "🔄 $filename" -ForegroundColor Cyan
    
    try {
        # 1. Pobierz z Supabase
        $localPath = Join-Path $tempDir $filename
        Write-Host "   📥 Pobieranie..." -ForegroundColor Gray -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $localPath -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        
        # 2. Prześlij do R2 (REMOTE)
        Write-Host "   📤 Przesyłanie do R2..." -ForegroundColor Gray -NoNewline
        $result = npx wrangler r2 object put "hangar-filmowy-media/$filename" --file="$localPath" --content-type="image/png" --remote 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK" -ForegroundColor Green
            $successCount++
            Remove-Item $localPath -Force
        } else {
            Write-Host " BŁĄD" -ForegroundColor Red
            Write-Host "   $result" -ForegroundColor Red
            $errorCount++
        }
        
    } catch {
        Write-Host " BŁĄD: $_" -ForegroundColor Red
        $errorCount++
    }
}

# Usuń folder tymczasowy
if (Test-Path $tempDir) {
    if ((Get-ChildItem $tempDir).Count -eq 0) {
        Remove-Item $tempDir -Force
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Podsumowanie:" -ForegroundColor Cyan
Write-Host "   ✅ Sukces: $successCount" -ForegroundColor Green
Write-Host "   ❌ Błędy:  $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "⚠️  NASTĘPNY KROK - uruchom aktualizację URL-i w bazie:" -ForegroundColor Yellow
    Write-Host "   npx wrangler d1 execute hangar-filmowy-db --remote --file=./update-urls-to-r2.sql" -ForegroundColor White
    Write-Host ""
}
