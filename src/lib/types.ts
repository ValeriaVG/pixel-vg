export enum MirrorMode {
	None,
	X,
	Y
}

export enum ImageDataType {
	url = 'url',
	pixels = 'pixels'
}

export enum ImageType {
	png = 'png',
	svg = 'svg'
}

export type ColoredPixels = Array<[number, number, string]>;

export type ImageDataFn = (type: ImageDataType) => string | ColoredPixels;
