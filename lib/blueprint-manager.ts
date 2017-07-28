import * as path from 'path';

export class TemplateMetadata {
	fullUrl: string;
	relativeUrl: string;
}

export class BlueprintManager {
	constructor(private $fs: IFileSystem) {
	}

	listTemplates(blueprintType: string): TemplateMetadata[] {
		const directory = this.getSourcePath(blueprintType);
		return this.findAllTemplates(directory, '');
	}

	findAllTemplates(fullPath: string, relativePath: string): TemplateMetadata[] {
		const items: TemplateMetadata[] = [];

		const directoryContents = this.$fs.readDirectory(fullPath);

		directoryContents.forEach(itemName => {
			let fullItemPath = path.join(fullPath, itemName);
			let relativeItemPath = path.join(relativePath, itemName);

			if (this.isDirectory(fullItemPath)) {
				const newItems = this.findAllTemplates(fullItemPath, relativeItemPath);
				items.push(...newItems);
			} else {
				items.push({
					fullUrl: fullItemPath,
					relativeUrl: relativeItemPath
				});
			}
		});

		return items;
	}

	isDirectory(url: string) {
		const stat = this.$fs.getFsStats(url);

		return stat.isDirectory();
	}

	getSourcePath(blueprintType: string): string {
		const blueprintsDir = this.getPathToBlueprints();

		return path.join(blueprintsDir, blueprintType, 'files');
	}

	getPathToBlueprints(): string {
		return path.join(__dirname, '..', 'blueprints');
	}

}

$injector.register('blueprintManager', BlueprintManager);
