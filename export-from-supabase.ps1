# Automatyczna migracja danych Supabase → D1
# Wykonaj: .\export-from-supabase.ps1

# Wczytaj zmienne z .env.local
Write-Host "📂 Ładuję zmienne z .env.local..." -ForegroundColor Cyan

if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Błąd: Plik .env.local nie istnieje!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
$SUPABASE_URL = if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL=(.+)') { $matches[1].Trim() } else { $null }
$SUPABASE_KEY = if ($envContent -match 'SUPABASE_SERVICE_ROLE_KEY=(.+)') { $matches[1].Trim() } else { $null }

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Host "❌ Błąd: Nie znaleziono zmiennych Supabase w .env.local!" -ForegroundColor Red
    Write-Host "Upewnij się że .env.local zawiera:" -ForegroundColor Yellow
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL=..." -ForegroundColor White
    Write-Host "  SUPABASE_SERVICE_ROLE_KEY=..." -ForegroundColor White
    exit 1
}

Write-Host "✅ Zmienne załadowane z .env.local" -ForegroundColor Green

$headers = @{
    'apikey' = $SUPABASE_KEY
    'Authorization' = "Bearer $SUPABASE_KEY"
    'Content-Type' = 'application/json'
}

Write-Host "🔄 Rozpoczynam eksport z Supabase..." -ForegroundColor Cyan

# Funkcja do escapowania pojedynczych cudzysłowów dla SQL
function Escape-SQL {
    param($value)
    if ($null -eq $value) { return "NULL" }
    if ($value -is [bool]) { return if ($value) { "1" } else { "0" } }
    if ($value -is [int] -or $value -is [long]) { return $value.ToString() }
    
    # Escape newlines, carriage returns i single quotes
    $escaped = $value.ToString().Replace("'", "''").Replace("`n", "\n").Replace("`r", "\r")
    return "'" + $escaped + "'"
}

# Pobierz dane z każdej tabeli
$sqlOutput = @()
$sqlOutput += "-- Migracja danych z Supabase do D1"
$sqlOutput += "-- Wygenerowano: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$sqlOutput += ""
$sqlOutput += "-- Wszystkie inserty w jednej transakcji"
$sqlOutput += "BEGIN TRANSACTION;"
$sqlOutput += "PRAGMA foreign_keys = OFF;"
$sqlOutput += ""

# USERS
Write-Host "📊 Pobieram użytkowników..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/users?select=*" -Headers $headers
    Write-Host "   Znaleziono: $($users.Count) użytkowników" -ForegroundColor Green
    
    if ($users.Count -gt 0) {
        $sqlOutput += "-- Users ($($users.Count) rekordów)"
        foreach ($user in $users) {
            $id = Escape-SQL $user.id
            $email = Escape-SQL $user.email
            $password = Escape-SQL $user.password
            $name = Escape-SQL $user.name
            $role = Escape-SQL $user.role
            $createdAt = Escape-SQL $user.createdAt
            $updatedAt = Escape-SQL $user.updatedAt
            
            $sqlOutput += "INSERT INTO users (id, email, password, name, role, createdAt, updatedAt) VALUES ($id, $email, $password, $name, $role, $createdAt, $updatedAt);"
        }
        $sqlOutput += ""
    }
} catch {
    Write-Host "   ⚠️  Błąd pobierania users: $_" -ForegroundColor Red
}

# FORM SUBMISSIONS
Write-Host "📊 Pobieram zgłoszenia formularzy..." -ForegroundColor Yellow
try {
    $submissions = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/form_submissions?select=*" -Headers $headers
    Write-Host "   Znaleziono: $($submissions.Count) zgłoszeń" -ForegroundColor Green
    
    if ($submissions.Count -gt 0) {
        $sqlOutput += "-- Form Submissions ($($submissions.Count) rekordów)"
        foreach ($sub in $submissions) {
            $id = Escape-SQL $sub.id
            $firstName = Escape-SQL $sub.firstName
            $lastName = Escape-SQL $sub.lastName
            $email = Escape-SQL $sub.email
            $phone = Escape-SQL $sub.phone
            $message = Escape-SQL $sub.message
            $eventType = Escape-SQL $sub.eventType
            $audienceSize = $sub.audienceSize
            $extras = Escape-SQL ($sub.extras | ConvertTo-Json -Compress)
            $estimatedLevel = Escape-SQL $sub.estimatedLevel
            $preferredDate = Escape-SQL $sub.preferredDate
            $status = Escape-SQL $sub.status
            $createdAt = Escape-SQL $sub.createdAt
            $updatedAt = Escape-SQL $sub.updatedAt
            
            $sqlOutput += "INSERT INTO form_submissions (id, firstName, lastName, email, phone, message, eventType, audienceSize, extras, estimatedLevel, preferredDate, status, createdAt, updatedAt) VALUES ($id, $firstName, $lastName, $email, $phone, $message, $eventType, $audienceSize, $extras, $estimatedLevel, $preferredDate, $status, $createdAt, $updatedAt);"
        }
        $sqlOutput += ""
    }
} catch {
    Write-Host "   ⚠️  Błąd pobierania submissions: $_" -ForegroundColor Red
}

# MEDIA
Write-Host "📊 Pobieram media..." -ForegroundColor Yellow
try {
    $media = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/media?select=*" -Headers $headers
    Write-Host "   Znaleziono: $($media.Count) plików" -ForegroundColor Green
    
    if ($media.Count -gt 0) {
        $sqlOutput += "-- Media ($($media.Count) rekordów)"
        foreach ($m in $media) {
            $id = Escape-SQL $m.id
            $filename = Escape-SQL $m.filename
            $url = Escape-SQL $m.url
            $alt = Escape-SQL $m.alt
            $size = $m.size
            $mimeType = Escape-SQL $m.mimeType
            $width = if ($m.width) { $m.width } else { "NULL" }
            $height = if ($m.height) { $m.height } else { "NULL" }
            $uploadedBy = Escape-SQL $m.uploadedBy
            $createdAt = Escape-SQL $m.createdAt
            
            $sqlOutput += "INSERT INTO media (id, filename, url, alt, size, mimeType, width, height, uploadedBy, createdAt) VALUES ($id, $filename, $url, $alt, $size, $mimeType, $width, $height, $uploadedBy, $createdAt);"
        }
        $sqlOutput += ""
    }
} catch {
    Write-Host "   ⚠️  Błąd pobierania media: $_" -ForegroundColor Red
}

# CONTENT
Write-Host "📊 Pobieram content..." -ForegroundColor Yellow
try {
    $content = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/content?select=*" -Headers $headers
    Write-Host "   Znaleziono: $($content.Count) sekcji" -ForegroundColor Green
    
    if ($content.Count -gt 0) {
        $sqlOutput += "-- Content ($($content.Count) rekordów)"
        foreach ($c in $content) {
            $id = Escape-SQL $c.id
            $section = Escape-SQL $c.section
            $data = Escape-SQL ($c.data | ConvertTo-Json -Compress)
            $updatedAt = Escape-SQL $c.updatedAt
            $updatedBy = Escape-SQL $c.updatedBy
            
            $sqlOutput += "INSERT INTO content (id, section, data, updatedAt, updatedBy) VALUES ($id, $section, $data, $updatedAt, $updatedBy);"
        }
        $sqlOutput += ""
    }
} catch {
    Write-Host "   ⚠️  Błąd pobierania content: $_" -ForegroundColor Red
}

# SETTINGS
Write-Host "📊 Pobieram ustawienia..." -ForegroundColor Yellow
try {
    $settings = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/settings?select=*" -Headers $headers
    Write-Host "   Znaleziono: $($settings.Count) ustawień" -ForegroundColor Green
    
    if ($settings.Count -gt 0) {
        $sqlOutput += "-- Settings ($($settings.Count) rekordów)"
        foreach ($s in $settings) {
            $key = Escape-SQL $s.key
            $value = Escape-SQL ($s.value | ConvertTo-Json -Compress)
            $updatedAt = Escape-SQL $s.updatedAt
            $updatedBy = Escape-SQL $s.updatedBy
            
            $sqlOutput += "INSERT INTO settings (key, value, updatedAt, updatedBy) VALUES ($key, $value, $updatedAt, $updatedBy);"
        }
        $sqlOutput += ""
    }
} catch {
    Write-Host "   ⚠️  Błąd pobierania settings: $_" -ForegroundColor Red
}

# SUBMISSION REPLIES
Write-Host "📊 Pobieram odpowiedzi..." -ForegroundColor Yellow
try {
    $replies = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/submission_replies?select=*" -Headers $headers
    Write-Host "   Znaleziono: $($replies.Count) odpowiedzi" -ForegroundColor Green
    
    if ($replies.Count -gt 0) {
        $sqlOutput += "-- Submission Replies ($($replies.Count) rekordów)"
        foreach ($r in $replies) {
            $id = Escape-SQL $r.id
            $submissionId = Escape-SQL $r.submissionId
            $subject = Escape-SQL $r.subject
            $message = Escape-SQL $r.message
            $sentBy = Escape-SQL $r.sentBy
            $sentByName = Escape-SQL $r.sentByName
            $createdAt = Escape-SQL $r.createdAt
            
            $sqlOutput += "INSERT INTO submission_replies (id, submissionId, subject, message, sentBy, sentByName, createdAt) VALUES ($id, $submissionId, $subject, $message, $sentBy, $sentByName, $createdAt);"
        }
        $sqlOutput += ""
    }
} catch {
    Write-Host "   ⚠️  Błąd pobierania replies: $_" -ForegroundColor Red
}

# Końcowe komendy
$sqlOutput += ""
$sqlOutput += "PRAGMA foreign_keys = ON;"
$sqlOutput += "COMMIT;"

# Zapisz do pliku
$outputFile = ".\migrate-data.sql"
$sqlOutput | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host ""
Write-Host "✅ Eksport zakończony pomyślnie!" -ForegroundColor Green
Write-Host "📁 Plik zapisany jako: $outputFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Następny krok - zaimportuj do D1:" -ForegroundColor Yellow
Write-Host "   npx wrangler d1 execute hangar-filmowy-db --local --file=./migrate-data.sql" -ForegroundColor White
Write-Host "   npx wrangler d1 execute hangar-filmowy-db --remote --file=./migrate-data.sql" -ForegroundColor White
