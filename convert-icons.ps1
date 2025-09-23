# PowerShell script to convert BMP to multiple PNG sizes
Add-Type -AssemblyName System.Drawing

# Load source BMP image
$sourcePath = "C:\Users\User\Desktop\Project_Official\official_all_git\leave_apply_system\public\icons\cold_logo_bw.bmp"
$outputDir = "C:\Users\User\Desktop\Project_Official\official_all_git\leave_apply_system\public\icons\"

# Check if source file exists
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source file not found: $sourcePath"
    exit 1
}

try {
    # Load original image
    $originalImage = [System.Drawing.Image]::FromFile($sourcePath)
    
    # PWA required sizes
    $sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
    
    foreach ($size in $sizes) {
        Write-Host "Generating ${size}x${size} icon..."
        
        # Create new image
        $newImage = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        
        # Set high quality rendering
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        # Draw resized image
        $graphics.DrawImage($originalImage, 0, 0, $size, $size)
        
        # Save as PNG
        $outputPath = "${outputDir}icon-${size}x${size}.png"
        $newImage.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Clean up resources
        $graphics.Dispose()
        $newImage.Dispose()
        
        Write-Host "Generated: icon-${size}x${size}.png"
    }
    
    # Clean up original image
    $originalImage.Dispose()
    Write-Host "All icons generated successfully!"
    
} catch {
    Write-Error "Error during conversion: $($_.Exception.Message)"
    exit 1
}
