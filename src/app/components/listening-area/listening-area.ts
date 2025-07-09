import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram.esm.js'
import { ActivatedRoute } from '@angular/router';
import WaveSurfer from 'wavesurfer.js';
import EnvelopePlugin from 'wavesurfer.js/dist/plugins/envelope.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js';
import { WorkService } from '../../services/work-service';
import { AudioService } from '../../services/audio-service';
import { Block } from '@angular/compiler';

@Component({
  	standalone: true,
	selector: 'app-listening-area',
	imports: [CommonModule],
  	template: `
		
		<div id="timeline"></div>
		<button (click)="spectrogram()">Spectrogram</button>
		<button (click)="togglePlay()">
			{{ playing ? 'Pause' : 'Play' }}
		</button>
		<button (click)="panelOpen = !panelOpen">Toogle Panel</button>
		<div class="slide-panels" [class.open]="panelOpen">
			<h3>Plugin Tools</h3>
			
			<button (click)="enableEnvelope()">Envelope</button>
			<button (click)="enableZoom()">Zoom</button>
			<button (click)="enableRegions()">Regions</button>
			<button (click)="enableTimeline()">Timeline</button>
			<button (click)="enableHover()">Pointers</button>
		</div>

		<div #waveformContainer class="waveform"></div>
		<audio *ngIf="fullUrl" controls style="width:100%; margin-top:1rem; height: 100px">
      		<source [src]="fullUrl" [type]="audioType" />
      		Il tuo browser non supporta l’elemento audio.
    	</audio>
	`,
  	styles: [`
		.waveform { width: 100%; height: 100px; }
		#timeline { width: 100%; height: 20px; }
	`]
})
export class ListeningArea implements OnDestroy, OnChanges, AfterViewInit{
	@ViewChild('waveformContainer', { static: true }) 
	waveformRef!: ElementRef;

	audioFileName?: string;

	constructor(
		private route: ActivatedRoute,
		private workService: WorkService,
		private audioService: AudioService
	) {}

	private wavesurfer!: WaveSurfer;
	private isMobile = top!.matchMedia('(max-width: 900px)').matches;

	private envelope?: ReturnType<typeof EnvelopePlugin.create>;
	private zoom?: ReturnType<typeof ZoomPlugin.create>;
	private regions?: ReturnType<typeof RegionsPlugin.create>;
	private timeline?: ReturnType<typeof TimelinePlugin.create>;
	private hover?: ReturnType<typeof HoverPlugin.create>;

	playing = false;
	panelOpen = false;

	public get fullUrl():string | null  {
		return this.audioFileName
		? `http://localhost:8080/api/audios/${this.audioFileName}`
		: null;
	}

	public get audioType(): string {
		if (!this.audioFileName) return 'audio/mpeg';
		const ext = this.audioFileName.split('.').pop()?.toLowerCase();
		switch (ext) {
			case 'wav': return 'audio/wav';
			case 'mp3': default: return 'audio/mpeg';
		}
	}

	ngAfterViewInit(): void {
		const workId = Number(this.route.snapshot.paramMap.get('id'));
		
		this.workService.findWorkById(workId).subscribe({
			next: work => {
				if (work.audio?.storedFileName) {
      				const url = `http://localhost:8080/api/audios/${this.fullUrl}`;
    			} else {
					console.error('Nessun audio associato a questo work:', work);
				}

				const fullName = work.audio.storedFileName;
				this.audioFileName = fullName.includes('/') 
					? fullName.split('/').pop()! 
					: fullName;
				this.audioService.getByFileName(this.audioFileName!).subscribe({
					next: blob => {
						this.wavesurfer.loadBlob(blob);
					},
					error: err => console.error('Errore download audio blob ', err)
				});
				
			},
			error: err => console.error('Errore recupero work', err)
		});
		this.wavesurfer = WaveSurfer.create({
			container: this.waveformRef.nativeElement,
			waveColor: '#ddd',
			progressColor: '#555',
			cursorColor: '#333',
			backend: 'MediaElement',
			mediaControls: true,
			dragToSeek: true,
			minPxPerSec: 100,
			plugins: [TimelinePlugin.create({ container: '#timeline' })]
    	});
		this.wavesurfer.on('error', (e) => console.error('Wavesurfer error:', e));
		this.wavesurfer.on('ready', () => (this.playing = false));
		this.wavesurfer.on('finish', () => (this.playing = false));
		// this.initWaveSurfer();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['audioFileName'] && !changes['audioFileName'].isFirstChange()) {
			if(this.fullUrl) {
				this.wavesurfer.load(this.fullUrl);
			}
		}
	}

  	private initWaveSurfer() {
		// this.enableTimeline();
		// this.wavesurfer.on('ready', () => (this.playing = false));
		// this.wavesurfer.on('finish', () => (this.playing = false));
	}
	spectrogram():void {
		this.wavesurfer.registerPlugin(
			Spectrogram.create({
				labels: true,
				height: 200,
				splitChannels: true,
				scale: 'mel', // or 'linear', 'logarithmic', 'bark', 'erb'
				frequencyMax: 8000,
				frequencyMin: 0,
				fftSamples: 1024,
				labelsBackground: 'rgba(0, 0, 0, 0.1)',
  			}),
		)
	}
  	togglePlay(): void {
		this.wavesurfer.playPause();
		this.playing = this.wavesurfer.isPlaying();
  	}

  	enableEnvelope() {
		if (!this.envelope) {
			this.envelope = this.wavesurfer.registerPlugin(
				EnvelopePlugin.create({
					volume: 0.8,
					lineColor: 'rgba(4, 9, 56, 0.42)',
					lineWidth: '4',
					dragPointSize: this.isMobile ? 20 : 8,
					dragLine: !this.isMobile,
					dragPointFill: 'rgba(255, 255, 255, 0.8)',
					dragPointStroke: 'rgba(0, 0, 0, 0.5)',
					points: [
						{ time: 11.2, volume: 0.5 },
						{ time: 15.5, volume: 0.8 },
					],
				})
			);
			this.envelope.on('points-change', (points) =>
				console.log('Envelope changed', points)
			);
		}
  	}

	enableZoom() {
		if (!this.zoom) {
		this.zoom = this.wavesurfer.registerPlugin(
			ZoomPlugin.create({
			scale: 0.5,
			maxZoom: 100,
			})
		);
		this.wavesurfer.on('zoom', (minPxPerSec) =>
			console.log('Zoom level:', minPxPerSec)
		);
		}
	}

	enableRegions() {
		if (!this.regions) {
			this.regions = this.wavesurfer.registerPlugin(RegionsPlugin.create());
		}
	}

	enableTimeline() {
		if (!this.timeline) {
		this.timeline = this.wavesurfer.registerPlugin(
			TimelinePlugin.create({ container: '#timeline' })
		);
		}
	}

	enableHover() {
		if (!this.hover) {
		this.hover = this.wavesurfer.registerPlugin(
			HoverPlugin.create({
			lineColor: '#ff0000',
			lineWidth: 1,
			labelBackground: '#555',
			labelColor: '#fff',
			labelSize: '15px',
			labelPreferLeft: false,
			})
		);
		}
	}
	ngOnDestroy(): void {
		this.wavesurfer.destroy();
	}

  
}
