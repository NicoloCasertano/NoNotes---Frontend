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
import { ActivatedRoute } from '@angular/router';

import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.esm.js'
import EnvelopePlugin from 'wavesurfer.js/dist/plugins/envelope.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js';

import { WorkService } from '../../services/work-service';
import { AudioService } from '../../services/audio-service';

@Component({
  	standalone: true,
	selector: 'app-listening-area',
	imports: [CommonModule],
  	template: `
		
		
				<!-- Waveform visibile solo quando l'audio è caricato -->
		<div
		class="waveform"
		id="waveform"
		[class.loaded]="audioLoaded"
		*ngIf="audioLoaded"
		></div>

		<!-- Spectrogram opzionale -->
		<div
		id="spectrogram"
		class="spectrogram"
		[class.loaded]="audioLoaded"
		*ngIf="audioLoaded"
		></div>

		<!-- Pulsante Toggle -->
		<button (click)="togglePanel()">Toggle Panel</button>

		<!-- Pannello con pulsanti -->
		<div class="slide-panels" [class.open]="showPanel">
		<button>Envelope</button>
		<button>Zoom</button>
		<button>Regions</button>
		<button>Points</button>
		</div>
	`,
  	styleUrls: ['./listening-area.css']
})
export class ListeningArea implements OnDestroy, OnChanges, AfterViewInit{
	@ViewChild('waveformContainer', { static: true }) waveformRef!: ElementRef;
	@ViewChild('spectrogramContainer', { static: true }) spectrogramRef!: ElementRef;

	private wavesurfer!: WaveSurfer;

	audioFileName?: string;
	private envelope?: ReturnType<typeof EnvelopePlugin.create>;
	private zoom?: ReturnType<typeof ZoomPlugin.create>;
	private regions?: ReturnType<typeof RegionsPlugin.create>;
	private timeline?: ReturnType<typeof TimelinePlugin.create>;
	private hover?: ReturnType<typeof HoverPlugin.create>;

	constructor(
		private route: ActivatedRoute,
		private workService: WorkService,
		private audioService: AudioService
	) {}

	private isMobile = top!.matchMedia('(max-width: 900px)').matches;

	playing = false;
	// panelOpen = false;
	audioLoaded = false;
	showPanel = false;

	loading = true;
  	waveformReady = false;
  	loadError = false;

	public get fullUrl():string | null  {
		return this.audioFileName
		? `http://localhost:8080/api/audios/${this.audioFileName}`
		: null;
	}

	public get audioType(): string {
		if (!this.audioFileName) return 'audio/mpeg';
		const ext = this.audioFileName.split('.').pop()?.toLowerCase();
		return ext === 'wav' ? 'audio/wav' : 'audio/mpeg';
	}

	ngAfterViewInit(): void {
		const workId = Number(this.route.snapshot.paramMap.get('id'));

		this.workService.findWorkById(workId).subscribe({
			next: work => {
				if (!work.audio?.storedFileName) {
      				console.error('Nessun audio associato a questo work:', work);
					return;
    			} 

				const fullName = work.audio.storedFileName;
				this.audioFileName = fullName.includes('/') 
					? fullName.split('/').pop()! 
					: fullName;

				this.audioService.getByFileName(this.audioFileName).subscribe({
					next: blob => {
						if (!this.waveformRef?.nativeElement) {
							console.error('waveformRef non disponibile');
							return;
						}

						const audioUrl = URL.createObjectURL(blob);

						this.wavesurfer = WaveSurfer.create({
							container: '#waveform',
							waveColor: '#00ffff',
							progressColor: '#ffffff',
							cursorColor: '#333',
							backend: 'MediaElement',
							mediaControls: true,
							dragToSeek: true,
							minPxPerSec: 100,
							height: 100,
							plugins: 
								[TimelinePlugin.create({ container: '#timeline' })]
						});
						
						this.wavesurfer.on('ready', () => {
							this.audioLoaded = true;
						});

						this.wavesurfer.on('finish', () => {
							this.playing = false
						});

						this.wavesurfer.load(audioUrl);
					
					},
					error: err => {
						console.error('Errore download audio blob ', err)
						this.loading = false;
    					this.loadError = true;
					}
				});
			},
			error: err => console.error('Errore recupero work', err)
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['audioFileName'] && !changes['audioFileName'].isFirstChange()) {
			if(this.fullUrl) {
				this.wavesurfer.load(this.fullUrl);
			}
		}
	}
	showSpectrogram():void {
		if (!this.wavesurfer) {
			console.error('wavesurfer non inizializzato');
			return;
		}

		const spectrogramPLugin = this.wavesurfer.registerPlugin(
			SpectrogramPlugin.create({
				container: this.spectrogramRef.nativeElement, 
				labels: true,
				height: 200,
				splitChannels: true,
				scale: 'mel', // or 'linear', 'logarithmic', 'bark', 'erb'
				frequencyMax: 10000,
				frequencyMin: 10,
				fftSamples: 1024,
				labelsBackground: 'rgba(0, 0, 0, 0.1)',
			})
		);
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
				maxZoom: 1000,
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

	togglePanel() {
		this.showPanel = !this.showPanel;
	}

	ngOnDestroy(): void {
		this.wavesurfer?.destroy();
	}

  
}
