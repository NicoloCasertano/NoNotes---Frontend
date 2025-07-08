import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import EnvelopePlugin from 'wavesurfer.js/dist/plugins/envelope.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js';

@Component({
  	standalone: true,
	selector: 'app-listening-area',
	imports: [CommonModule],
  	template: `
		<div #waveformContainer class="waveform"></div>
		<div id="timeline"></div>
		<!-- Nuovo player nativo HTML5 -->
		<audio 
			*ngIf="audioUrl" 
			[src]="'http://localhost:8080/' + audioUrl" 
			controls 
			style="width: 100%; margin-top: 1rem;">
			Il tuo browser non supporta l’elemento audio.
		</audio>
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
		<button (click)="enableHover()">Hover</button>
		</div>
	`,
  	styles: [`
		.waveform { width: 100%; height: 100px; }
		#timeline { width: 100%; height: 20px; }
	`]
})
export class ListeningArea implements OnInit, OnDestroy {
  @ViewChild('waveformContainer', { static: true }) 
  waveformRef!: ElementRef;

  @Input() audioUrl?: string = '';

  private wavesurfer!: WaveSurfer;
  private isMobile = top!.matchMedia('(max-width: 900px)').matches;

  private envelope?: ReturnType<typeof EnvelopePlugin.create>;
  private zoom?: ReturnType<typeof ZoomPlugin.create>;
  private regions?: ReturnType<typeof RegionsPlugin.create>;
  private timeline?: ReturnType<typeof TimelinePlugin.create>;
  private hover?: ReturnType<typeof HoverPlugin.create>;

  playing = false;
  panelOpen = false;

  ngOnInit(): void {
		this.initWaveSurfer();
		if(this.audioUrl) {
			this.wavesurfer.load(this.audioUrl);
		}
  }

  ngOnChange(changes: SimpleChanges) {
	if(changes['audioUrl'] && !changes['audioUrl'].isFirstChange()) {
		const newUrl = changes['audioUrl'].currentValue as string;
		if(newUrl) {
			this.wavesurfer.load(newUrl);
		}
	}
  }

  private initWaveSurfer() {
		this.wavesurfer = WaveSurfer.create({
			container: this.waveformRef.nativeElement,
			waveColor: '#ddd',
			progressColor: '#555',
			cursorColor: '#333',
			dragToSeek: true,
			minPxPerSec: 100,
		});

    	this.wavesurfer.load(this.audioUrl!);

		this.wavesurfer.on('ready', () => (this.playing = false));
		this.wavesurfer.on('finish', () => (this.playing = false));
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
