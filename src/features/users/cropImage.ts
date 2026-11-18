import type { Area } from 'react-easy-crop';

const OUTPUT_SIZE = 512;

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('No se ha podido leer la foto.'));
        image.src = src;
    });
}

/**
 * Recorta la zona elegida y la reduce a un JPEG cuadrado pequeño antes de subirla:
 * así una foto de 5 MB del móvil se queda en unos pocos KB y no choca con el límite de 2 MB.
 * El servidor la vuelve a procesar de todas formas.
 */
export async function cropToJpeg(src: string, area: Area): Promise<Blob> {
    const image = await loadImage(src);
    const size = Math.min(OUTPUT_SIZE, Math.round(area.width));
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Tu navegador no permite editar fotos.');

    context.imageSmoothingQuality = 'high';
    context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size, size);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) =>
                blob ? resolve(blob) : reject(new Error('No se ha podido preparar la foto.')),
            'image/jpeg',
            0.9,
        );
    });
}
