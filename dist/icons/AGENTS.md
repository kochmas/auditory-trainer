# Icon Assets

## Source files
- `master.psd`: master Photoshop source used to generate all icons.
- `brainybots.png` and `brainybots-transparent.png`: exported 512x512 logos with and without a background.

## Export sizes
The following PNGs are committed to the repository:

| Size | Output file |
| --- | --- |
| 96x96 | `icon-96x96.png` |
| 128x128 | `icon-128x128.png` |
| 152x152 | `icon-152x152.png` |
| 192x192 | `icon-192x192.png` |
| 512x512 | `icon-512x512.png` |
| 1024x1024 | `icon-1024x1024.png` |

## Regeneration
1. Open `master.psd` in a PSD-capable editor (e.g., Adobe Photoshop).
2. Ensure artwork is centered and export each size above as a PNG.
3. For `brainybots.png`, enable the background layer; for `brainybots-transparent.png`, disable it.

### Command-line alternative
If ImageMagick is installed, the icons can be regenerated via:

```bash
cd icons
magick master.psd -resize 96x96 icon-96x96.png
magick master.psd -resize 128x128 icon-128x128.png
magick master.psd -resize 152x152 icon-152x152.png
magick master.psd -resize 192x192 icon-192x192.png
magick master.psd -resize 512x512 icon-512x512.png
magick master.psd -resize 1024x1024 icon-1024x1024.png
```

## Requirements
- External tool: [ImageMagick](https://imagemagick.org) or Adobe Photoshop for PSD handling.
- No repository scripts are provided for icon generation; run the commands above manually.
