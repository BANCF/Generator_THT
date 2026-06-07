# Local HTTP Server for Tin Hoc Tre Generator (Plain ASCII to avoid encoding backtick escapes)
$port = 8080
$localPath = "C:\Users\Admin\.gemini\antigravity\scratch\tin-hoc-tre-generator"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  SERVER RUNNING AT: http://localhost:$port/" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "Copy the link above and paste it into Chrome/Edge."
    Write-Host "Press [Ctrl + C] to stop the server."
    Write-Host ""

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.RawUrl.Split('?')[0]
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        # Normalize path
        $urlPath = $urlPath.Replace("/", "\")
        $filePath = Join-Path $localPath $urlPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain; charset=utf-8"
            if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "text/javascript; charset=utf-8" }
            
            # CORS Headers
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server Error: $_" -ForegroundColor Red
} finally {
    if ($listener) { $listener.Stop() }
}
