import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function main() {
    const logoPath = path.join('public', 'logo.png');
    if (!fs.existsSync(logoPath)) {
        console.error('Logo not found at:', logoPath);
        process.exit(1);
    }

    const image = await Jimp.read(logoPath);

    const densities = [
        { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
        { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
        { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
        { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
        { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 }
    ];

    for (const d of densities) {
        const resDir = path.join('android', 'app', 'src', 'main', 'res', d.name);
        if (!fs.existsSync(resDir)) {
            fs.mkdirSync(resDir, { recursive: true });
        }

        // ic_launcher.png
        const iconImg = image.clone().resize({ w: d.size, h: d.size });
        await iconImg.write(path.join(resDir, 'ic_launcher.png'));

        // ic_launcher_round.png
        const roundImg = image.clone().resize({ w: d.size, h: d.size });
        await roundImg.write(path.join(resDir, 'ic_launcher_round.png'));

        // ic_launcher_foreground.png
        const fgImg = image.clone().resize({ w: d.fgSize, h: d.fgSize });
        await fgImg.write(path.join(resDir, 'ic_launcher_foreground.png'));

        console.log(`Generated icons for ${d.name}`);
    }

    // Generate iOS AppIcon (1024x1024)
    const iosIconDir = path.join('ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
    if (fs.existsSync(iosIconDir)) {
        const iosImg = image.clone().resize({ w: 1024, h: 1024 });
        await iosImg.write(path.join(iosIconDir, 'AppIcon-512@2x.png'));
        console.log('Generated iOS AppIcon (1024x1024)');
    }

    console.log('All launcher icons generated successfully!');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
