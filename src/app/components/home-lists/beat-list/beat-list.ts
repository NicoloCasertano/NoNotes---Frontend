import { Component, Input } from '@angular/core';
import { BeatModel } from '../../../models/beat-model';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-beat-list',
	imports: [RouterLink],
	templateUrl: './beat-list.html',
	styleUrl: './beat-list.css'
})
export class BeatList {
	@Input('beats')
	beats: BeatModel[] = [];
	beat!: BeatModel;
	isBeatsListEmpty(): boolean {
		return this.beats.length === 0;
	}

	getBeatColor(beat: BeatModel): string {
		const price = this.beat.beatPrice;
		if(price >= 100) return 'rgba(203, 208, 214, 0.98)';
		if(price >= 50) return 'rgba(191, 189, 183, 0.9)';
		if(price >= 20) return 'rgba(67, 76, 120, 0.5)';
		return '#FF453A';
	}
}
